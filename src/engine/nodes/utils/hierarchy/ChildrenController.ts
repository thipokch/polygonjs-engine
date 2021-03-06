import {CoreString} from '../../../../core/String';
import {BaseNodeType} from '../../_Base';
import lodash_keys from 'lodash/keys';
import lodash_sortBy from 'lodash/sortBy';
import lodash_values from 'lodash/values';
import {NodeEvent} from '../../../poly/NodeEvent';
import {NodeContext} from '../../../poly/NodeContext';
import {NameController} from '../NameController';
import {CoreNodeSelection} from '../../../../core/NodeSelection';
import {Poly} from '../../../Poly';
import {ParamsInitData} from '../io/IOController';
import {CoreGraphNodeId} from '../../../../core/graph/CoreGraph';
import {BaseOperationContainer} from '../../../../core/operation/container/_Base';
import {SopOperationContainer} from '../../../../core/operation/container/sop';
import {BaseSopOperation} from '../../../../core/operation/sop/_Base';

type OutputNodeFindMethod = (() => BaseNodeType) | undefined;

export class HierarchyChildrenController {
	private _children: Dictionary<BaseNodeType> = {};
	private _children_by_type: Dictionary<CoreGraphNodeId[]> = {};
	private _children_and_grandchildren_by_context: Dictionary<CoreGraphNodeId[]> = {};

	private _selection: CoreNodeSelection | undefined;
	get selection(): CoreNodeSelection {
		return (this._selection = this._selection || new CoreNodeSelection(this.node));
	}
	constructor(protected node: BaseNodeType, private _context: NodeContext) {}
	get context() {
		return this._context;
	}

	//
	//
	// OUTPUT NODE
	//
	//
	private _output_node_find_method: (() => BaseNodeType) | undefined;
	set_output_node_find_method(method: OutputNodeFindMethod) {
		this._output_node_find_method = method;
	}
	output_node() {
		if (this._output_node_find_method) {
			return this._output_node_find_method();
		}
	}

	//
	//
	//
	//
	//

	// TODO: when copy pasting a node called bla_11, the next one will be renamed bla_110 instead of 12
	set_child_name(node: BaseNodeType, new_name: string): void {
		//return if node.name() == new_name
		let current_child_with_name;
		new_name = new_name.replace(/[^A-Za-z0-9]/g, '_');
		new_name = new_name.replace(/^[0-9]/, '_'); // replace first char if not a letter

		if ((current_child_with_name = this._children[new_name]) != null) {
			// only return if found node is same as argument node, and if new_name is same as current_name
			if (node.name === new_name && current_child_with_name.graph_node_id === node.graph_node_id) {
				return;
			}

			// increment new_name
			new_name = CoreString.increment(new_name);

			return this.set_child_name(node, new_name);
		} else {
			// let current_child;
			const current_name = node.name;

			// delete old entry if node was in _children with old name
			const current_child = this._children[current_name];
			if (current_child) {
				delete this._children[current_name];
			}

			// add to new name
			this._children[new_name] = node;
			node.name_controller.update_name_from_parent(new_name);
			this._add_to_nodes_by_type(node);
			this.node.scene.nodes_controller.add_to_instanciated_node(node);
		}
	}

	node_context_signature() {
		return `${this.node.node_context()}/${this.node.type}`;
	}

	available_children_classes() {
		return Poly.instance().registered_nodes(this._context, this.node.type);
	}

	is_valid_child_type(node_type: string): boolean {
		const node_class = this.available_children_classes()[node_type];
		return node_class != null;
	}

	create_node(node_type: string, params_init_value_overrides?: ParamsInitData): BaseNodeType {
		const node_class = this.available_children_classes()[node_type];

		if (node_class == null) {
			const message = `child node type '${node_type}' not found for node '${this.node.full_path()}'. Available types are: ${Object.keys(
				this.available_children_classes()
			).join(', ')}, ${this._context}, ${this.node.type}`;
			console.error(message);
			throw message;
		} else {
			const child_node = new node_class(this.node.scene, `child_node_${node_type}`, params_init_value_overrides);
			child_node.initialize_base_and_node();
			this.add_node(child_node);
			child_node.lifecycle.set_creation_completed();
			return child_node;
		}
	}
	create_operation_container(
		operation_type: string,
		operation_container_name: string,
		params_init_value_overrides?: ParamsInitData
	): BaseOperationContainer {
		const operation_class = Poly.instance().registered_operation(this._context, operation_type);

		if (operation_class == null) {
			const message = `no operation found with context ${this._context}/${operation_type}`;
			console.error(message);
			throw message;
		} else {
			const operation = new operation_class(this.node.scene) as BaseSopOperation;
			const operation_container = new SopOperationContainer(
				operation,
				operation_container_name,
				params_init_value_overrides || {}
			);
			return operation_container;
		}
	}

	add_node(child_node: BaseNodeType) {
		child_node.set_parent(this.node);
		child_node.params.init();
		child_node.parent_controller.on_set_parent();
		child_node.name_controller.run_post_set_full_path_hooks();
		if (child_node.children_allowed() && child_node.children_controller) {
			for (let child of child_node.children_controller.children()) {
				child.name_controller.run_post_set_full_path_hooks();
			}
		}
		this.node.emit(NodeEvent.CREATED, {child_node_json: child_node.to_json()});
		if (this.node.scene.lifecycle_controller.on_create_hook_allowed()) {
			child_node.lifecycle.run_on_create_hooks();
		}
		child_node.lifecycle.run_on_add_hooks();
		this.set_child_name(child_node, NameController.base_name(child_node));
		this.node.lifecycle.run_on_child_add_hooks(child_node);

		if (child_node.require_webgl2()) {
			this.node.scene.webgl_controller.set_require_webgl2();
		}

		this.node.scene.missing_expression_references_controller.check_for_missing_references(child_node);

		return child_node;
	}

