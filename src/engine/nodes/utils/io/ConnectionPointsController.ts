import {CoreGraphNode} from '../../../../core/graph/CoreGraphNode';
import {
	ConnectionPointTypeMap,
	ConnectionPointEnumMap,
	DEFAULT_CONNECTION_POINT_ENUM_MAP,
	create_connection_point,
} from './connections/ConnectionMap';
import {TypedNode} from '../../_Base';
import {ConnectionPointsSpareParamsController} from './ConnectionPointsSpareParamsController';
import {NodeContext, NetworkChildNodeType} from '../../../poly/NodeContext';

type IONameFunction = (index: number) => string;
type ExpectedConnectionTypesFunction<NC extends NodeContext> = () => ConnectionPointEnumMap[NC][];

export class ConnectionPointsController<NC extends NodeContext> {
	private _spare_params_controller: ConnectionPointsSpareParamsController<NC>;
	private _create_spare_params_from_inputs = true;
	private _functions_overridden = false;

	constructor(private node: TypedNode<NC, any>, private _context: NC) {
		this._spare_params_controller = new ConnectionPointsSpareParamsController(this.node, this._context);
	}

	private _input_name_function: IONameFunction = (index: number) => {
		return `in${index}`;
	};
	private _output_name_function: IONameFunction = (index: number) => {
		return index == 0 ? 'val' : `val${index}`;
	};
	// private _default_input_type: ConnectionPointType = ConnectionPointType.FLOAT;
	private _expected_input_types_function: ExpectedConnectionTypesFunction<NC> = () => {
		const type = this.first_input_connection_type() || this.default_connection_type();
		return [type, type];
	};
	private _expected_output_types_function: ExpectedConnectionTypesFunction<NC> = () => {
		return [this._expected_input_types_function()[0]];
	};
	protected default_connection_type(): ConnectionPointEnumMap[NC] {
		return DEFAULT_CONNECTION_POINT_ENUM_MAP[this._context];
	}
	protected create_connection_point(name: string, type: ConnectionPointEnumMap[NC]): ConnectionPointTypeMap[NC] {
		return create_connection_point(this._context, name, type) as ConnectionPointTypeMap[NC];
	}

	functions_overridden(): boolean {
		return this._functions_overridden;
	}
	initialized(): boolean {
		return this._initialized;
	}

	set_create_spare_params_from_inputs(state: boolean) {
		this._create_spare_params_from_inputs = state;
	}

	set_input_name_function(func: IONameFunction) {
		this._initialize_if_required();
		this._input_name_function = func;
	}
	set_output_name_function(func: IONameFunction) {
		this._initialize_if_required();
		this._output_name_function = func;
	}

	// set_default_input_type(type: ConnectionPointType) {
	// 	this._default_input_type = type;
	// }
	set_expected_input_types_function(func: ExpectedConnectionTypesFunction<NC>) {
		this._initialize_if_required();
		this._functions_overridden = true;
		this._expected_input_types_function = func;
	}
	set_expected_output_types_function(func: ExpectedConnectionTypesFunction<NC>) {
		this._initialize_if_required();
		this._functions_overridden = true;
		this._expected_output_types_function = func;
	}

	input_name(index: number) {
		return this._wrapped_input_name_function(index);
	}
	output_name(index: number) {
		return this._wrapped_output_name_function(index);
	}

