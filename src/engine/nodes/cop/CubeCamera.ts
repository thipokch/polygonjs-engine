// // import NodeBase from '../_Base'

// import {BaseNodeCop} from './_Base';
// import {CubeCameraObj} from 'src/engine/nodes/obj/CubeCamera';
// // import {BaseParam} from 'src/Engine/Param/_Base'
// // import {CoreTextureLoader} from 'src/Core/Loader/Texture'
// // import {CoreScriptLoader} from 'src/Core/Loader/Script'

// // import {PMREMGenerator} from 'three/src/extras/PMREMGenerator'
// // const THREE = {PMREMGenerator}

// export class CubeCamera extends BaseNodeCop {
// 	@ParamS('cube_camera') _param_cube_camera: string;
// 	static type() {
// 		return 'cube_camera';
// 	}

// 	// private _texture_loader: CoreTextureLoader

// 	constructor() {
// 		super();
// 	}

// 	create_params() {
// 		this.add_param(ParamType.OPERATOR_PATH, 'cube_camera', '/cube_camera1', {
// 			node_selection: {
// 				context: NodeContext.OBJ,
// 			},
// 			dependent_on_found_node: true,
// 		});
// 		this.add_param(ParamType.BUTTON, 'update', null, {
// 			callback: this.cook.bind(this),
// 		});
// 	}

// 	async cook() {
// 		const cube_camera_node = this.params.get_operator_path('cube_camera').found_node();
// 		if (cube_camera_node != null) {
// 			const render_target = (cube_camera_node as CubeCameraObj).render_target();

// 			this.set_texture(render_target.texture);
// 		} else {
// 			this.states.error.set(`cube camera linked to non existing node '${this._param_cube_camera}'`);
// 		}
// 	}
// }
