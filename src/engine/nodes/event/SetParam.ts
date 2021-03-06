import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {TypedEventNode} from './_Base';
import {EventContext} from '../../scene/utils/events/_BaseEventsController';
import {TypeAssert} from '../../poly/Assert';
import {BaseParamType} from '../../params/_Base';
import {ParamType} from '../../poly/ParamType';
import {FloatParam} from '../../params/Float';
import {Vector2Param} from '../../params/Vector2';
import {Vector3Param} from '../../params/Vector3';
import {Vector4Param} from '../../params/Vector4';
import {EventConnectionPoint, EventConnectionPointType} from '../utils/io/connections/Event';
import {BaseNodeType} from '../_Base';
import {Vector2} from 'three/src/math/Vector2';
import {Vector3} from 'three/src/math/Vector3';
import {Vector4} from 'three/src/math/Vector4';
import {IntegerParam} from '../../params/Integer';

enum SetParamParamType {
	BOOLEAN = 'boolean',
	BUTTON = 'button',
	NUMBER = 'number',
	VECTOR2 = 'vector2',
	VECTOR3 = 'vector3',
	VECTOR4 = 'vector4',
	STRING = 'string',
}
const SET_PARAM_PARAM_TYPE: Array<SetParamParamType> = [
	SetParamParamType.BOOLEAN,
	SetParamParamType.BUTTON,
	SetParamParamType.NUMBER,
	SetParamParamType.VECTOR2,
	SetParamParamType.VECTOR3,
	SetParamParamType.VECTOR4,
	SetParamParamType.STRING,
];
const TYPE_BOOLEAN = SET_PARAM_PARAM_TYPE.indexOf(SetParamParamType.BOOLEAN);
// const TYPE_BUTTON = SET_PARAM_PARAM_TYPE.indexOf(SetParamParamType.BUTTON);
const TYPE_NUMBER = SET_PARAM_PARAM_TYPE.indexOf(SetParamParamType.NUMBER);
const TYPE_VECTOR2 = SET_PARAM_PARAM_TYPE.indexOf(SetParamParamType.VECTOR2);
const TYPE_VECTOR3 = SET_PARAM_PARAM_TYPE.indexOf(SetParamParamType.VECTOR3);
const TYPE_VECTOR4 = SET_PARAM_PARAM_TYPE.indexOf(SetParamParamType.VECTOR4);
const TYPE_STRING = SET_PARAM_PARAM_TYPE.indexOf(SetParamParamType.STRING);

const OUTPUT_NAME = 'output';
class SetParamParamsConfig extends NodeParamsConfig {
	param = ParamConfig.OPERATOR_PATH('/geo1/display', {
		param_selection: true,
		compute_on_dirty: true,
	});
	// param = ParamConfig.STRING('display');
	type = ParamConfig.INTEGER(TYPE_NUMBER, {
		menu: {
			entries: SET_PARAM_PARAM_TYPE.map((name, value) => {
				return {name, value};
			}),
		},
	});
	toggle = ParamConfig.BOOLEAN(0, {
		visible_if: {type: TYPE_BOOLEAN},
	});
	boolean = ParamConfig.BOOLEAN(0, {
		visible_if: {
			type: TYPE_BOOLEAN,
			toggle: 0,
		},
	});
	number = ParamConfig.FLOAT(0, {
		visible_if: {type: TYPE_NUMBER},
	});
	vector2 = ParamConfig.VECTOR2([0, 0], {
		visible_if: {type: TYPE_VECTOR2},
	});
	vector3 = ParamConfig.VECTOR3([0, 0, 0], {
		visible_if: {type: TYPE_VECTOR3},
	});
	vector4 = ParamConfig.VECTOR4([0, 0, 0, 0], {
		visible_if: {type: TYPE_VECTOR4},
	});
	increment = ParamConfig.BOOLEAN(0, {
		visible_if: [{type: TYPE_NUMBER}, {type: TYPE_VECTOR2}, {type: TYPE_VECTOR3}, {type: TYPE_VECTOR4}],
	});
	string = ParamConfig.STRING('', {
		visible_if: {type: TYPE_STRING},
	});
	execute = ParamConfig.BUTTON(null, {
		callback: (node: BaseNodeType) => {
			SetParamEventNode.PARAM_CALLBACK_execute(node as SetParamEventNode);
		},
	});
}
const ParamsConfig = new SetParamParamsConfig();

