import {ObjectLoader} from 'three/src/loaders/ObjectLoader';
import {TypedSopNode} from './_Base';

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {BaseNodeType} from '../_Base';
import {BaseParamType} from '../../params/_Base';
import {CoreGroup} from '../../../core/geometry/Group';
class CacheSopParamsConfig extends NodeParamsConfig {
	cache = ParamConfig.STRING('', {hidden: true});
	reset = ParamConfig.BUTTON(null, {
		callback: (node: BaseNodeType, param: BaseParamType) => {
			CacheSopNode.PARAM_CALLBACK_reset(node as CacheSopNode, param);
		},
	});
}
const ParamsConfig = new CacheSopParamsConfig();

export class CacheSopNode extends TypedSopNode<CacheSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'cache';
	}

	static displayed_input_names(): string[] {
		return ['geometry to cache'];
	}

	initialize_node() {
		this.io.inputs.set_count(0, 1);
	}

	cook(input_contents: CoreGroup[]) {
		const is_cache_empty = this.pv.cache == '' || this.pv.cache == null;
		const core_group = input_contents[0];
		if (is_cache_empty && core_group) {
			const json = [];
			for (let object of core_group.objects()) {
				json.push(object.toJSON());
			}
			this.set_core_group(core_group);
			this.p.cache.set(JSON.stringify(json));
		} else {
			if (this.pv.cache) {
				const obj_loader = new ObjectLoader();
				const jsons = JSON.parse(this.pv.cache);
				const all_objects = [];
				for (let json of jsons) {
					const parent = obj_loader.parse(json);
					// for(let child of parent.children){
					all_objects.push(parent);
					// }
				}
				this.set_objects(all_objects);
			} else {
				this.set_objects([]);
			}
		}
	}

	static PARAM_CALLBACK_reset(node: CacheSopNode, param: BaseParamType) {
		node.param_callback_PARAM_CALLBACK_reset();
	}
	async param_callback_PARAM_CALLBACK_reset() {
		this.p.cache.set('');
		this.request_container();
	}
}
