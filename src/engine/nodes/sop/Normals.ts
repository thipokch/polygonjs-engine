import {TypedSopNode} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';
import {InputCloneMode} from '../../poly/InputCloneMode';
import {CoreObject} from '../../../core/geometry/Object';
import {Attribute} from '../../../core/geometry/Attribute';
import {Mesh} from 'three/src/objects/Mesh';
import {BufferGeometry} from 'three/src/core/BufferGeometry';
import {CoreGeometry} from '../../../core/geometry/Geometry';

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
class NormalsSopParamsConfig extends NodeParamsConfig {
	edit = ParamConfig.BOOLEAN(0);
	update_x = ParamConfig.BOOLEAN(0, {
		visible_if: {edit: 1},
	});
	x = ParamConfig.FLOAT('@N.x', {
		visible_if: {update_x: 1, edit: 1},
		expression: {for_entities: true},
	});
	update_y = ParamConfig.BOOLEAN(0, {
		visible_if: {edit: 1},
	});
	y = ParamConfig.FLOAT('@N.y', {
		visible_if: {update_y: 1, edit: 1},
		expression: {for_entities: true},
	});
	update_z = ParamConfig.BOOLEAN(0, {
		visible_if: {edit: 1},
	});
	z = ParamConfig.FLOAT('@N.z', {
		visible_if: {update_z: 1, edit: 1},
		expression: {for_entities: true},
	});

	recompute = ParamConfig.BOOLEAN(1, {
		visible_if: {edit: 0},
	});
	invert = ParamConfig.BOOLEAN(0);
}
const ParamsConfig = new NormalsSopParamsConfig();

export class NormalsSopNode extends TypedSopNode<NormalsSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'normals';
	}

	static displayed_input_names(): string[] {
		return ['geometry to update normals of'];
	}
	initialize_node() {
		this.io.inputs.set_count(1);
		this.io.inputs.init_inputs_cloned_state(InputCloneMode.FROM_NODE);
	}

	async cook(input_contents: CoreGroup[]) {
		const core_group = input_contents[0];

		if (this.pv.edit) {
			await this._eval_expressions_for_core_group(core_group);
		} else {
			if (this.pv.recompute) {
				core_group.compute_vertex_normals();
			}
		}
		if (this.pv.invert) {
			this._invert_normals(core_group);
		}

		this.set_core_group(core_group);
	}

	private async _eval_expressions_for_core_group(core_group: CoreGroup) {
		const core_objects = core_group.core_objects();
		for (let i = 0; i < core_objects.length; i++) {
			await this._eval_expressions_for_core_object(core_objects[i]);
		}
	}
	private async _eval_expressions_for_core_object(core_object: CoreObject) {
		const object = core_object.object();
		const geometry = (object as Mesh).geometry as BufferGeometry;
		const points = core_object.points();

		let attrib = geometry.getAttribute(Attribute.NORMAL);
		if (!attrib) {
			const core_geometry = new CoreGeometry(geometry);
			core_geometry.add_numeric_attrib(Attribute.NORMAL, 3, 0);
			attrib = geometry.getAttribute(Attribute.NORMAL);
		}
		const array = attrib.array as number[];

		// x
		if (this.pv.update_x) {
			if (this.p.x.has_expression() && this.p.x.expression_controller) {
				await this.p.x.expression_controller.compute_expression_for_points(points, (point, value) => {
					array[point.index * 3 + 0] = value;
				});
			} else {
				let point;
				for (let i = 0; i < points.length; i++) {
					point = points[i];
					array[point.index * 3 + 0] = this.pv.x;
				}
			}
		}
		// y
		if (this.pv.update_y) {
			if (this.p.y.has_expression() && this.p.y.expression_controller) {
				await this.p.y.expression_controller.compute_expression_for_points(points, (point, value) => {
					array[point.index * 3 + 1] = value;
				});
			} else {
				let point;
				for (let i = 0; i < points.length; i++) {
					point = points[i];
					array[point.index * 3 + 1] = this.pv.y;
				}
			}
		}
		// z
		if (this.pv.update_z) {
			if (this.p.z.has_expression() && this.p.z.expression_controller) {
				await this.p.z.expression_controller.compute_expression_for_points(points, (point, value) => {
					array[point.index * 3 + 2] = value;
				});
			} else {
				let point;
				for (let i = 0; i < points.length; i++) {
					point = points[i];
					array[point.index * 3 + 2] = this.pv.z;
				}
			}
		}
	}

	private _invert_normals(core_group: CoreGroup) {
		for (let core_object of core_group.core_objects()) {
			const geometry = core_object.core_geometry()?.geometry();
			if (geometry) {
				const normal_attrib = geometry.attributes[Attribute.NORMAL];
				if (normal_attrib) {
					const array = normal_attrib.array as number[];
					for (let i = 0; i < array.length; i++) {
						array[i] *= -1;
					}
				}
			}
		}
	}
}