	remove_node(child_node: BaseNodeType): void {
		if (child_node.parent != this.node) {
			return console.warn(`node ${child_node.name} not under parent ${this.node.full_path()}`);
		} else {
			if (this.selection.contains(child_node)) {
				this.selection.remove([child_node]);
			}

			const first_connection = child_node.io.connections.first_input_connection();
			const input_connections = child_node.io.connections.input_connections();
			const output_connections = child_node.io.connections.output_connections();
			if (input_connections) {
				for (let input_connection of input_connections) {
					if (input_connection) {
						input_connection.disconnect({set_input: true});
					}
				}
			}
			if (output_connections) {
				for (let output_connection of output_connections) {
					if (output_connection) {
						output_connection.disconnect({set_input: true});
						if (first_connection) {
							const old_src = first_connection.node_src;
							const old_output_index = output_connection.output_index;
							const old_dest = output_connection.node_dest;
							const old_input_index = output_connection.input_index;
							old_dest.io.inputs.set_input(old_input_index, old_src, old_output_index);
						}
					}
				}
			}

			// remove from children
			child_node.set_parent(null);
			delete this._children[child_node.name];
			this._remove_from_nodes_by_type(child_node);
			this.node.scene.nodes_controller.remove_from_instanciated_node(child_node);

			// set other dependencies dirty
			// Note that this call to set_dirty was initially before this._children_node.remove_graph_input
			// but that prevented the obj/geo node to properly clear its sop_group if this was the last node
			// if (this._is_dependent_on_children && this._children_node) {
			// 	this._children_node.set_successors_dirty(this.node);
			// }
			child_node.set_successors_dirty(this.node);
			// disconnect successors
			child_node.graph_disconnect_successors();

			this.node.lifecycle.run_on_child_remove_hooks(child_node);
			child_node.lifecycle.run_on_delete_hooks();
			child_node.emit(NodeEvent.DELETED, {parent_id: this.node.graph_node_id});
		}
	}

	_add_to_nodes_by_type(node: BaseNodeType) {
		const node_id = node.graph_node_id;
		const type = node.type;
		this._children_by_type[type] = this._children_by_type[type] || [];
		if (!this._children_by_type[type].includes(node_id)) {
			this._children_by_type[type].push(node_id);
		}
		this.add_to_children_and_grandchildren_by_context(node);
	}
	_remove_from_nodes_by_type(node: BaseNodeType) {
		const node_id = node.graph_node_id;
		const type = node.type;
		if (this._children_by_type[type]) {
			const index = this._children_by_type[type].indexOf(node_id);
			if (index >= 0) {
				this._children_by_type[type].splice(index, 1);
				if (this._children_by_type[type].length == 0) {
					delete this._children_by_type[type];
				}
			}
		}
		this.remove_from_children_and_grandchildren_by_context(node);
	}
	add_to_children_and_grandchildren_by_context(node: BaseNodeType) {
		const node_id = node.graph_node_id;
		const type = node.node_context();
		this._children_and_grandchildren_by_context[type] = this._children_and_grandchildren_by_context[type] || [];
		if (!this._children_and_grandchildren_by_context[type].includes(node_id)) {
			this._children_and_grandchildren_by_context[type].push(node_id);
		}
		if (this.node.parent && this.node.parent.children_allowed()) {
			this.node.parent.children_controller?.add_to_children_and_grandchildren_by_context(node);
		}
	}
	remove_from_children_and_grandchildren_by_context(node: BaseNodeType) {
		const node_id = node.graph_node_id;
		const type = node.node_context();
		if (this._children_and_grandchildren_by_context[type]) {
			const index = this._children_and_grandchildren_by_context[type].indexOf(node_id);
			if (index >= 0) {
				this._children_and_grandchildren_by_context[type].splice(index, 1);
				if (this._children_and_grandchildren_by_context[type].length == 0) {
					delete this._children_and_grandchildren_by_context[type];
				}
			}
		}
		if (this.node.parent && this.node.parent.children_allowed()) {
			this.node.parent.children_controller?.remove_from_children_and_grandchildren_by_context(node);
		}
	}

	nodes_by_type(type: string): BaseNodeType[] {
		const node_ids = this._children_by_type[type] || [];
		const graph = this.node.scene.graph;
		const nodes: BaseNodeType[] = [];
		for (let node_id of node_ids) {
			const node = graph.node_from_id(node_id) as BaseNodeType;
			if (node) {
				nodes.push(node);
			}
		}
		return nodes;
	}
	child_by_name(name: string) {
		return this._children[name];
	}

	has_children_and_grandchildren_with_context(context: NodeContext) {
		return this._children_and_grandchildren_by_context[context] != null;
	}

	children(): BaseNodeType[] {
		return lodash_values(this._children);
	}
	children_names() {
		return lodash_sortBy(lodash_keys(this._children));
	}

	traverse_children(callback: (arg0: BaseNodeType) => void) {
		for (let child of this.children()) {
			callback(child);

			child.children_controller?.traverse_children(callback);
		}
	}
}
