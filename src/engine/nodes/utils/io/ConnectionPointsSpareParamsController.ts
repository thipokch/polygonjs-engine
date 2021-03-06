import {
	ConnectionPointTypeMap,
	ConnectionPointEnumMap,
	param_type_to_connection_point_type_map,
	create_connection_point,
} from './connections/ConnectionMap';
import {ParamType} from '../../../poly/ParamType';
// import {ParamValueToDefaultConverter} from '../../utils/params/ParamValueToDefaultConverter';
// import {NodeEvent} from '../../../poly/NodeEvent';
import {ParamsUpdateOptions} from '../params/ParamsController';
// import {ParamInitValueSerializedTypeMap} from '../../../params/types/ParamInitValueSerializedTypeMap';
import {ParamInitValueSerialized} from '../../../params/types/ParamInitValueSerialized';
import lodash_clone from 'lodash/clone';
import lodash_isArray from 'lodash/isArray';
import lodash_isNumber from 'lodash/isNumber';
import {NodeContext} from '../../../poly/NodeContext';
import {TypedNode} from '../../_Base';

/*
GlNodeSpareParamsController creates spare params from inputs on gl nodes
*/
export class ConnectionPointsSpareParamsController<NC extends NodeContext> {
	// private _allow_inputs_created_from_params: boolean = true;
	private _inputless_param_names: string[] | undefined;
	private _raw_input_serialized_by_param_name: Map<string, ParamInitValueSerialized> = new Map();
	private _default_value_serialized_by_param_name: Map<string, ParamInitValueSerialized> = new Map();
	constructor(private node: TypedNode<NC, any>, private _context: NC) {}

	// disallow_inputs_created_from_params() {
	// 	this._allow_inputs_created_from_params = false;
	// }

	private _initialized = false;
	initialize_node() {
		if (this._initialized) {
			console.warn('already initialized', this.node);
			return;
		}
		this._initialized = true;
		this.node.params.on_params_created('create_inputs_from_params', this.create_inputs_from_params.bind(this));
	}
	initialized() {
		return this._initialized;
	}

	create_inputs_from_params() {
		// if (!this._allow_inputs_created_from_params) {
		// 	return;
		// }
		const connection_type_map = param_type_to_connection_point_type_map(this._context);
		if (!connection_type_map) {
			return;
		}

		const connection_points: ConnectionPointTypeMap[NC][] = [];
		for (let param_name of this.node.params.names) {
			let add_input = true;
			if (
				this._inputless_param_names &&
				this._inputless_param_names.length > 0 &&
				this._inputless_param_names.includes(param_name)
			) {
				add_input = false;
			}
			if (add_input) {
				if (this.node.params.has(param_name)) {
					const param = this.node.params.get(param_name);
					if (param && !param.parent_param) {
						const connection_type = connection_type_map[param.type] as ConnectionPointEnumMap[NC];
						if (connection_type) {
							const connection_point = create_connection_point(
								this._context,
								param.name,
								connection_type
							) as ConnectionPointTypeMap[NC];
							if (connection_point) {
								connection_points.push(connection_point);
							}
						}
					}
				}
			}
		}
		this.node.io.inputs.set_named_input_connection_points(connection_points);
	}

	set_inputless_param_names(names: string[]) {
		return (this._inputless_param_names = names);
	}

	//
	// Create spare params on gl nodes
	//
	create_spare_parameters() {
		if (this.node.scene.loading_controller.is_loading) {
			return;
		}

		const current_param_names: string[] = this.node.params.spare_names;
		const params_update_options: ParamsUpdateOptions = {};

		for (let param_name of current_param_names) {
			if (this.node.params.has(param_name)) {
				const param = this.node.params.get(param_name);
				if (param) {
					this._raw_input_serialized_by_param_name.set(param_name, param.raw_input_serialized);
					this._default_value_serialized_by_param_name.set(param_name, param.default_value_serialized);
					params_update_options.names_to_delete = params_update_options.names_to_delete || [];
					params_update_options.names_to_delete.push(param_name);
				}
			}
		}

		for (let connection_point of this.node.io.inputs.named_input_connection_points) {
			if (connection_point) {
				const param_name = connection_point.name;
				const param_type: ParamType = connection_point.param_type;
				let init_value = connection_point.init_value;

				const last_param_init_value = this._default_value_serialized_by_param_name.get(param_name);
				let default_value_from_name = this.node.param_default_value(param_name);

				if (default_value_from_name != null) {
					init_value = default_value_from_name;
				} else {
					if (last_param_init_value != null) {
						init_value = last_param_init_value;
					} else {
						init_value = connection_point.init_value;
					}
				}
				if (lodash_isArray(connection_point.init_value)) {
					// if we need to use an init_value from a float to an array
					if (lodash_isNumber(init_value)) {
						const array = new Array(connection_point.init_value.length) as Number2;
						array.fill(init_value);
						init_value = array;
					}
					// if we need to use an init_value from a array to an array, we need to check their length.
					// if they are different, we need to match them.
					else if (lodash_isArray(init_value)) {
						// if (init_value.length < connection_point.init_value.length) {
						// }
						// if (init_value.length > connection_point.init_value.length) {
						// }
						if (init_value.length == connection_point.init_value.length) {
							if (last_param_init_value != null) {
								init_value = connection_point.init_value;
							}
						}
					}
				}

				if (init_value != null) {
					params_update_options.to_add = params_update_options.to_add || [];
					params_update_options.to_add.push({
						name: param_name,
						type: param_type,
						// TODO: I should really treat differently init_value and raw_input here
						init_value: lodash_clone(init_value as any),
						raw_input: lodash_clone(init_value as any),
						options: {
							spare: true,
						},
					});
				}
			}
		}
		// if (!this.node.scene.loading_controller.is_loading) {
		this.node.params.update_params(params_update_options);

		for (let spare_param of this.node.params.spare) {
			if (!spare_param.parent_param) {
				const raw_input = this._raw_input_serialized_by_param_name.get(spare_param.name);
				if (raw_input) {
					spare_param.set(raw_input as any);
				}
			}
		}
		// }
	}
}
