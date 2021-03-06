import {BaseController} from './_BaseController';
import {Material} from 'three/src/materials/Material';
import {Texture} from 'three/src/textures/Texture';
import {BaseMatNodeType} from '../_Base';

import {ParamConfig} from '../../utils/params/ParamsConfig';
import {NodeContext} from '../../../poly/NodeContext';
import {BaseCopNodeType} from '../../cop/_Base';
import {OperatorPathParam, OPERATOR_PATH_DEFAULT} from '../../../params/OperatorPath';
import {BooleanParam} from '../../../params/Boolean';
import {BaseNodeType} from '../../_Base';
import {BaseParamType} from '../../../params/_Base';
import {ShaderMaterial} from 'three/src/materials/ShaderMaterial';
import {IUniform} from 'three/src/renderers/shaders/UniformsLib';
import {IUniforms} from '../../../../core/geometry/Material';

export function TextureMapParamConfig<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		use_map = ParamConfig.BOOLEAN(0);
		map = ParamConfig.OPERATOR_PATH(OPERATOR_PATH_DEFAULT.NODE.UV, {visible_if: {use_map: 1}});
	};
}
// class TextureMapMaterial<T extends string> extends Material {
// 	[T]!: Texture | null;
// }
// class TextureMapParamsConfig extends TextureMapParamConfig(NodeParamsConfig) {}
// class TextureMapMatNode extends TypedMatNode<TextureMapMaterial, TextureMapParamsConfig> {
// 	create_material() {
// 		return new TextureMapMaterial();
// 	}
// }

