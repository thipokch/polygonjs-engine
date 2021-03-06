import {TypedRopNode} from './_Base';
import {Mesh} from 'three/src/objects/Mesh';
import {RopType} from '../../poly/registers/nodes/Rop';
import lodash_isArray from 'lodash/isArray';
import {WebGLRenderer, WebGLRendererParameters} from 'three/src/renderers/WebGLRenderer';
import {
	// encoding
	LinearEncoding,
	sRGBEncoding,
	GammaEncoding,
	RGBEEncoding,
	LogLuvEncoding,
	RGBM7Encoding,
	RGBM16Encoding,
	RGBDEncoding,
	// BasicDepthPacking,
	// RGBADepthPacking,
	// tone mapping
	NoToneMapping,
	LinearToneMapping,
	ReinhardToneMapping,
	CineonToneMapping,
	ACESFilmicToneMapping,
	// shadow map
	BasicShadowMap,
	PCFShadowMap,
	PCFSoftShadowMap,
	VSMShadowMap,
} from 'three/src/constants';

enum RendererPrecision {
	lowp = 'lowp',
	mediump = 'mediump',
	highp = 'highp',
}

enum PowerPreference {
	HIGH = 'high-performance',
	LOW = 'low-power',
	DEFAULT = 'default',
}

enum EncodingName {
	Linear = 'Linear',
	sRGB = 'sRGB',
	Gamma = 'Gamma',
	RGBE = 'RGBE',
	LogLuv = 'LogLuv',
	RGBM7 = 'RGBM7',
	RGBM16 = 'RGBM16',
	RGBD = 'RGBD',
	// BasicDepth = 'BasicDepth',
	// RGBADepth = 'RGBADepth',
}
enum EncodingValue {
	Linear = LinearEncoding as number,
	sRGB = sRGBEncoding as number,
	Gamma = GammaEncoding as number,
	RGBE = RGBEEncoding as number,
	LogLuv = LogLuvEncoding as number,
	RGBM7 = RGBM7Encoding as number,
	RGBM16 = RGBM16Encoding as number,
	RGBD = RGBDEncoding as number,
	// BasicDepth = BasicDepthPacking as number,
	// RGBADepth = RGBADepthPacking as number,
}
const ENCODING_NAMES: EncodingName[] = [
	EncodingName.Linear,
	EncodingName.sRGB,
	EncodingName.Gamma,
	EncodingName.RGBE,
	EncodingName.LogLuv,
	EncodingName.RGBM7,
	EncodingName.RGBM16,
	EncodingName.RGBD,
	// EncodingName.BasicDepth,
	// EncodingName.RGBADepth,
];
const ENCODING_VALUES: EncodingValue[] = [
	EncodingValue.Linear,
	EncodingValue.sRGB,
	EncodingValue.Gamma,
	EncodingValue.RGBE,
	EncodingValue.LogLuv,
	EncodingValue.RGBM7,
	EncodingValue.RGBM16,
	EncodingValue.RGBD,
	// EncodingValue.BasicDepth,
	// EncodingValue.RGBADepth,
];
export const DEFAULT_OUTPUT_ENCODING = EncodingValue.sRGB as number;

enum ToneMappingName {
	No = 'No',
	Linear = 'Linear',
	Reinhard = 'Reinhard',
	Cineon = 'Cineon',
	ACESFilmic = 'ACESFilmic',
}
enum ToneMappingValue {
	No = NoToneMapping as number,
	Linear = LinearToneMapping as number,
	Reinhard = ReinhardToneMapping as number,
	Cineon = CineonToneMapping as number,
	ACESFilmic = ACESFilmicToneMapping as number,
}
const TONE_MAPPING_NAMES: ToneMappingName[] = [
	ToneMappingName.No,
	ToneMappingName.Linear,
	ToneMappingName.Reinhard,
	ToneMappingName.Cineon,
	ToneMappingName.ACESFilmic,
];
const TONE_MAPPING_VALUES: ToneMappingValue[] = [
	ToneMappingValue.No,
	ToneMappingValue.Linear,
	ToneMappingValue.Reinhard,
	ToneMappingValue.Cineon,
	ToneMappingValue.ACESFilmic,
];
export const DEFAULT_TONE_MAPPING = ToneMappingValue.ACESFilmic as number;
const TONE_MAPPING_MENU_ENTRIES = TONE_MAPPING_NAMES.map((name, i) => {
	return {
		name: name,
		value: TONE_MAPPING_VALUES[i],
	};
});

enum ShadowMapTypeName {
	Basic = 'Basic',
	PCF = 'PCF',
	PCFSoft = 'PCFSoft',
	VSM = 'VSM',
}
enum ShadowMapTypeValue {
	Basic = BasicShadowMap as number,
	PCF = PCFShadowMap as number,
	PCFSoft = PCFSoftShadowMap as number,
	VSM = VSMShadowMap as number,
}
const SHADOW_MAP_TYPE_NAMES: ShadowMapTypeName[] = [
	ShadowMapTypeName.Basic,
	ShadowMapTypeName.PCF,
	ShadowMapTypeName.PCFSoft,
	ShadowMapTypeName.VSM,
];
const SHADOW_MAP_TYPE_VALUES: ShadowMapTypeValue[] = [
	ShadowMapTypeValue.Basic,
	ShadowMapTypeValue.PCF,
	ShadowMapTypeValue.PCFSoft,
	ShadowMapTypeValue.VSM,
];
export const SHADOW_MAP_TYPES = [BasicShadowMap, PCFShadowMap, PCFSoftShadowMap, VSMShadowMap];
export const DEFAULT_SHADOW_MAP_TYPE = ShadowMapTypeValue.PCFSoft as number;