export class SetParamEventNode extends TypedEventNode<SetParamParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'set_param';
	}
	initialize_node() {
		this.io.inputs.set_named_input_connection_points([
			new EventConnectionPoint('trigger', EventConnectionPointType.BASE),
		]);
		this.io.outputs.set_named_output_connection_points([
			new EventConnectionPoint(OUTPUT_NAME, EventConnectionPointType.BASE),
		]);

		this.scene.dispatch_controller.on_add_listener(() => {
			this.params.on_params_created('params_label', () => {
				this.params.label.init([this.p.param]);
			});
		});
	}
	async process_event(event_context: EventContext<Event>) {
		if (this.p.param.is_dirty) {
			await this.p.param.compute();
		}
		const param = this.p.param.found_param();
		if (param) {
			const new_value = await this._new_param_value(param);
			if (new_value != null) {
				param.set(new_value);
			}
		} else {
			this.states.error.set('target param not found');
		}

		this.dispatch_event_to_output(OUTPUT_NAME, event_context);
	}

	private _tmp_vector2 = new Vector2();
	private _tmp_vector3 = new Vector3();
	private _tmp_vector4 = new Vector4();
	private _tmp_array2: Number2 = [0, 0];
	private _tmp_array3: Number3 = [0, 0, 0];
	private _tmp_array4: Number4 = [0, 0, 0, 0];
	private async _new_param_value(param: BaseParamType) {
		const type = SET_PARAM_PARAM_TYPE[this.pv.type];
		switch (type) {
			case SetParamParamType.BOOLEAN: {
				await this._compute_params_if_dirty([this.p.toggle]);
				// use 1 and 0, so we can also use it on integer params, such as for a switch node
				if (this.pv.toggle) {
					return param.value ? 0 : 1;
				} else {
					return this.pv.boolean ? 1 : 0;
				}
			}
			case SetParamParamType.BUTTON: {
				return param.options.execute_callback();
			}
			case SetParamParamType.NUMBER: {
				await this._compute_params_if_dirty([this.p.increment, this.p.number]);
				if (this.pv.increment) {
					if (param.type == ParamType.FLOAT) {
						return (param as FloatParam).value + this.pv.number;
					} else {
						return (param as IntegerParam).value;
					}
				} else {
					return this.pv.number;
				}
			}
			case SetParamParamType.VECTOR2: {
				await this._compute_params_if_dirty([this.p.increment, this.p.vector2]);
				if (this.pv.increment) {
					if (param.type == ParamType.VECTOR2) {
						this._tmp_vector2.copy((param as Vector2Param).value);
						this._tmp_vector2.add(this.pv.vector2);
						this._tmp_vector2.toArray(this._tmp_array2);
					} else {
						(param as Vector2Param).value.toArray(this._tmp_array2);
					}
				} else {
					this.pv.vector2.toArray(this._tmp_array2);
				}
				return this._tmp_array2;
			}
			case SetParamParamType.VECTOR3: {
				await this._compute_params_if_dirty([this.p.increment, this.p.vector3]);
				if (this.pv.increment) {
					if (param.type == ParamType.VECTOR3) {
						this._tmp_vector3.copy((param as Vector3Param).value);
						this._tmp_vector3.add(this.pv.vector3);
						this._tmp_vector3.toArray(this._tmp_array3);
					} else {
						(param as Vector3Param).value.toArray(this._tmp_array3);
					}
				} else {
					this.pv.vector3.toArray(this._tmp_array3);
				}
				return this._tmp_array3;
			}
			case SetParamParamType.VECTOR4: {
				await this._compute_params_if_dirty([this.p.increment, this.p.vector4]);
				if (this.pv.increment) {
					if (param.type == ParamType.VECTOR4) {
						this._tmp_vector4.copy((param as Vector4Param).value);
						this._tmp_vector4.add(this.pv.vector4);
						this._tmp_vector4.toArray(this._tmp_array4);
					} else {
						(param as Vector4Param).value.toArray(this._tmp_array4);
					}
				} else {
					this.pv.vector4.toArray(this._tmp_array4);
				}
				return this._tmp_array4;
			}
			case SetParamParamType.STRING: {
				await this._compute_params_if_dirty([this.p.string]);
				return this.pv.string;
			}
		}
		TypeAssert.unreachable(type);
	}

	static PARAM_CALLBACK_execute(node: SetParamEventNode) {
		node.process_event({});
	}

	private async _compute_params_if_dirty(params: BaseParamType[]) {
		const dirty_params = [];
		for (let param of params) {
			if (param.is_dirty) {
				dirty_params.push(param);
			}
		}
		const promises: Promise<void>[] = [];
		for (let param of dirty_params) {
			promises.push(param.compute());
		}
		return await Promise.all(promises);
	}
}