type FilterFlags<Base, Condition> = {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;

// type test = FilterFlags<MeshLambertMaterial, Texture|null>
// type test2 = AllowedNames<MeshLambertMaterial, Texture|null>
// type test3 = SubType<MeshLambertMaterial, Texture|null>

export function BooleanParamOptions(controller_class: typeof BaseTextureMapController) {
	return {
		cook: false,
		callback: (node: BaseNodeType, param: BaseParamType) => {
			controller_class.update(node as BaseMatNodeType);
		},
	};
}
export function OperatorPathOptions(controller: typeof BaseTextureMapController, use_map_name: string) {
	return {
		visible_if: {[use_map_name]: 1},
		node_selection: {context: NodeContext.COP},
		cook: false,
		callback: (node: BaseNodeType, param: BaseParamType) => {
			controller.update(node as BaseMatNodeType);
		},
	};
}

type TextureUpdateCallback<O extends Object> = (
	material: Material,
	object: O,
	mat_attrib_name: keyof SubType<O, Texture | null>,
	texture: Texture
) => void;
type TextureRemoveCallback<O extends Object> = (
	material: Material,
	object: O,
	mat_attrib_name: keyof SubType<O, Texture | null>
) => void;

type CurrentMaterial = Material | ShaderMaterial;

export interface UpdateOptions {
	direct_params?: boolean;
	uniforms?: boolean;
	define?: boolean;
	define_uv?: boolean;
}
export class BaseTextureMapController extends BaseController {
	constructor(protected node: BaseMatNodeType, protected _update_options: UpdateOptions) {
		super(node);
		if (this._update_options.define == null) {
			this._update_options.define = true;
		}
		if (this._update_options.define_uv == null) {
			this._update_options.define_uv = true;
		}
	}

	protected add_hooks(use_map_param: BooleanParam, path_param: OperatorPathParam) {
		use_map_param.add_post_dirty_hook('TextureController', () => {
			this.update();
		});
		path_param.add_post_dirty_hook('TextureController', () => {
			this.update();
		});
	}
	static update(node: BaseNodeType) {}

	async _update<M extends CurrentMaterial>(
		material: M,
		mat_attrib_name: string,
		use_map_param: BooleanParam,
		path_param: OperatorPathParam
	) {
		if (this._update_options.uniforms) {
			const shader_material = material as ShaderMaterial;
			const attr_name = mat_attrib_name as keyof SubType<IUniforms, Texture | null>;
			await this._update_texture_on_uniforms(shader_material, attr_name, use_map_param, path_param);
		}
		if (this._update_options.direct_params) {
			const mat = material as Material;
			const attr_name = mat_attrib_name as keyof SubType<Material, Texture | null>;
			await this._update_texture_on_material(mat, attr_name, use_map_param, path_param);
		}
	}

	//
	//
	// FOR CASES WHERE THE TEXTURE IS ON THE UNIFORMS
	//
	//
	async _update_texture_on_uniforms<O extends IUniform>(
		material: ShaderMaterial,
		mat_attrib_name: keyof SubType<O, Texture | null>,
		use_map_param: BooleanParam,
		path_param: OperatorPathParam
	) {
		this._update_required_attribute(
			material,
			material.uniforms,
			mat_attrib_name as never,
			use_map_param,
			path_param,
			this._apply_texture_on_uniforms.bind(this),
			this._remove_texture_from_uniforms.bind(this)
		);
	}
	private _apply_texture_on_uniforms<O extends IUniforms>(
		material: Material,
		uniforms: O,
		mat_attrib_name: keyof SubType<O, Texture | null>,
		texture: Texture
	) {
		const has_texture = uniforms[mat_attrib_name] != null && uniforms[mat_attrib_name].value != null;
		let new_texture_is_different = false;
		if (has_texture) {
			const current_texture: Texture = (<unknown>uniforms[mat_attrib_name].value) as Texture;
			if (current_texture.uuid != texture.uuid) {
				new_texture_is_different = true;
			}
		}
		if (!has_texture || new_texture_is_different) {
			uniforms[mat_attrib_name].value = texture as any;
			if (this._do_update_define()) {
				const define_name = this._define_name(`${mat_attrib_name}`);
				material.defines[define_name] = 1;
			}
			if (this._update_options.define_uv) {
				material.defines['USE_UV'] = 1;
			}
			material.needsUpdate = true;
		}
	}
	private _remove_texture_from_uniforms<U extends IUniforms>(
		material: Material,
		uniforms: U,
		mat_attrib_name: keyof SubType<U, Texture | null>
	) {
		if (uniforms[mat_attrib_name].value) {
			uniforms[mat_attrib_name].value = null;
			if (this._do_update_define()) {
				const define_name = this._define_name(`${mat_attrib_name}`);
				delete material.defines[define_name];
			}
			material.needsUpdate = true;
		}
	}
	private _define_name(mat_attrib_name: string): string {
		return 'USE_' + mat_attrib_name.replace('_', '').toUpperCase();
	}

	//
	//
	// FOR CASES WHERE THE TEXTURE IS ON THE MATERIAL
	//
	//
	async _update_texture_on_material<M extends Material>(
		material: M,
		mat_attrib_name: keyof SubType<M, Texture | null>,
		use_map_param: BooleanParam,
		path_param: OperatorPathParam
	) {
		this._update_required_attribute(
			material,
			material,
			mat_attrib_name,
			use_map_param,
			path_param,
			this._apply_texture_on_material.bind(this),
			this._remove_texture_from_material.bind(this)
		);
	}
	private _apply_texture_on_material<M extends Material>(
		material: Material,
		texture_owner: M,
		mat_attrib_name: keyof SubType<M, Texture | null>,
		texture: Texture
	) {
		const has_texture = texture_owner[mat_attrib_name] != null;
		let new_texture_is_different = false;
		if (has_texture) {
			const current_texture: Texture = (<unknown>texture_owner[mat_attrib_name]) as Texture;
			if (current_texture.uuid != texture.uuid) {
				new_texture_is_different = true;
			}
		}
		if (!has_texture || new_texture_is_different) {
			texture_owner[mat_attrib_name] = texture as any;
			material.needsUpdate = true;
		}
	}
	private _remove_texture_from_material<M extends Material>(
		material: Material,
		texture_owner: M,
		mat_attrib_name: keyof SubType<M, Texture | null>
	) {
		if (texture_owner[mat_attrib_name]) {
			texture_owner[mat_attrib_name] = null as any;
			material.needsUpdate = true;
		}
	}

	//
	//
	// MAIN ALGO to decide if texture should be updated
	//
	//
	private async _update_required_attribute<O extends Object>(
		material: Material,
		texture_owner: O,
		mat_attrib_name: keyof SubType<O, Texture | null>,
		use_map_param: BooleanParam,
		path_param: OperatorPathParam,
		update_callback: TextureUpdateCallback<O>,
		remove_callback: TextureRemoveCallback<O>
	) {
		if (use_map_param.is_dirty) {
			await use_map_param.compute();
		}
		const use_map: boolean = use_map_param.value;

		if (use_map) {
			if (path_param.is_dirty) {
				await path_param.compute();
			}

			const found_node = path_param.found_node();
			if (found_node) {
				if (found_node.node_context() == NodeContext.COP) {
					const texture_node = found_node as BaseCopNodeType;

					const container = await texture_node.request_container();
					const texture = container.texture();

					if (texture) {
						update_callback(material, texture_owner, mat_attrib_name, texture);
						return;
					} else {
						this.node.states.error.set(`found node has no texture`);
					}
				} else {
					this.node.states.error.set(`found map node is not a COP node`);
				}
			} else {
				this.node.states.error.set(`could not find map node ${path_param.name} with path ${path_param.value}`);
			}
		}
		// this is not wrapped in an else clause after the "if (use_map) {"
		// as we should come here after any of the errors above, if any is triggered
		remove_callback(material, texture_owner, mat_attrib_name);
	}

	private _do_update_define(): boolean {
		if (this._update_options.define == null) {
			return true;
		}
		return this._update_options.define;
	}
}
