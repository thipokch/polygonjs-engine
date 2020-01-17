// import {Core} from 'src/Core/_Module';
import {TypedSopNode} from './_Base';
import {JsonDataLoader} from 'src/core/loader/geometry/JsonData';

const DEFAULT_DATA = [
	{value: -40},
	{value: -30},
	{value: -20},
	{value: -10},
	{value: 0},
	{value: 10},
	{value: 20},
	{value: 30},
	{value: 40},
	{value: 50},
	{value: 60},
	{value: 70},
	{value: 80},
];
const DEFAULT_DATA_STR = JSON.stringify(DEFAULT_DATA);

import {NodeParamsConfig, ParamConfig} from 'src/engine/nodes/utils/params/ParamsConfig';
class DataSopParamsConfig extends NodeParamsConfig {
	data = ParamConfig.STRING(DEFAULT_DATA_STR);
}
const ParamsConfig = new DataSopParamsConfig();

export class DataSopNode extends TypedSopNode<DataSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'data';
	}

	cook() {
		let json = null;
		try {
			json = JSON.parse(this.pv.data);
		} catch (e) {
			this.states.error.set('could not parse json');
		}

		if (json) {
			const loader = new JsonDataLoader({
				data_keys_prefix: '',
				skip_entries: '',
				do_convert: false,
				convert_to_numeric: '',
			});
			loader.set_json(json);
			const object = loader.create_object();
			this.set_object(object);
		} else {
			this.cook_controller.end_cook();
		}
	}
}