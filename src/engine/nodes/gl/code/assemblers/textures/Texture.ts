import {BaseGlShaderAssembler} from '../_Base';
import {IUniforms} from '../../../../../../core/geometry/Material';
import {ThreeToGl} from '../../../../../../core/ThreeToGl';
import TemplateDefault from '../../templates/textures/Default.frag.glsl';
import {ShaderConfig} from '../../configs/ShaderConfig';
import {VariableConfig} from '../../configs/VariableConfig';
import {ShaderName} from '../../../../utils/shaders/ShaderName';
import {OutputGlNode} from '../../../Output';
import {GlobalsGlNode} from '../../../Globals';
import {GlConnectionPointType, GlConnectionPoint} from '../../../../utils/io/connections/Gl';
import {ShadersCollectionController} from '../../utils/ShadersCollectionController';
import {UniformGLDefinition} from '../../../utils/GLDefinition';
import {BuilderCopNode} from '../../../../cop/Builder';
import {IUniformsWithTime} from '../../../../../scene/utils/UniformsController';

export class ShaderAssemblerTexture extends BaseGlShaderAssembler {
	private _uniforms: IUniforms | undefined;

	get _template_shader() {
		return {
			fragmentShader: TemplateDefault,
			vertexShader: undefined,
			uniforms: undefined,
		};
	}

	fragment_shader() {
		return this._shaders_by_name.get(ShaderName.FRAGMENT);
	}

	uniforms() {
		return this._uniforms;
	}

	update_fragment_shader() {
		this._lines = new Map();
		this._shaders_by_name = new Map();
		for (let shader_name of this.shader_names) {
			if (shader_name == ShaderName.FRAGMENT) {
				const template = this._template_shader.fragmentShader;
				this._lines.set(shader_name, template.split('\n'));
			}
		}
		if (this._root_nodes.length > 0) {
			this.build_code_from_nodes(this._root_nodes);
			this._build_lines();
		}

		this._uniforms = this._uniforms || {};
		this.add_uniforms(this._uniforms);

		for (let shader_name of this.shader_names) {
			const lines = this._lines.get(shader_name);
			if (lines) {
				this._shaders_by_name.set(shader_name, lines.join('\n'));
			}
		}

		BuilderCopNode.handle_dependencies(
			this._gl_parent_node as BuilderCopNode,
			this.uniforms_time_dependent(),
			this._uniforms as IUniformsWithTime
		);
	}

	//
	//
	// CHILDREN NODES PARAMS
	//
	//
	add_output_inputs(output_child: OutputGlNode) {
		// output_child.add_param(ParamType.COLOR, 'color', [1, 1, 1], {hidden: true});
		// output_child.add_param(ParamType.FLOAT, 'alpha', 1, {hidden: true});
		output_child.io.inputs.set_named_input_connection_points([
			new GlConnectionPoint('color', GlConnectionPointType.VEC3),
			new GlConnectionPoint('alpha', GlConnectionPointType.FLOAT),
		]);
	}
	add_globals_outputs(globals_node: GlobalsGlNode) {
		globals_node.io.outputs.set_named_output_connection_points([
			new GlConnectionPoint('gl_FragCoord', GlConnectionPointType.VEC2),
			new GlConnectionPoint('time', GlConnectionPointType.FLOAT),
			// new Connection.Vec2('resolution'),
		]);
	}

	//
	//
	// CONFIGS
	//
	//
	create_shader_configs() {
		return [new ShaderConfig(ShaderName.FRAGMENT, ['color', 'alpha'], [])];
	}
	create_variable_configs() {
		return [
			new VariableConfig('color', {
				prefix: 'diffuseColor.xyz = ',
			}),
			new VariableConfig('alpha', {
				prefix: 'diffuseColor.a = ',
				default: '1.0',
			}),
		];
	}

	//
	//
	// TEMPLATE HOOKS
	//
	//
	protected insert_define_after(shader_name: ShaderName) {
		return '// INSERT DEFINE';
	}
	protected insert_body_after(shader_name: ShaderName) {
		return '// INSERT BODY';
	}
	protected lines_to_remove(shader_name: ShaderName) {
		return ['// INSERT DEFINE', '// INSERT BODY'];
	}

	handle_gl_FragCoord(body_lines: string[], shader_name: ShaderName, var_name: string) {
		if (shader_name == 'fragment') {
			body_lines.push(`vec2 ${var_name} = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y)`);
		}
	}

	set_node_lines_output(output_node: OutputGlNode, shaders_collection_controller: ShadersCollectionController) {
		const input_names = this.input_names_for_shader_name(
			output_node,
			shaders_collection_controller.current_shader_name
		);
		if (input_names) {
			for (let input_name of input_names) {
				const input = output_node.io.inputs.named_input(input_name);

				if (input) {
					const gl_var = output_node.variable_for_input(input_name);

					let body_line: string | undefined;
					if (input_name == 'color') {
						body_line = `diffuseColor.xyz = ${ThreeToGl.any(gl_var)}`;
					}
					if (input_name == 'alpha') {
						body_line = `diffuseColor.a = ${ThreeToGl.any(gl_var)}`;
					}
					if (body_line) {
						shaders_collection_controller.add_body_lines(output_node, [body_line]);
					}
				}
			}
		}
	}

	set_node_lines_globals(globals_node: GlobalsGlNode, shaders_collection_controller: ShadersCollectionController) {
		const shader_name = shaders_collection_controller.current_shader_name;
		const shader_config = this.shader_config(shader_name);
		if (!shader_config) {
			return;
		}
		const body_lines: string[] = [];
		const definitions: UniformGLDefinition[] = [];

		for (let output_name of globals_node.io.outputs.used_output_names()) {
			const var_name = globals_node.gl_var_name(output_name);

			switch (output_name) {
				case 'time':
					definitions.push(new UniformGLDefinition(globals_node, GlConnectionPointType.FLOAT, output_name));

					body_lines.push(`float ${var_name} = ${output_name}`);

					this.set_uniforms_time_dependent();
					break;

				case 'gl_FragCoord':
					this.handle_gl_FragCoord(body_lines, shader_name, var_name);
					break;
			}
		}

		shaders_collection_controller.add_definitions(globals_node, definitions, shader_name);
		shaders_collection_controller.add_body_lines(globals_node, body_lines);
	}
}
