import {Color} from 'three/src/math/Color';
import {Vector2} from 'three/src/math/Vector2';
import {Vector3} from 'three/src/math/Vector3';
import {Vector4} from 'three/src/math/Vector4';

// import {CoreString} from 'src/core/String'
import {BaseParam} from 'src/engine/params/_Base';
import {ParamOptions} from 'src/engine/params/concerns/Options';
import {NodeSimple} from 'src/core/graph/NodeSimple';

import {BaseNode} from 'src/engine/nodes/_Base';
// import lodash_compact from 'lodash/compact'
// import lodash_isFunction from 'lodash/isFunction'
// import lodash_isArray from 'lodash/isArray'
// import lodash_keys from 'lodash/keys'
// import lodash_filter from 'lodash/filter'
// import lodash_map from 'lodash/map'
import lodash_each from 'lodash/each';
import lodash_values from 'lodash/values';
// import lodash_concat from 'lodash/concat'

import {TypedParam} from 'src/engine/params/_Base';
import {BooleanParam} from 'src/engine/params/Boolean';
import {ButtonParam} from 'src/engine/params/Button';
import {ColorParam} from 'src/engine/params/Color';
import {FloatParam} from 'src/engine/params/Float';
import {IntegerParam} from 'src/engine/params/Integer';
import {OperatorPathParam} from 'src/engine/params/OperatorPath';
import {RampParam} from 'src/engine/params/Ramp';
import {SeparatorParam} from 'src/engine/params/Separator';
import {StringParam} from 'src/engine/params/String';
import {Vector2Param} from 'src/engine/params/Vector2';
import {Vector3Param} from 'src/engine/params/Vector3';
import {Vector4Param} from 'src/engine/params/Vector4';
import {RampValue} from 'src/engine/params/ramp/RampValue';

const ParamConstructorMap = {
	[ParamType.BOOLEAN]: BooleanParam,
	[ParamType.BUTTON]: ButtonParam,
	[ParamType.COLOR]: ColorParam,
	[ParamType.FLOAT]: FloatParam,
	[ParamType.INTEGER]: IntegerParam,
	[ParamType.OPERATOR_PATH]: OperatorPathParam,
	[ParamType.RAMP]: RampParam,
	[ParamType.SEPARATOR]: SeparatorParam,
	[ParamType.STRING]: StringParam,
	[ParamType.VECTOR2]: Vector2Param,
	[ParamType.VECTOR3]: Vector3Param,
	[ParamType.VECTOR4]: Vector4Param,
};

// const ParamModule = {
// 	Button: Button,
// 	Color: ColorParam,
// 	Float: ParamFloat,
// 	Integer: Integer,
// 	OperatorPath: OperatorPath,
// 	Separator: Separator,
// 	String: ParamString,
// 	Toggle: Toggle,
// 	Vector: Vector,
// 	Vector2: Vector2Param,
// 	Vector4: Vector4Param,
// 	Ramp: Ramp,
// }

// const EXISTING_TYPES = Object.keys(ParamModule).map((k) => CoreString.type_to_class_name(k))

// interface ParamsByName {
// 	[propName: string]: BaseParam
// }
// interface BooleanByName {
// 	[propName: string]: boolean
// }

const NODE_SIMPLE_NAME = 'params';

