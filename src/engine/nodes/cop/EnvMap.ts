import {Texture} from 'three/src/textures/Texture';
import {PMREMGenerator} from 'three/src/extras/PMREMGenerator';
import {TypedCopNode} from './_Base';
import {InputCloneMode} from '../../poly/InputCloneMode';
import {DataTextureController, DataTextureControllerBufferType} from './utils/DataTextureController';
import {CopRendererController} from './utils/RendererController';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
class EnvMapCopParamsConfig extends NodeParamsConfig {
	use_camera_renderer = ParamConfig.BOOLEAN(0);
}
const ParamsConfig = new EnvMapCopParamsConfig();
export class EnvMapCopNode extends TypedCopNode<EnvMapCopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'env_map';
	}
	private _data_texture_controller: DataTextureController | undefined;
	private _renderer_controller: CopRendererController | undefined;

	initialize_node() {
		this.io.inputs.set_count(1);

		// for now, if I clone the input, it gets messed up
		this.io.inputs.init_inputs_cloned_state(InputCloneMode.NEVER);
	}

	async cook(input_contents: Texture[]) {
		const texture = input_contents[0];
		this.convert_texture_to_env_map(texture);
	}

	private async convert_texture_to_env_map(input_texture: Texture) {
		// texture.minFilter = NearestFilter;
		// texture.encoding = LinearEncoding;

		this._renderer_controller = this._renderer_controller || new CopRendererController(this);
		const renderer = await this._renderer_controller.renderer();

		if (renderer) {
			const pmremGenerator = new PMREMGenerator(renderer);
			const exrCubeRenderTarget = pmremGenerator.fromEquirectangular(input_texture);

			// pmremGenerator.dispose();
			// texture.dispose();

			if (this.pv.use_camera_renderer) {
				this.set_texture(exrCubeRenderTarget.texture);
			} else {
				this._data_texture_controller =
					this._data_texture_controller ||
					new DataTextureController(DataTextureControllerBufferType.Uint8Array);
				const texture = this._data_texture_controller.from_render_target(renderer, exrCubeRenderTarget);
				this.set_texture(texture);
			}
		} else {
			this.states.error.set('no renderer found to convert the texture to an env map');
			this.cook_controller.end_cook();
		}
	}
}