	private _update_signature_if_required_bound = this.update_signature_if_required.bind(this);
	private _initialized: boolean = false;
	initialize_node() {
		// I don't want this check here, as I should refactor to have the has_named_inputs
		// be initialized from here
		// if (!this.node.io.inputs.has_named_inputs) {
		// 	return;
		// }

		if (this._initialized) {
			console.warn('already initialized', this.node);
			return;
		}
		this._initialized = true;

		// hooks
		this.node.io.inputs.add_on_set_input_hook(
			'_update_signature_if_required',
			this._update_signature_if_required_bound
		);
		// this.node.lifecycle.add_on_add_hook(this._update_signature_if_required_bound);
		this.node.params.add_on_scene_load_hook(
			'_update_signature_if_required',
			this._update_signature_if_required_bound
		);
		this.node.params.on_params_created(
			'_update_signature_if_required_bound',
			this._update_signature_if_required_bound
		);
		this.node.add_post_dirty_hook('_update_signature_if_required', this._update_signature_if_required_bound);

		if (!this._spare_params_controller.initialized()) {
			this._spare_params_controller.initialize_node();
		}
	}
	private _initialize_if_required() {
		if (!this._initialized) {
			this.initialize_node();
		}
	}

	get spare_params() {
		return this._spare_params_controller;
	}

	update_signature_if_required(dirty_trigger?: CoreGraphNode) {
		if (!this.node.lifecycle.creation_completed || !this._connections_match_inputs()) {
			this.update_connection_types();
			this.node.remove_dirty_state();

			// no need to update the successors when loading,
			// since the connection point types are stored in the scene data
			if (!this.node.scene.loading_controller.is_loading) {
				this.make_successors_update_signatures();
			}
		}
	}
	// used when a node changes its signature, adn the output nodes need to adapt their own signatures
	private make_successors_update_signatures() {
		const successors = this.node.graph_all_successors();
		if (this.node.children_allowed()) {
			const subnet_inputs = this.node.nodes_by_type(NetworkChildNodeType.INPUT);
			const subnet_outputs = this.node.nodes_by_type(NetworkChildNodeType.OUTPUT);
			for (let subnet_input of subnet_inputs) {
				successors.push(subnet_input);
			}
			for (let subnet_output of subnet_outputs) {
				successors.push(subnet_output);
			}
		}

		for (let graph_node of successors) {
			const node = graph_node as TypedNode<NC, any>;
			// we need to check if node.io exists to be sure it is a node, not just a graph_node
			if (node.io && node.io.has_connection_points_controller && node.io.connection_points.initialized()) {
				node.io.connection_points.update_signature_if_required(this.node);
			}
		}
		// we also need to have subnet_output nodes update their parents
		// if (this.node.type == NetworkChildNodeType.OUTPUT) {
		// this.node.parent?.io.connection_points.update_signature_if_required(this.node);
		// }
	}

	update_connection_types() {
		const set_dirty = false;
		const expected_input_types = this._wrapped_expected_input_types_function();
		const expected_output_types = this._wrapped_expected_output_types_function();

		const named_input_connection_points: ConnectionPointTypeMap[NC][] = [];
		for (let i = 0; i < expected_input_types.length; i++) {
			const type = expected_input_types[i];
			const point = this.create_connection_point(this._wrapped_input_name_function(i), type);
			named_input_connection_points.push(point);
		}
		const named_output_connect_points: ConnectionPointTypeMap[NC][] = [];
		for (let i = 0; i < expected_output_types.length; i++) {
			const type = expected_output_types[i];
			const point = this.create_connection_point(this._wrapped_output_name_function(i), type);
			named_output_connect_points.push(point);
		}

		this.node.io.inputs.set_named_input_connection_points(named_input_connection_points);

		this.node.io.outputs.set_named_output_connection_points(named_output_connect_points, set_dirty);
		if (this._create_spare_params_from_inputs) {
			this._spare_params_controller.create_spare_parameters();
		}
	}

	protected _connections_match_inputs(): boolean {
		const current_input_types = this.node.io.inputs.named_input_connection_points.map((c) => c?.type);
		const current_output_types = this.node.io.outputs.named_output_connection_points.map((c) => c?.type);
		const expected_input_types = this._wrapped_expected_input_types_function();
		const expected_output_types = this._wrapped_expected_output_types_function();

		if (expected_input_types.length != current_input_types.length) {
			return false;
		}
		if (expected_output_types.length != current_output_types.length) {
			return false;
		}

		for (let i = 0; i < current_input_types.length; i++) {
			if (current_input_types[i] != expected_input_types[i]) {
				return false;
			}
		}
		for (let i = 0; i < current_output_types.length; i++) {
			if (current_output_types[i] != expected_output_types[i]) {
				return false;
			}
		}

		return true;
	}