export function ParamsOwner<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseNode = (<unknown>this) as BaseNode;

		_param_create_mode: boolean = false;
		_param_names: Dictionary<boolean> = {};
		_params: Dictionary<BaseParam> = {};
		_params_list: BaseParam[] = [];
		_params_node: NodeSimple;
		_params_eval_key: string;
		_params_added_since_last_params_eval: boolean = false;
		private _current_param_folder_name: string = null;
		// _param_value_by_name: object = {}

		_init_params() {
			if (!this._params_node) {
				// TODO: consider not having a params_node for nodes which have no parameters
				this._params_node = new NodeSimple(NODE_SIMPLE_NAME);
				this._params_node.set_scene(this.self.scene());
				this.self.add_graph_input(this._params_node);
			}
		}
		params_node() {
			return this._params_node;
		}

		init_parameters() {
			// this.reset_params()
			this._param_create_mode = true;

			// this._init_spare_params();
			this.create_params();
			this._create_params_ui_data_dependencies();
			this._param_create_mode = false;

			this.post_create_params();
		}

		params() {
			return this._params;
		}
		spare_params() {
			const keys = Object.keys(this._params);
			const params: Dictionary<BaseParam> = {};
			keys.forEach((name) => {
				const param = this.param(name);
				if (param.is_spare()) {
					params[param.name()] = param;
				}
			});
			return params;
		}
		param_names() {
			return Object.keys(this._param_names);
		}
		spare_param_names() {
			const params = Object.keys(this._param_names).map((n) => this.param(n));
			return params.filter((p) => p.is_spare()).map((p) => p.name());
		}
		non_spare_param_names() {
			const params = Object.keys(this._param_names).map((n) => this.param(n));
			return params.filter((p) => !p.is_spare()).map((p) => p.name());
		}
		delete_param(param_name: string) {
			const param = this._params[param_name];
			if (param) {
				this._params_node.remove_graph_input(this._params[param_name]);
				param.set_node(null);
				delete this._params[param_name];
				if (param.is_multiple()) {
					param.components().forEach((component) => {
						const child_name = component.name();
						delete this._params[child_name];
					});
				}

				delete this._param_names[param_name];

				// delete from this._params_list
				let index = -1;
				for (let i = 0; i < this._params_list.length; i++) {
					if (this._params_list[i].name() == param_name) {
						index = i;
					}
				}
				if (index > -1) {
					this._params_list.splice(index, 1);
				}

				// const name_index = this._param_names.indexOf(param_name)
				// if(name_index >= 0){
				// 	this._param_names.splice(name_index, 1)
				// }
				param.emit('param_deleted');
			} else {
				throw new Error(`param '${param_name}' does not exist on node ${this.self.full_path()}`);
			}
		}
		all_params() {
			// return lodash_concat(lodash_values(this._params), lodash_values(this._spare_params));
			return lodash_values(this._params);
		}

		// _init_spare_params() {
		// 	this._spare_params = {};
		// 	this._spare_param_names = [];
		// }

		create_params() {}
		post_create_params() {}
		//

		// TODO: this is really dangerous
		// find a way to evaluate point expression attributes and similar
		// without having to do that
		// how about: param().clone().eval
		// or
		// param().expression_eval_with_entity
		// or the param disconnects itself after set_entity (but this remains quite dangerous)
		// _block_params_dirty_propagation: ->
		// 	# console.log "BLOCK", this.full_path(), this.graph_predecessors()
		// 	# lodash_each this.params(), (param)=>
		// 	# 	param.block_dirty_propagation()
		// 	# 	true

		// 	params = lodash_map this.param_names(), (param_name)=> this.param(param_name)
		// 	@_params_dependencies = lodash_filter params, (param)=>
		// 		param.makes_node_dirty_when_dirty()

		// 	lodash_each @_params_dependencies, (param)=>
		// 		this.remove_graph_input(param)

		// _unblock_params_dirty_propagation: ->
		// 	# console.log "UNBLOCK", this.full_path()
		// 	# lodash_each this.params(), (param)=>
		// 	# 	param.unblock_dirty_propagation()
		// 	# 	true
		// 	# lodash_each this.param_names(), (param_name)=>
		// 	# 	param = this.param(param_name)
		// 	# 	param.unblock_dirty_propagation()
		// 	# 	true
		// 	lodash_each @_params_dependencies, (param)=>
		// 		this.add_graph_input(param)

		// TODO: unify params and spare params
		// as in spare params are part of the node definition
		// and therefore it is not possible to add them outside of the constructor
		// or even, there should be a node definition class?
		// this would ensure no name clash
		add_param(
			type: ParamType.BOOLEAN,
			name: string,
			default_value: BooleanAsNumber,
			options?: ParamOptions
		): BooleanParam;
		add_param(type: ParamType.BUTTON, name: string, default_value: null, options?: ParamOptions): ButtonParam;
		add_param(
			type: ParamType.COLOR,
			name: string,
			default_value: [number, number, number],
			options?: ParamOptions
		): ColorParam;
		add_param(type: ParamType.FLOAT, name: string, default_value: number, options?: ParamOptions): FloatParam;
		add_param(type: ParamType.INTEGER, name: string, default_value: number, options?: ParamOptions): IntegerParam;
		add_param(
			type: ParamType.OPERATOR_PATH,
			name: string,
			default_value: string,
			options?: ParamOptions
		): OperatorPathParam;
		add_param(type: ParamType.RAMP, name: string, default_value: string, options?: ParamOptions): RampParam;
		add_param(type: ParamType.SEPARATOR, name: string, default_value: null, options?: ParamOptions): SeparatorParam;
		add_param(type: ParamType.STRING, name: string, default_value: string, options?: ParamOptions): StringParam;
		add_param(
			type: ParamType.VECTOR2,
			name: string,
			default_value: [number, number],
			options?: ParamOptions
		): Vector2Param;
		add_param(
			type: ParamType.VECTOR3,
			name: string,
			default_value: [number, number, number],
			options?: ParamOptions
		): Vector3Param;
		add_param(
			type: ParamType.VECTOR4,
			name: string,
			default_value: [number, number, number, number],
			options?: ParamOptions
		): Vector4Param;
		add_param(type: ParamType, name: string, default_value: any, options?: ParamOptions): BaseParam {
			if (options == null) {
				options = {};
			}
			const is_spare = options['spare'] || false;
			if (this._param_create_mode === false && !is_spare) {
				console.warn(
					`node ${this.self.full_path()} (${this.self.type()}) param '${name}' cannot be created outside of create_params`
				);
				return;
			}
			if (this.self.scene() == null) {
				console.warn(`node ${this.self.full_path()} (${this.self.type()}) has no scene assigned`);
				return;
			}

			const constructor = ParamConstructorMap[type];
			if (constructor != null) {
				const existing_param = this._params[name];
				if (existing_param) {
					if (is_spare) {
						// delete the old one, otherwise the gl nodes when saved will attempt to set the value
						// of a param with the potentially wrong type
						if (existing_param.type() != type) {
							this.delete_param(existing_param.name());
						}
					} else {
						// check that the param is spare, so that the ones generated by gl nodes are not generating an exception
						throw `a param named ${name} already exists`;
					}
				}
				const param: BaseParam = new constructor();
				param.set_default_value(default_value);
				param.set_options(options);

				param.set_scene(this.self.scene());
				param.set_name(name);
				param.initialize();
				param.ui_data().set_folder_name(this.current_param_folder_name());

				this._params[param.name()] = param;
				this._params_list.push(param);
				this._param_names[param.name()] = true; //.push(param.name());
				param.set_node(this.self);

				if (param.is_multiple()) {
					for (let component of param.components()) {
						this._params[component.name()] = component;
					}
				}

				this._params_added_since_last_params_eval = true;

				return param;
			}
		}

		// add_spare_param: (type, name, default_value, options={})->
		// 	constructor = this._param_constructor(type)
		// 	if constructor?
		// 		if (existing_param = @_spare_params[name])?
		// 			# TODO: I should throw a warning also if the name matches
		// 			# a normal param
		// 			throw "a spare param named #{name} already exists"
		// 		else
		// 			options['cook'] = false
		// 			param = new Param.Vector(name, default_value, options)
		// 			param.set_scene(this.scene())
		// 			param.initialize()

		// 			@_spare_params[param.name()] = param
		// 			@_spare_param_names.push(param.name())
		// 			param.set_node(this)

		// 			if param.multiple()
		// 				lodash_each param.components(), (component)=>
		// 					@_spare_params[component.name()] = component

		// 			param
		// remove_spare_param: (name)->
		// 	if (spare_param = @_spare_params[name])?
		// 		delete @_spare_params[name]
		// 		@_spare_param_names = lodash_filter @_spare_param_names, (param_name)-> param_name == name
		// 	else
		// 		console.log("no spare param found with name #{name}")
		// 	spare_param

		// _param_constructor(type: ParamType) {
		// 	const class_name = CoreString.type_to_class_name(type)
		// 	const constructor = ParamModule[class_name]
		// 	if (constructor != null) {
		// 		return constructor
		// 	} else {
		// 		throw `no param type for ${type}. Existing types are: ${EXISTING_TYPES.join(', ')}.`
		// 	}
		// }

		param(name: string) {
			const p = this._params[name];
			if (p != null) {
				return p;
			} else {
				console.warn(
					`tried to access param '${name}' in node ${this.self.full_path()}, but existing params are: ${this.param_names()}`
				);
				return null;
			}
		}

		// spare_param(name){
		// 	const p = this._spare_params[name];
		// 	if (p != null) {
		// 		return p;
		// 	} else {
		// 		console.warn(`tried to access spare param '${name}' in node ${this.full_path()}, but existing spare params are: ${this.spare_param_names()}`);
		// 		return null;
		// 	}
		// }
		// has_spare_param(name){
		// 	return (this._params[name] != null);
		// }
		has_param(name: string) {
			return this._params[name] != null;
		}

		// any_param(name){
		// 	//console.log("#{this.full_path()}/#{name}")
		// 	let p = this._params[name];
		// 	// if (p == null) { p = this._spare_params[name]; }

		// 	if ((p == null)) {
		// 		console.warn(`param ${name} for node ${this.self.full_path()} does not exist`);
		// 	}

		// 	return p;
		// }

		// set_params_context: (context)->
		// 	lodash_each this.params(), (param)=>
		// 		param.set_context(context)

		// eval_params: (param_names)->
		// 	if !lodash_isArray(param_names)
		// 		param_names = [param_names]

		// 	lodash_each param_names, (param_name)=>
		// 		if !this.is_errored()
		// 			param = this.param(param_name)
		// 			this["_param_#{param_name}"] = param.eval()
		// 			if param.is_errored()
		// 				this.set_error("param '#{param.name()}' error: #{param.error_message()}")

		// TODO: typescript: replace with param(name).value()
		param_cache_name(param_name: string) {
			return `_param_${param_name}`;
		}
		// remove_param_cache(param: BaseParam) {
		// 	// if(this.is_cooking()){
		// 	// 	try {
		// 	// 		throw "do not clear cache while cooking"
		// 	// 	} catch(e){
		// 	// 		console.warn(e.stack)
		// 	// 	}

		// 	// }
		// 	const param_cache_name = this.param_cache_name(param.name());
		// 	return (this[param_cache_name] = null);
		// }

		// private _build_params_eval_key(){
		// 	const param_names = lodash_values(this.param_names());
		// 	const params = lodash_map(param_names, param_name=> this.param(param_name));
		// 	const strings: string[] = []
		// 	for(let param of params){
		// 		const param_cache_name = this.param_cache_name(param.name());
		// 		const cached_value = this[param_cache_name];
		// 		const param_eval_key = param.eval_key(cached_value)
		// 		strings.push(param_eval_key)
		// 	}
		// 	this._params_eval_key = strings.join('|')
		// }

		private async _eval_param(param: BaseParam) {
			// return new Promise((resolve, reject)=> {
			// const param_cache_name = this.param_cache_name(param.name());
			// const cached_value = this[param_cache_name] || null;
			if (/*cached_value == null ||*/ param.is_dirty() /* || param.is_errored()*/) {
				const param_value = await param.eval_p(); //.then(param_value=>{
				// this[param_cache_name] = param_value;
				if (param.is_errored()) {
					this.self.set_error(`param '${param.name()}' error: ${param.error_message()}`);
				}
				return param_value;
			} else {
				return cached_value;
			}
			// });
		}

		// eval_params: (params, callback)->
		// 	if !callback? || !lodash_isFunction(callback)
		// 		console.warn(callback)
		// 		throw "#{this.full_path()} has eval_all_params without a callback"

		// 	else
		// 		param_eval_keys = []
		// 		param_evaluation_states = lodash_map params, ()->false
		// 		expected_values_count = params.length
		// 		#evaluations_times_per_param_name = {}
		// 		lodash_each params, (param, index)=>
		// 			#t0 = performance.now()
		// 			this._eval_param param, (param_value)=>
		// 				#evaluations_times_per_param_name[param.name()] = performance.now() - t0

		// 				param_eval_key = param.eval_key(param_value) #[param.name(), param.expression(), param_value].join(':')
		// 				param_eval_keys.push(param_eval_key)

		// 				param_evaluation_states[index] = true
		// 				evaluated_values_count = lodash_compact(param_evaluation_states).length

		// 				# check if all params have been evaluated succesfully
		// 				if evaluated_values_count == expected_values_count
		// 					#console.log(evaluations_times_per_param_name)

		// 					if this.is_errored()
		// 						this.set_container(null)
		// 					callback(param_eval_keys.join('-'))

		async eval_params(params: BaseParam[]) {
			// let param: BaseParam;
			const promises = [];
			for (let i = 0; i < params.length; i++) {
				promises.push(this._eval_param(params[i]));
			}
			/*const param_values =*/ await Promise.all(promises);

			// const param_eval_keys = [];
			// let param_value;
			// for (let i = 0; i < params.length; i++) {
			// 	param = params[i];
			// 	param_value = param_values[i];
			// 	const param_eval_key = param.eval_key(param_value);
			// 	param_eval_keys.push(param_eval_key);
			// }
			if (this.self.is_errored()) {
				this.self.set_container(null);
			}
			// return param_eval_keys.join('-');
			// const promises = lodash_map(params, (param, index)=> {
			// 	return this.self._eval_param(param).then(param_value => {
			// 		const param_eval_key = param.eval_key(param_value);
			// 		return param_eval_keys.push(param_eval_key);
			// 	})
			// })

			// return new Promise((resolve, reject)=> {
			// 	return Promise.all(promises).then(() => {
			// 		if (this.self.is_errored()) {
			// 			this.self.set_container(null);
			// 		}
			// 		// this._params_node.remove_dirty_state()
			// 		return resolve(param_eval_keys.join('-'));
			// 	})
			// })
		}

		// invalidates_param_results() {
		// 	// this.params().forEach((param)=>{ param.invalidates_result() });
		// 	lodash_each(this.params(), (param) => param.invalidates_result());
		// 	// for(let i=0; i<this._params_list.length; i++){
		// 	// 	this._params_list[i].invalidates_result()
		// 	// }
		// }

		async eval_all_params() {
			if (this._params_node.is_dirty() || this._params_added_since_last_params_eval) {
				// const param_names = lodash_values(this.param_names())
				// const params = param_names.map(param_name=> this.param(param_name))
				//params = lodash_filter params, (param)->!param.has_parent_param()
				// if (params.length > 0) {
				await this.eval_params(this._params_list);

				// this._build_params_eval_key()
				this._params_node.remove_dirty_state();
				// }
				this._params_added_since_last_params_eval = false;
			}
			// return this._params_eval_key
		}

		_create_params_ui_data_dependencies() {
			const param_names = lodash_values(this.param_names());
			const params = param_names.map((param_name) => this.param(param_name));
			const dependent_params = params.filter((p) => p.ui_data_depends_on_other_params());

			dependent_params.forEach((p) => {
				p.set_ui_data_dependency();
			});
		}

		within_param_folder(folder_name: string, callback: () => void) {
			const previous_folder_name = this._current_param_folder_name;
			this._current_param_folder_name = folder_name;
			callback();
			this._current_param_folder_name = previous_folder_name;
		}
		current_param_folder_name(): string {
			return this._current_param_folder_name;
		}
	};
}

// block_params_emit: ->
// 	lodash_each this.params(), (param)->
// 		param.block_emit()
// unblock_params_emit: ->
// 	lodash_each this.params(), (param)->
// 		param.unblock_emit()
