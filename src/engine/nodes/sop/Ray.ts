import {Vector3} from 'three/src/math/Vector3';
import {Raycaster, Intersection} from 'three/src/core/Raycaster';
import {Object3D} from 'three/src/core/Object3D';
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial';
import {Mesh} from 'three/src/objects/Mesh';
import {DoubleSide} from 'three/src/constants';

import {TypedSopNode} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';
import {InputCloneMode} from '../../poly/InputCloneMode';

const MAT_DOUBLE_SIDED = new MeshBasicMaterial({
	side: DoubleSide,
});

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
class RaySopParamsConfig extends NodeParamsConfig {
	use_normals = ParamConfig.BOOLEAN(1);
	direction = ParamConfig.VECTOR3([0, -1, 0], {
		visible_if: {use_normals: 0},
	});
	transfer_face_normals = ParamConfig.BOOLEAN(1);
}
const ParamsConfig = new RaySopParamsConfig();

export class RaySopNode extends TypedSopNode<RaySopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'ray';
	}

	// _material_by_object_uuid: MaterialByString
	private _bound_assign_mat = this._assign_double_sided_material_to_object.bind(this); //(Object3D)=>void;
	private _raycaster = new Raycaster();

	static double_sided_material() {
		return MAT_DOUBLE_SIDED;
	}

	static displayed_input_names(): string[] {
		return ['geometry to move', 'geometry to ray onto'];
	}

	initialize_node() {
		this.io.inputs.set_count(2);
		this.io.inputs.init_inputs_cloned_state([
			InputCloneMode.FROM_NODE,
			InputCloneMode.ALWAYS, // to assign double sided mat
		]);
	}

	create_params() {}

	cook(input_contents: CoreGroup[]) {
		const core_group = input_contents[0];
		const core_group_collision = input_contents[1];

		this.ray(core_group, core_group_collision);
	}

	ray(core_group: CoreGroup, core_group_collision: CoreGroup) {
		// this._material_by_object_uuid = {}
		this._assign_double_sided_material_to_core_group(core_group_collision);

		let direction: Vector3, first_intersect: Intersection;
		for (let point of core_group.points()) {
			direction = this.pv.use_normals ? point.normal() : this.pv.direction;
			this._raycaster.set(point.position(), direction);

			first_intersect = this._raycaster.intersectObjects(core_group_collision.objects(), true)[0];
			if (first_intersect) {
				point.set_position(first_intersect.point);
				if (this.pv.transfer_face_normals && first_intersect.face) {
					point.set_normal(first_intersect.face.normal);
				}
			}
		}

		this.set_core_group(core_group);
	}

	_assign_double_sided_material_to_core_group(core_group: CoreGroup) {
		for (let object of core_group.objects()) {
			object.traverse(this._bound_assign_mat);
		}
	}
	_assign_double_sided_material_to_object(object: Object3D) {
		// this._material_by_object_uuid[object.uuid] = object.material
		(object as Mesh).material = RaySopNode.double_sided_material();
	}

	// average_normals(geometry){
	// 	const normals = [];
	// 	const vertex_index_names = ['a', 'b', 'c'];
	// 	lodash_each(geometry.faces, face=> {
	// 		return lodash_each(vertex_index_names, (vertex_index_name, i)=> {
	// 			const vertex_index = face[vertex_index_name];
	// 			if (normals[vertex_index] == null) { normals[vertex_index] = []; }
	// 			return normals[vertex_index].push(face.vertexNormals[i].clone());
	// 		});
	// 	});

	// 	lodash_each(normals, function(normal_group, i){
	// 		const average = new Vector3(
	// 			(lodash_sum(lodash_map(normal_group, 'x')) / normal_group.length),
	// 			(lodash_sum(lodash_map(normal_group, 'y')) / normal_group.length),
	// 			(lodash_sum(lodash_map(normal_group, 'z')) / normal_group.length)
	// 		);
	// 		return normals[i] = average;
	// 	});

	// 	return normals;
	// }
}