// TODO: set debug.checkShaderErrors to false in prod
const DEFAULT_PARAMS: WebGLRendererParameters = {
	alpha: true,
	precision: RendererPrecision.highp,
	premultipliedAlpha: true,
	antialias: true,
	stencil: true,
	preserveDrawingBuffer: false,
	powerPreference: PowerPreference.DEFAULT,
	depth: true,
	logarithmicDepthBuffer: false,
};

export interface WebGLRendererWithSampling extends WebGLRenderer {
	sampling?: number;
}

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
class WebGlRendererRopParamsConfig extends NodeParamsConfig {
	alpha = ParamConfig.BOOLEAN(1);
	antialias = ParamConfig.BOOLEAN(1);
	tone_mapping = ParamConfig.INTEGER(DEFAULT_TONE_MAPPING, {
		menu: {
			entries: TONE_MAPPING_MENU_ENTRIES,
		},
	});
	tone_mapping_exposure = ParamConfig.FLOAT(1, {
		range: [0, 2],
	});

	output_encoding = ParamConfig.INTEGER(DEFAULT_OUTPUT_ENCODING, {
		menu: {
			entries: ENCODING_NAMES.map((name, i) => {
				return {
					name: name,
					value: ENCODING_VALUES[i],
				};
			}),
		},
	});
	gamma_factor = ParamConfig.FLOAT(2, {
		visible_if: {output_encoding: EncodingValue.Gamma},
		range: [0, 5],
		range_locked: [true, true],
	});
	shadow_map_type = ParamConfig.INTEGER(DEFAULT_SHADOW_MAP_TYPE, {
		menu: {
			entries: SHADOW_MAP_TYPE_NAMES.map((name, i) => {
				return {
					name: name,
					value: SHADOW_MAP_TYPE_VALUES[i],
				};
			}),
		},
	});
	sort_objects = ParamConfig.BOOLEAN(1);
	sampling = ParamConfig.INTEGER(1, {
		range: [1, 4],
		range_locked: [true, false],
	});
	// preserve_drawing_buffer = ParamConfig.BOOLEAN(0);
}
const ParamsConfig = new WebGlRendererRopParamsConfig();

export class WebGlRendererRopNode extends TypedRopNode<WebGlRendererRopParamsConfig> {
	params_config = ParamsConfig;
	static type(): Readonly<RopType.WEBGL> {
		return RopType.WEBGL;
	}

	private _renderers_by_canvas_id: Dictionary<WebGLRenderer> = {};
	create_renderer(canvas: HTMLCanvasElement, gl: WebGLRenderingContext): WebGLRendererWithSampling {
		const params: WebGLRendererParameters = {};
		const keys: Array<keyof WebGLRendererParameters> = Object.keys(DEFAULT_PARAMS) as Array<
			keyof WebGLRendererParameters
		>;
		let k: keyof WebGLRendererParameters;
		for (k of keys) {
			(params[k] as any) = DEFAULT_PARAMS[k];
		}
		(params as WebGLRendererParameters).antialias = this.pv.antialias;
		(params as WebGLRendererParameters).alpha = this.pv.alpha;
		(params as WebGLRendererParameters).canvas = canvas;
		(params as WebGLRendererParameters).context = gl;
		// (params as WebGLRendererParameters).preserveDrawingBuffer = this.pv.preserve_drawing_buffer;
		const renderer = new WebGLRenderer(params);

		this._update_renderer(renderer);

		this._renderers_by_canvas_id[canvas.id] = renderer;
		return renderer;
	}

	cook() {
		const ids = Object.keys(this._renderers_by_canvas_id);
		for (let id of ids) {
			const renderer = this._renderers_by_canvas_id[id];
			this._update_renderer(renderer);
		}

		this._traverse_scene_and_update_materials();

		this.cook_controller.end_cook();
	}
	_update_renderer(renderer: WebGLRendererWithSampling) {
		// this._renderer.setClearAlpha(this.pv.alpha);
		renderer.gammaFactor = this.pv.gamma_factor;
		renderer.physicallyCorrectLights = true;
		renderer.outputEncoding = this.pv.output_encoding;
		renderer.toneMapping = this.pv.tone_mapping;
		renderer.toneMappingExposure = this.pv.tone_mapping_exposure;

		// shadows
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.autoUpdate = true;
		renderer.shadowMap.needsUpdate = true;
		renderer.shadowMap.type = this.pv.shadow_map_type;

		renderer.sortObjects = this.pv.sort_objects;

		renderer.sampling = this.pv.sampling;
	}

	private _traverse_scene_and_update_materials() {
		this.scene.default_scene.traverse((object) => {
			const material = (object as Mesh).material;
			if (material) {
				if (lodash_isArray(material)) {
					for (let mat of material) {
						mat.needsUpdate = true;
					}
				} else {
					material.needsUpdate = true;
				}
			}
		});
	}
}
