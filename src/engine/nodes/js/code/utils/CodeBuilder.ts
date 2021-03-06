import lodash_uniq from 'lodash/uniq';
import {BaseJsNodeType} from '../../_Base';
import {TypedNodeTraverser} from '../../../utils/shaders/NodeTraverser';
import {BaseNodeType} from '../../../_Base';
import {BaseJsFunctionAssembler} from '../assemblers/_Base';
import {MapUtils} from '../../../../../core/MapUtils';
import {JsDefinitionType, BaseJsDefinition} from '../../utils/JsDefinition';
import {TypedJsDefinitionCollection} from '../../utils/JsDefinitionCollection';
import {ParamConfigsController} from '../../../../nodes/utils/code/controllers/ParamConfigsController';
import {LinesController} from './LinesController';
import {JsCodeFormatter} from './CodeFormatter';

import {JsLineType} from './LineType';
import {JsParamConfig} from './ParamConfig';
import {ParamType} from '../../../../poly/ParamType';
import {NodeContext} from '../../../../poly/NodeContext';
import {ShaderName} from '../../../utils/shaders/ShaderName';
import {CoreGraphNodeId} from '../../../../../core/graph/CoreGraph';

export class JsCodeBuilder {
	_param_configs_controller: ParamConfigsController<JsParamConfig<ParamType>> = new ParamConfigsController();
	_param_configs_set_allowed: boolean = true;

	private _lines_controller: LinesController | undefined;
	_lines: Map<ShaderName, Map<JsLineType, string[]>> = new Map();

	constructor(private _assembler: BaseJsFunctionAssembler, private _gl_parent_node: BaseNodeType) {}

	async build_from_nodes(root_nodes: BaseJsNodeType[]) {
		const node_traverser = new TypedNodeTraverser<NodeContext.JS>(
			this._gl_parent_node,
			this._assembler.shader_names,
			(root_node, shader_name) => {
				return this._assembler.input_names_for_shader_name(root_node, shader_name);
			}
		);
		node_traverser.traverse(root_nodes);

		const nodes_by_shader_name: Map<ShaderName, BaseJsNodeType[]> = new Map();
		for (let shader_name of this.shader_names()) {
			const nodes = node_traverser.nodes_for_shader_name(shader_name);
			nodes_by_shader_name.set(shader_name, nodes);
		}
		const sorted_nodes = node_traverser.sorted_nodes();
		for (let shader_name of this.shader_names()) {
			const root_nodes_for_shader = this._assembler.root_nodes_by_shader_name(shader_name);

			for (let root_node of root_nodes_for_shader) {
				MapUtils.push_on_array_at_entry(nodes_by_shader_name, shader_name, root_node);
			}
		}

		// ensure nodes are not added if already present
		const sorted_node_ids: Map<CoreGraphNodeId, boolean> = new Map();
		for (let node of sorted_nodes) {
			sorted_node_ids.set(node.graph_node_id, true);
		}

		for (let root_node of root_nodes) {
			if (!sorted_node_ids.get(root_node.graph_node_id)) {
				sorted_nodes.push(root_node);
				sorted_node_ids.set(root_node.graph_node_id, true);
			}
		}
		for (let node of sorted_nodes) {
			// node.set_assembler(this._assembler);
			node.reset_code();
		}
		for (let node of sorted_nodes) {
			await node.params.eval_all();
		}

		this._lines_controller = new LinesController();
		this.reset();
		for (let shader_name of this.shader_names()) {
			const nodes = lodash_uniq(nodes_by_shader_name.get(shader_name));
			if (nodes) {
				for (let node of nodes) {
					// node.set_shader_name(shader_name);
					if (this._param_configs_set_allowed) {
						node.set_param_configs();
					}
					node.set_lines(this._lines_controller);
				}
			}
		}

		if (this._param_configs_set_allowed) {
			this.set_param_configs(sorted_nodes);
		}
		this.set_code_lines(sorted_nodes);
	}

	disallow_new_param_configs() {
		this._param_configs_set_allowed = false;
	}
	allow_new_param_configs() {
		this._param_configs_set_allowed = true;
	}

	shader_names() {
		return this._assembler.shader_names;
	}

	private reset() {
		for (let shader_name of this.shader_names()) {
			const lines_map = new Map();
			// for (let line_type of LINE_TYPES) {
			// 	lines_map.set(line_type, []);
			// }
			this._lines.set(shader_name, lines_map);
			// this._function_declared.set(shader_name, new Map());
		}
	}

	param_configs() {
		return this._param_configs_controller.list || [];
	}
	lines(line_type: JsLineType) {
		const shader_name = ShaderName.VERTEX;
		return this._lines.get(shader_name)!.get(line_type);
	}
	all_lines() {
		return this._lines;
	}

