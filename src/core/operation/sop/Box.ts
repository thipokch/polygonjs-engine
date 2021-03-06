import {BaseSopOperation} from './_Base';
import {DefaultOperationParams} from '../_Base';
import {CoreGroup} from '../../geometry/Group';
import {Vector3} from 'three/src/math/Vector3';
import {CoreTransform} from '../../Transform';
import {BoxBufferGeometry} from 'three/src/geometries/BoxGeometry';
import {InputCloneMode} from '../../../engine/poly/InputCloneMode';

interface BoxSopParams extends DefaultOperationParams {
	size: number;
	divisions: number;
	center: Vector3;
}

export class BoxSopOperation extends BaseSopOperation {
	static readonly DEFAULT_PARAMS: BoxSopParams = {
		size: 1,
		divisions: 1,
		center: new Vector3(0, 0, 0),
	};
	static readonly INPUT_CLONED_STATE = InputCloneMode.NEVER;
	static type(): Readonly<'box'> {
		return 'box';
	}
	private _core_transform = new CoreTransform();
	cook(input_contents: CoreGroup[], params: BoxSopParams) {
		const input_core_group = input_contents[0];
		const geometry = input_core_group
			? this._cook_with_input(input_core_group, params)
			: this._cook_without_input(params);

		return this.create_core_group_from_geometry(geometry);
	}
	private _cook_without_input(params: BoxSopParams) {
		const divisions = params.divisions;
		const size = params.size;
		const geometry = new BoxBufferGeometry(size, size, size, divisions, divisions, divisions);
		geometry.translate(params.center.x, params.center.y, params.center.z);
		geometry.computeVertexNormals();
		return geometry;
	}

	private _cook_with_input(core_group: CoreGroup, params: BoxSopParams) {
		const divisions = params.divisions;

		const bbox = core_group.bounding_box();
		const size = bbox.max.clone().sub(bbox.min);
		const center = bbox.max.clone().add(bbox.min).multiplyScalar(0.5);

		const geometry = new BoxBufferGeometry(size.x, size.y, size.z, divisions, divisions, divisions);
		const matrix = this._core_transform.translation_matrix(center);
		geometry.applyMatrix4(matrix);
		return geometry;
	}
}
