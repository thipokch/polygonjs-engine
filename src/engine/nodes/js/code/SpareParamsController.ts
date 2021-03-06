import lodash_intersection from 'lodash/intersection';
import lodash_clone from 'lodash/clone';
import lodash_merge from 'lodash/merge';
import {JsonExportDispatcher} from '../../../io/json/export/Dispatcher';
import {ParamJsonExporterData} from '../../utils/io/IOController';
import {ParamsUpdateOptions} from '../../utils/params/ParamsController';
import {ParamOptions} from '../../../params/utils/OptionsController';
import {ParamType} from '../../../poly/ParamType';
import {JsAssemblerControllerType, AssemblerControllerNode} from './Controller';
import {ParamInitValueSerialized} from '../../../params/types/ParamInitValueSerialized';

/*
Create spare params on mat nodes
*/
export class JsAssemblerNodeSpareParamsController {
	private _deleted_params_data: Map<string, ParamJsonExporterData<ParamType>> = new Map();
	private _created_spare_param_names: string[] = [];
	private _raw_input_serialized_by_param_name: Map<string, ParamInitValueSerialized> = new Map();
	private _init_value_serialized_by_param_name: Map<string, ParamInitValueSerialized> = new Map();
	constructor(private _controller: JsAssemblerControllerType, private _node: AssemblerControllerNode) {}
	get assembler() {
		return this._controller.assembler;
	}

	create_spare_parameters() {
		// const current_spare_param_names: string[] = this.node.params.spare_names;
		const params_update_options: ParamsUpdateOptions = {};
		const param_configs = this.assembler.param_configs();
		const assembler_param_names = param_configs.map((c) => c.name);
		const spare_param_names_to_add = lodash_clone(assembler_param_names);
		const validation_result = this._validate_names(spare_param_names_to_add);
		if (validation_result == false) {
			return;
		}

		// spare_param_names_to_remove is composed of previously created params, but also spare params with the same name, which may be created when loading the scene
		const spare_param_names_to_remove = lodash_clone(this._created_spare_param_names).concat(
			spare_param_names_to_add
		);

		// keep track of raw_inputs so we can restore them
		spare_param_names_to_remove.forEach((param_name) => {
			// store the param data, in case it gets recreated later
			// this allows expressions to be kept in memory
			const param = this._node.params.get(param_name);
			if (param) {
				this._raw_input_serialized_by_param_name.set(param.name, param.raw_input_serialized);
				this._init_value_serialized_by_param_name.set(param.name, param.default_value_serialized);
				const param_exporter = JsonExportDispatcher.dispatch_param(param);
				if (param_exporter.required) {
					const params_data = param_exporter.data();
					this._deleted_params_data.set(param.name, params_data);
				}
			}

			params_update_options.names_to_delete = params_update_options.names_to_delete || [];
			params_update_options.names_to_delete.push(param_name);
		});

		// this.within_param_folder('spare_params', () => {
		for (let param_config of param_configs) {
			if (spare_param_names_to_add.indexOf(param_config.name) >= 0) {
				const config_options = lodash_clone(param_config.param_options);
				const default_options: ParamOptions = {
					spare: true,
					compute_on_dirty: true,
					cook: false, // it should update the uniforms only via its callback
				};
				const options = lodash_merge(config_options, default_options);

				// set init_value and raw_input to the previous param's
				let init_value = this._init_value_serialized_by_param_name.get(param_config.name);
				if (init_value == null) {
					init_value = param_config.default_value as any;
				}
				let raw_input = this._raw_input_serialized_by_param_name.get(param_config.name);
				if (raw_input == null) {
					raw_input = param_config.default_value as any;
				}

				params_update_options.to_add = params_update_options.to_add || [];
				params_update_options.to_add.push({
					name: param_config.name,
					type: param_config.type,
					init_value: init_value as any,
					raw_input: raw_input as any,
					options: options,
				});
			}
		}

		this._node.params.update_params(params_update_options);
		this._created_spare_param_names = params_update_options.to_add?.map((o) => o.name) || [];
	}

	// TODO: handle the case where a param created by user already exists.
	// we may then change the name of the new spare param.
	private _validate_names(spare_param_names_to_add: string[]): boolean {
		// check that param_names_to_add does not include any currently existing param names (that are not spare)
		const current_param_names = lodash_clone(this._node.params.non_spare_names);
		const spare_params_with_same_name_as_params = lodash_intersection(
			spare_param_names_to_add,
			current_param_names
		);
		if (spare_params_with_same_name_as_params.length > 0) {
			const error_message = `${this._node.full_path()} attempts to create spare params called '${spare_params_with_same_name_as_params.join(
				', '
			)}' with same name as params`;
			this._node.states.error.set(error_message);
			return false;
		}
		return true;
	}
}
