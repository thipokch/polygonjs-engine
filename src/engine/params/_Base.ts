// import {Vector3} from 'three/src/math/Vector3'
// import {Vector2} from 'three/src/math/Vector2'

import {CoreWalker} from 'src/core/Walker';
import {CoreGraphNode} from 'src/core/graph/CoreGraphNode';
// import {NodeScene} from 'src/core/graph/NodeScene';
// import {NamedGraphNode} from 'src/core/graph/NamedGraphNode';
import {BaseNode} from 'src/engine/nodes/_Base';

// import {CallbackOption} from './concerns/options/Callback'
// import {ColorOption} from './concerns/options/Color'
// import {CookOption} from './concerns/options/Cook'
// import {DesktopOption} from './concerns/options/Desktop'
// import {ExpressionOption} from './concerns/options/Expression'
// import {MenuOption} from './concerns/options/Menu'
// import {NodeSelectionOption} from './concerns/options/NodeSelection'
// import {RangeOption} from './concerns/options/Range'
// import {AssetReferenceOption} from './concerns/options/AssetReference'
// import {SpareOption} from './concerns/options/Spare'
// import {MultilineOption} from './concerns/options/Multiline'
// import {TextureOption} from './concerns/options/Texture'
// import {VisibleOption} from './concerns/options/Visible'

// import {Emit} from './concerns/Emit';
// import {Errored} from './concerns/Errored';
// import {Eval} from './concerns/Eval';
// import {Expression} from './concerns/Expression';
// import {Hierarchy} from './concerns/Hierarchy';
// import {Json} from './concerns/Json';
// import {Named} from './concerns/Named';
// import {Node} from './concerns/Node';
// import {Options} from './concerns/Options';
// import {TimeDependent} from './concerns/TimeDependent';
// import {Type} from './concerns/Type';
// import {UIDataOwner} from './concerns/UIDataOwner';
// import {VisitorsBase} from './concerns/visitors/_Base';

import {OptionsController} from './utils/OptionsController';
import {ExpressionController} from './utils/ExpressionController';
import {EmitController} from './utils/EmitController';
import {ParamSerializer} from './utils/Serializer';
import {StatesController} from './utils/StatesController';
import {UIData} from './utils/UIData';

import {TypedMultipleParam} from './_Multiple';
import {FloatParam} from './Float';
import {ParamType} from '../poly/ParamType';
import {ParamEvent} from '../poly/ParamEvent';
import {PolyScene} from '../scene/PolyScene';

import {ParamInitValuesTypeMap, ParamValuesTypeMap} from 'src/engine/nodes/utils/params/ParamsController';

export interface TypedParamVisitor {
	visit_typed_param: (param: BaseParam) => any;
}

export abstract class TypedParam<T extends ParamType> extends CoreGraphNode {
	protected _raw_input: string;
	protected _default_value: ParamValuesTypeMap[T];
	protected _value: ParamValuesTypeMap[T];
	// protected _expression: string;
	protected _node: BaseNode;
	protected _parent_param: TypedMultipleParam<any>;
	protected _components: FloatParam[] = [];

	private _options: OptionsController;
	get options(): OptionsController {
		return (this._options = this._options || new OptionsController(this));
	}
	private _emit_controller: EmitController;
	get emit_controller(): EmitController {
		return (this._emit_controller = this._emit_controller || new EmitController(this));
	}
	private _expression_controller: ExpressionController;
	get expression_controller(): ExpressionController {
		return (this._expression_controller = this._expression_controller || new ExpressionController(this));
	}
	private _serializer: ParamSerializer;
	get serializer(): ParamSerializer {
		return (this._serializer = this._serializer || new ParamSerializer(this));
	}
	private _states: StatesController;
	get states(): StatesController {
		return (this._states = this._states || new StatesController(this));
	}
	private _ui_data: UIData;
	get ui_data(): UIData {
		return (this._ui_data = this._ui_data || new UIData(this.scene, this));
	}

	constructor(scene: PolyScene) {
		super(scene, 'BaseParam');
		this.initialize_param();
	}
	initialize_value() {}
	initialize_param() {}
	// 	// this.add_post_dirty_hook(this._remove_node_param_cache.bind(this))
	// }
	// initialize() {
	// 	this.init_components();
	// 	// this.init_expression()
	// 	// this._init_ui_data()
	// }
	accepts_visitor(visitor: TypedParamVisitor): any {
		return visitor.visit_typed_param(this);
	}

	//
	// init_expression() {}

	// type
	static type(): ParamType {
		return ParamType.FLOAT; // adding a type here, but just to not have a compile error
	}
	get type(): ParamType {
		return (this.constructor as typeof BaseParam).type();
	}
	get is_numeric(): boolean {
		return false;
	}

	// name
	set_name(name: string) {
		super.set_name(name);
		// this.self.name_graph_node().set_dirty();
		// this.self.name_graph_node().remove_dirty_state();
	}

	// TODO: typescript
	get value() {
		return this._value;
	}
	convert(raw_val: any): ParamValuesTypeMap[T] {
		return this._default_value;
	}
	set(new_value: ParamValuesTypeMap[T]): void {}
	get default_value() {
		return this._default_value;
	}
	is_raw_input_default(value: any): boolean {
		return true;
	}
	set_default_value(default_value: ParamValuesTypeMap[T]) {
		this._default_value = default_value;
	}
	set_init_value(init_value: ParamInitValuesTypeMap[T]) {
		this._default_value = this.convert(init_value);
		this._value = this.convert(init_value);
	}
	eval_p(): Promise<ParamValuesTypeMap[T]> {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	// node
	set_node(node: BaseNode | null) {
		if (!node) {
			if (this._node) {
				this._node.params.params_node.remove_graph_input(this);
			}
		} else {
			this._node = node;
			if (this.options.makes_node_dirty_when_dirty()) {
				node.params.params_node.add_graph_input(this);
			}
		}

		if (this.is_multiple) {
			this.init_components();
			for (let c of this.components) {
				c.set_node(node);
			}
		}
	}
	get node() {
		return this._node;
	}
	get parent() {
		return this.node;
	}

	// hierarchy
	set_parent_param(param: TypedMultipleParam<any>) {
		param.add_graph_input(this);
		this._parent_param = param;
	}
	get parent_param(): TypedMultipleParam<any> {
		return this._parent_param;
	}
	has_parent_param(): boolean {
		return this._parent_param != null;
	}
	full_path(): string {
		return this.node.full_path() + '/' + this.name;
	}
	path_relative_to(node: BaseNode | BaseParam): string {
		return CoreWalker.relative_path(node, this);
	}

	// emit
	emit(event_name: ParamEvent.VISIBLE_UPDATED): void;
	emit(event_name: ParamEvent.UPDATED): void;
	emit(event_name: ParamEvent.DELETED): void;
	emit(event_name: ParamEvent, data: object | null = null): void {
		if (this.emit_controller.emit_allowed) {
			this.scene.events_controller.dispatch(this, event_name, data);
		}
	}

	// multiple
	get components() {
		return this._components;
	}
	static get component_names(): string[] {
		return [];
	}
	get component_names(): string[] {
		const c = (<unknown>this.constructor) as TypedParam<T>;
		return c.component_names;
	}
	get is_multiple(): boolean {
		return this.component_names.length > 0;
	}
	init_components() {}

	// expression
	set_expression(expression: string | null) {
		this.expression_controller.set_expression(expression);
	}
	has_expression() {
		return this.expression_controller.active;
	}

	// serialize
	to_json() {
		return this.serializer.to_json();
	}
}
export abstract class BaseParam extends TypedParam<any> {}