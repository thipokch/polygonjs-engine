import {Vector3} from 'three/src/math/Vector3'
import {Sphere} from 'three/src/math/Sphere'
import {Box3} from 'three/src/math/Box3'
import lodash_flatten from 'lodash/flatten'
import {CorePoint} from 'src/core/geometry/Point'

export type OctreeNodeTraverseCallback = (node: OctreeNode) => void

export class OctreeNode {
	_leaves_by_octant: OctreeNodeByString = {}
	_points_by_octant_id: CorePointsByString
	_leaves: OctreeNode[] = []
	_bbox: Box3
	_center: Vector3
	_bounding_boxes_by_octant: Box3ByString

	constructor(private _level: number = 0) {}

	level() {
		return this._level
	}

	traverse(callback: OctreeNodeTraverseCallback) {
		callback(this)
		const octants = Object.values(this._leaves_by_octant)
		octants.forEach((node) => {
			node.traverse(callback)
		})
	}

	intersects_sphere(sphere: Sphere): boolean {
		return this._bbox.intersectsSphere(sphere)
	}

	//@PERF = 0
	points_in_sphere(sphere: Sphere, accumulated_points: CorePoint[]): void {
		if (this._leaves.length == 0) {
			const found_points = lodash_flatten(
				Object.values(this._points_by_octant_id)
			)
			const selected_points = found_points.filter((point) =>
				sphere.containsPoint(point.position())
			)
			selected_points.forEach((point) => {
				accumulated_points.push(point)
			})
		} else {
			//start_time = performance.now()
			const leaves_intersecting_with_sphere = this._leaves.filter(
				(leaf) => leaf.intersects_sphere(sphere)
			)

			//console.log("level: #{@_level}, found #{leaves_intersecting_with_sphere.length} leaves ")
			leaves_intersecting_with_sphere.forEach((leaf) =>
				leaf.points_in_sphere(sphere, accumulated_points)
			)
		}
	}
	//this.constructor.PERF += performance.now()-start_time

	set_bounding_box(bbox: Box3) {
		this._bbox = bbox
		this._center = this._bbox.max
			.clone()
			.add(this._bbox.min)
			.multiplyScalar(0.5)
	}

	bounding_box(): Box3 {
		return this._bbox
	}

	// points_count: ->
	// 	@_points_count

	set_points(points: CorePoint[]) {
		//@_points_count = points.length

		this._points_by_octant_id = {}
		points.forEach((point) => {
			this.add_point(point)
		})

		const octant_ids = Object.keys(this._points_by_octant_id)
		if (octant_ids.length > 1) {
			octant_ids.forEach((octant_id) => {
				this.create_leaf(octant_id)
			})
		}
	}

	create_leaf(octant_id: string) {
		const leaf = new OctreeNode(this._level + 1)
		this._leaves_by_octant[octant_id] = leaf
		this._leaves.push(leaf)
		leaf.set_bounding_box(this._leaf_bbox(octant_id))
		//throw "test #{@_level}"

		leaf.set_points(this._points_by_octant_id[octant_id])
	}

	add_point(point: CorePoint) {
		const octant_id = this._octant_id(point.position())
		if (this._points_by_octant_id[octant_id] == null) {
			this._points_by_octant_id[octant_id] = []
		}
		this._points_by_octant_id[octant_id].push(point)
	}

	private _octant_id(position: Vector3): string {
		const x_pos = position.x > this._center.x ? 1 : 0
		const y_pos = position.y > this._center.y ? 1 : 0
		const z_pos = position.z > this._center.z ? 1 : 0
		return `${x_pos}${y_pos}${z_pos}`
	}

	_leaf_bbox(octant_id: string): Box3 {
		if (this._bounding_boxes_by_octant == null) {
			this._prepare_leaves_bboxes()
		}
		return this._bounding_boxes_by_octant[octant_id]
	}

	private _bbox_center(x_pos: number, y_pos: number, z_pos: number) {
		const corner = this._bbox.min.clone()
		if (x_pos) {
			corner.x = this._bbox.max.x
		}
		if (y_pos) {
			corner.y = this._bbox.max.y
		}
		if (z_pos) {
			corner.z = this._bbox.max.z
		}

		return corner
			.clone()
			.add(this._center)
			.multiplyScalar(0.5)
	}

	private _prepare_leaves_bboxes() {
		const bbox_centers = []
		bbox_centers.push(this._bbox_center(0, 0, 0))
		bbox_centers.push(this._bbox_center(0, 0, 1))
		bbox_centers.push(this._bbox_center(0, 1, 0))
		bbox_centers.push(this._bbox_center(0, 1, 1))
		bbox_centers.push(this._bbox_center(1, 0, 0))
		bbox_centers.push(this._bbox_center(1, 0, 1))
		bbox_centers.push(this._bbox_center(1, 1, 0))
		bbox_centers.push(this._bbox_center(1, 1, 1))

		const bbox_size_quarter = this._bbox.max
			.clone()
			.sub(this._bbox.min)
			.multiplyScalar(0.25)
		this._bounding_boxes_by_octant = {}
		bbox_centers.forEach((bbox_center) => {
			const octant_id = this._octant_id(bbox_center)
			const bbox = new Box3(
				bbox_center.clone().sub(bbox_size_quarter),
				bbox_center.clone().add(bbox_size_quarter)
			)
			this._bounding_boxes_by_octant[octant_id] = bbox
		})
		// this._bounding_boxes_by_octant;
	}
}

interface OctreeNodeByString {
	[propName: string]: OctreeNode
}
interface CorePointsByString {
	[propName: string]: CorePoint[]
}
interface Box3ByString {
	[propName: string]: Box3
}