	set_param_configs(nodes: BaseJsNodeType[]) {
		this._param_configs_controller.reset();
		for (let node of nodes) {
			const param_configs = node.param_configs();
			if (param_configs) {
				for (let param_config of param_configs) {
					this._param_configs_controller.push(param_config);
				}
			}
		}
	}

	set_code_lines(nodes: BaseJsNodeType[]) {
		// for (let shader_name of this.shader_names()) {
		// nodes.forEach((node, i)=>{
		this.add_code_lines(nodes);
		// })
		// }
	}

	add_code_lines(nodes: BaseJsNodeType[]) {
		this.add_definitions(nodes, JsDefinitionType.FUNCTION, JsLineType.FUNCTION_DECLARATION);
		this.add_definitions(nodes, JsDefinitionType.UNIFORM, JsLineType.DEFINE);
		this.add_definitions(nodes, JsDefinitionType.ATTRIBUTE, JsLineType.DEFINE);

		this.add_code_line_for_nodes_and_line_type(nodes, JsLineType.BODY);
	}

	private add_definitions(nodes: BaseJsNodeType[], definition_type: JsDefinitionType, line_type: JsLineType) {
		if (!this._lines_controller) {
			return;
		}
		const definitions = [];
		for (let node of nodes) {
			let node_definitions = this._lines_controller.definitions(node);
			if (node_definitions) {
				node_definitions = node_definitions.filter((d) => d.definition_type == definition_type);
				for (let definition of node_definitions) {
					definitions.push(definition);
				}
			}
		}

		if (definitions.length > 0) {
			const collection = new TypedJsDefinitionCollection<JsDefinitionType>(definitions);
			const uniq_definitions = collection.uniq();
			if (collection.errored) {
				// TODO: handle error
				throw `code builder error: ${collection.error_message}`;
			}

			const definitions_by_node_id: Map<CoreGraphNodeId, BaseJsDefinition[]> = new Map();
			const node_ids: Map<CoreGraphNodeId, boolean> = new Map();
			for (let definition of uniq_definitions) {
				const node_id = definition.node.graph_node_id;
				if (!node_ids.has(node_id)) {
					node_ids.set(node_id, true);
				}
				MapUtils.push_on_array_at_entry(definitions_by_node_id, node_id, definition);
			}
			const shader_name = ShaderName.VERTEX;
			const lines_for_shader = this._lines.get(shader_name)!;
			node_ids.forEach((_, node_id) => {
				const definitions = definitions_by_node_id.get(node_id);
				if (definitions) {
					const first_definition = definitions[0];

					if (first_definition) {
						const comment = JsCodeFormatter.node_comment(first_definition.node, line_type);
						MapUtils.push_on_array_at_entry(lines_for_shader, line_type, comment);

						for (let definition of definitions) {
							const line = JsCodeFormatter.line_wrap(definition.line, line_type);
							MapUtils.push_on_array_at_entry(lines_for_shader, line_type, line);
						}
						const separator = JsCodeFormatter.post_line_separator(line_type);
						MapUtils.push_on_array_at_entry(lines_for_shader, line_type, separator);
					}
				}
			});
		}
	}
	add_code_line_for_nodes_and_line_type(nodes: BaseJsNodeType[], line_type: JsLineType) {
		nodes = nodes.filter((node) => {
			if (this._lines_controller) {
				const lines = this._lines_controller.body_lines(node);
				return lines && lines.length > 0;
			}
		});

		var nodes_count = nodes.length;
		for (let i = 0; i < nodes_count; i++) {
			const is_last = i == nodes.length - 1;
			this.add_code_line_for_node_and_line_type(nodes[i], line_type, is_last);
		}
	}
	add_code_line_for_node_and_line_type(node: BaseJsNodeType, line_type: JsLineType, is_last: boolean): void {
		if (!this._lines_controller) {
			return;
		}
		const lines = this._lines_controller.body_lines(node);

		if (lines && lines.length > 0) {
			const shader_name = ShaderName.VERTEX;
			const lines_for_shader = this._lines.get(shader_name)!;
			const comment = JsCodeFormatter.node_comment(node, line_type);
			MapUtils.push_on_array_at_entry(lines_for_shader, line_type, comment);
			lodash_uniq(lines).forEach((line) => {
				line = JsCodeFormatter.line_wrap(line, line_type);
				MapUtils.push_on_array_at_entry(lines_for_shader, line_type, line);
			});
			if (!(line_type == JsLineType.BODY && is_last)) {
				const separator = JsCodeFormatter.post_line_separator(line_type);
				MapUtils.push_on_array_at_entry(lines_for_shader, line_type, separator);
			}
		}
	}
}