	//
	//
	// WRAPPPED METHOD
	// the goal here is to use the types data saved in the scene file
	// when the scene is loading. That has 2 purposes:
	// - avoid an update cascade during loading, where nodes with many inputs are updated
	//	 several times.
	// - allow the subnet_input to load with the connection_points it had on save,
	//   which in turn allows connected nodes to not lose their connections.
	//
	private _wrapped_expected_input_types_function() {
		if (this.node.scene.loading_controller.is_loading) {
			const in_data = this.node.io.saved_connection_points_data.in();
			if (in_data) {
				return in_data.map((d) => d.type as ConnectionPointEnumMap[NC]);
			}
		}
		return this._expected_input_types_function();
	}
	private _wrapped_expected_output_types_function() {
		if (this.node.scene.loading_controller.is_loading) {
			const out_data = this.node.io.saved_connection_points_data.out();
			if (out_data) {
				return out_data.map((d) => d.type as ConnectionPointEnumMap[NC]);
			}
		}
		return this._expected_output_types_function();
	}
	private _wrapped_input_name_function(index: number) {
		if (this.node.scene.loading_controller.is_loading) {
			const in_data = this.node.io.saved_connection_points_data.in();
			if (in_data) {
				return in_data[index].name;
			}
		}
		return this._input_name_function(index);
	}
	private _wrapped_output_name_function(index: number) {
		if (this.node.scene.loading_controller.is_loading) {
			const out_data = this.node.io.saved_connection_points_data.out();
			if (out_data) {
				return out_data[index].name;
			}
		}
		return this._output_name_function(index);
	}

	// protected input_connection_type() {
	// 	return this.first_input_connection_type();
	// }
	// protected output_connection_type() {
	// 	return this.first_input_connection_type();
	// }

	first_input_connection_type(): ConnectionPointEnumMap[NC] | undefined {
		return this.input_connection_type(0);
	}
	input_connection_type(index: number): ConnectionPointEnumMap[NC] | undefined {
		const connections = this.node.io.connections.input_connections();
		if (connections) {
			const connection = connections[index];
			if (connection) {
				return connection.src_connection_point()!.type as ConnectionPointEnumMap[NC];
			}
		}
	}
	// input_connection_point_from_connection(connection: TypedNodeConnection<NC>): ConnectionPointTypeMap[NC] {
	// 	const node_dest = connection.node_dest;
	// 	const output_index = connection.output_index;
	// 	return node_dest.io.outputs.named_output_connection_points[output_index] as ConnectionPointTypeMap[NC];
	// }
	// output_connection_point_from_connection(connection: TypedNodeConnection<NC>): ConnectionPointTypeMap[NC] {
	// 	const node_src = connection.node_src;
	// 	const output_index = connection.output_index;
	// 	return node_src.io.outputs.named_output_connection_points[output_index] as ConnectionPointTypeMap[NC];
	// }
	// connection_point_type_from_connection(connection: TypedNodeConnection<NC>): ConnectionPointEnumMap[NC] {
	// 	return connection.dest_connection_point()?.type as ConnectionPointEnumMap[NC];
	// 	// const connection_point = this.output_connection_point_from_connection(connection)!;
	// 	// return connection_point.type as ConnectionPointEnumMap[NC];
	// }
	// connection_point_name_from_connection(connection: TypedNodeConnection<NC>): string {
	// 	return connection.dest_connection_point()!.name
	// 	// const connection_point = this.output_connection_point_from_connection(connection)!;
	// 	// return connection_point.name;
	// }
}
