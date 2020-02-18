import {TypedObjNode} from './_Base';
import {Group} from 'three/src/objects/Group';
import {TransformedParamConfig, TransformController} from './utils/TransformController';
// import {CoreTransform} from 'src/core/Transform';
import {FlagsControllerD} from '../utils/FlagsController';
import {AxesHelper} from 'three/src/helpers/AxesHelper';

import {NodeParamsConfig} from 'src/engine/nodes/utils/params/ParamsConfig';
class NullObjParamConfig extends TransformedParamConfig(NodeParamsConfig) {}
const ParamsConfig = new NullObjParamConfig();

export class NullObjNode extends TypedObjNode<Group, NullObjParamConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'null';
	}
	readonly transform_controller: TransformController = new TransformController(this);
	public readonly flags: FlagsControllerD = new FlagsControllerD(this);
	private _helper = new AxesHelper(1);

	create_object() {
		return new Group();
	}
	initialize_node() {
		this.transform_controller.initialize_node();
		this.object.add(this._helper);
		this.flags.display.add_hook(() => {
			this._helper.visible = this.flags.display.active;
		});
	}
	cook() {
		this.transform_controller.update();
		this.cook_controller.end_cook();
	}
}
