// for dynamic imports, use
// https://wanago.io/2018/08/20/webpack-4-course-part-eight-dynamic-imports-with-prefetch-and-preload/
// with webpackExclude to not bundle files like _Base.ts or what is under utils/
// with webpackChunkName and [request] to ensure meaningful name
// more on https://webpack.js.org/api/module-methods/
import {CATEGORY_SOP} from './Category';

import {AddSopNode} from '../../../nodes/sop/Add';
import {AnimationCopySopNode} from '../../../nodes/sop/AnimationCopy';
import {AnimationMixerSopNode} from '../../../nodes/sop/AnimationMixer';
import {AttribAddMultSopNode} from '../../../nodes/sop/AttribAddMult';
import {AttribCopySopNode} from '../../../nodes/sop/AttribCopy';
import {AttribCreateSopNode} from '../../../nodes/sop/AttribCreate';
import {AttribDeleteSopNode} from '../../../nodes/sop/AttribDelete';
import {AttribNormalizeSopNode} from '../../../nodes/sop/AttribNormalize';
import {AttribPromoteSopNode} from '../../../nodes/sop/AttribPromote';
import {AttribRemapSopNode} from '../../../nodes/sop/AttribRemap';
import {AttribRenameSopNode} from '../../../nodes/sop/AttribRename';
import {AttribTransferSopNode} from '../../../nodes/sop/AttribTransfer';
import {BboxScatterSopNode} from '../../../nodes/sop/BboxScatter';
import {BlendSopNode} from '../../../nodes/sop/Blend';
import {BoxSopNode} from '../../../nodes/sop/Box';
import {CacheSopNode} from '../../../nodes/sop/Cache';
import {CircleSopNode} from '../../../nodes/sop/Circle';
import {CodeSopNode} from '../../../nodes/sop/Code';
import {ColorSopNode} from '../../../nodes/sop/Color';
import {ConeSopNode} from '../../../nodes/sop/Cone';
import {CopySopNode} from '../../../nodes/sop/Copy';
import {DataSopNode} from '../../../nodes/sop/Data';
import {DataUrlSopNode} from '../../../nodes/sop/DataUrl';
import {DelaySopNode} from '../../../nodes/sop/Delay';
import {DeleteSopNode} from '../../../nodes/sop/Delete';
import {DrawRangeSopNode} from '../../../nodes/sop/DrawRange';
import {FaceSopNode} from '../../../nodes/sop/Face';
import {FileSopNode} from '../../../nodes/sop/File';
import {FuseSopNode} from '../../../nodes/sop/Fuse';
import {HexagonsSopNode} from '../../../nodes/sop/Hexagons';
import {HierarchySopNode} from '../../../nodes/sop/Hierarchy';
import {HeightMapSopNode} from '../../../nodes/sop/HeightMap';
import {InstanceSopNode} from '../../../nodes/sop/Instance';
import {JitterSopNode} from '../../../nodes/sop/Jitter';
import {LayerSopNode} from '../../../nodes/sop/Layer';
import {LineSopNode} from '../../../nodes/sop/Line';
import {MaterialSopNode} from '../../../nodes/sop/Material';
import {MergeSopNode} from '../../../nodes/sop/Merge';
import {NoiseSopNode} from '../../../nodes/sop/Noise';
import {NormalsSopNode} from '../../../nodes/sop/Normals';
import {NullSopNode} from '../../../nodes/sop/Null';
import {ObjectMergeSopNode} from '../../../nodes/sop/ObjectMerge';
import {OcclusionSopNode} from '../../../nodes/sop/Occlusion';
import {ParticlesSystemGpuSopNode} from '../../../nodes/sop/ParticlesSystemGpu';
import {PeakSopNode} from '../../../nodes/sop/Peak';
import {PhysicsRBDAttributesSopNode} from '../../../nodes/sop/PhysicsRBDAttributes';
import {PhysicsForceAttributesSopNode} from '../../../nodes/sop/PhysicsForceAttributes';
import {PhysicsRBDSolverSopNode} from '../../../nodes/sop/PhysicsRBDSolver';
import {PlaneSopNode} from '../../../nodes/sop/Plane';
import {PointSopNode} from '../../../nodes/sop/Point';
import {PolywireSopNode} from '../../../nodes/sop/Polywire';
import {RaySopNode} from '../../../nodes/sop/Ray';
import {ResampleSopNode} from '../../../nodes/sop/Resample';
import {ScatterSopNode} from '../../../nodes/sop/Scatter';
import {ShadowsSopNode} from '../../../nodes/sop/Shadows';
import {SkinSopNode} from '../../../nodes/sop/Skin';
import {SphereSopNode} from '../../../nodes/sop/Sphere';
import {SplitSopNode} from '../../../nodes/sop/Split';
import {SubdivideSopNode} from '../../../nodes/sop/Subdivide';
import {SwitchSopNode} from '../../../nodes/sop/Switch';
import {TextSopNode} from '../../../nodes/sop/Text';
import {TorusSopNode} from '../../../nodes/sop/Torus';
import {TorusKnotSopNode} from '../../../nodes/sop/TorusKnot';
import {TransformSopNode} from '../../../nodes/sop/Transform';
import {TransformCopySopNode} from '../../../nodes/sop/TransformCopy';
import {TransformResetSopNode} from '../../../nodes/sop/TransformReset';
import {TubeSopNode} from '../../../nodes/sop/Tube';
import {UvProjectSopNode} from '../../../nodes/sop/UvProject';

export interface GeoNodeChildrenMap {
	add: AddSopNode;
	animation_copy: AnimationCopySopNode;
	animation_mixer: AnimationMixerSopNode;
	attrib_add_mult: AttribAddMultSopNode;
	attrib_copy: AttribCopySopNode;
	attrib_create: AttribCreateSopNode;
	attrib_delete: AttribDeleteSopNode;
	attrib_normalize: AttribNormalizeSopNode;
	attrib_promote: AttribPromoteSopNode;
	attrib_remap: AttribRemapSopNode;
	attrib_rename: AttribRenameSopNode;
	attrib_transfer: AttribTransferSopNode;
	bbox_scatter: BboxScatterSopNode;
	blend: BlendSopNode;
	box: BoxSopNode;
	cache: CacheSopNode;
	circle: CircleSopNode;
	code: CodeSopNode;
	color: ColorSopNode;
	copy: CopySopNode;
	data: DataSopNode;
	data_url: DataUrlSopNode;
	delay: DelaySopNode;
	delete: DeleteSopNode;
	draw_range: DrawRangeSopNode;
	face: FaceSopNode;
	file: FileSopNode;
	fuse: FuseSopNode;
	height_map: HeightMapSopNode;
	hexagons: HexagonsSopNode;
	hierarchy: HierarchySopNode;
	instance: InstanceSopNode;
	jitter: JitterSopNode;
	layer: LayerSopNode;
	line: LineSopNode;
	material: MaterialSopNode;
	merge: MergeSopNode;
	noise: NoiseSopNode;
	normals: NormalsSopNode;
	null: NullSopNode;
	object_merge: ObjectMergeSopNode;
	occlusion: OcclusionSopNode;
	particles_system_gpu: ParticlesSystemGpuSopNode;
	peak: PeakSopNode;
	physics_rbd_attributes: PhysicsRBDAttributesSopNode;
	physics_force_attributes: PhysicsForceAttributesSopNode;
	physics_rbd_solver: PhysicsRBDSolverSopNode;
	plane: PlaneSopNode;
	point: PointSopNode;
	polywire: PolywireSopNode;
	ray: RaySopNode;
	resample: ResampleSopNode;
	scatter: ScatterSopNode;
	shadows: ShadowsSopNode;
	skin: SkinSopNode;
	sphere: SphereSopNode;
	split: SplitSopNode;
	subdivide: SubdivideSopNode;
	switch: SwitchSopNode;
	text: TextSopNode;
	torus: TorusSopNode;
	torus_knot: TorusKnotSopNode;
	transform: TransformSopNode;
	transform_copy: TransformCopySopNode;
	transform_reset: TransformResetSopNode;
	tube: TubeSopNode;
	uv_project: UvProjectSopNode;
}

import {Poly} from '../../../Poly';
export class SopRegister {
	static run(poly: Poly) {
		poly.register_node(AddSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(AnimationCopySopNode, CATEGORY_SOP.ANIMATION);
		poly.register_node(AnimationMixerSopNode, CATEGORY_SOP.ANIMATION);
		poly.register_node(AttribAddMultSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribCopySopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribCreateSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribDeleteSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribNormalizeSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribPromoteSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribRemapSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribRenameSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribTransferSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(BboxScatterSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(BlendSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(BoxSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(CacheSopNode, CATEGORY_SOP.MISC);
		poly.register_node(CodeSopNode, CATEGORY_SOP.ADVANCED);
		poly.register_node(CircleSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(ColorSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(ConeSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(CopySopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(DataSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(DataUrlSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(DelaySopNode, CATEGORY_SOP.MISC);
		poly.register_node(DeleteSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(DrawRangeSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(FaceSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(FileSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(FuseSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(HexagonsSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(HeightMapSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(HierarchySopNode, CATEGORY_SOP.MISC);
		poly.register_node(InstanceSopNode, CATEGORY_SOP.RENDER);
		poly.register_node(JitterSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(LayerSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(LineSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(MaterialSopNode, CATEGORY_SOP.RENDER);
		poly.register_node(MergeSopNode, CATEGORY_SOP.MISC);
		poly.register_node(NoiseSopNode, CATEGORY_SOP.MISC);
		poly.register_node(NormalsSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(NullSopNode, CATEGORY_SOP.MISC);
		poly.register_node(ObjectMergeSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(OcclusionSopNode, CATEGORY_SOP.RENDER);
		poly.register_node(ParticlesSystemGpuSopNode, CATEGORY_SOP.DYNAMICS);
		poly.register_node(PeakSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(PhysicsRBDAttributesSopNode, CATEGORY_SOP.PHYSICS);
		poly.register_node(PhysicsForceAttributesSopNode, CATEGORY_SOP.PHYSICS);
		poly.register_node(PhysicsRBDSolverSopNode, CATEGORY_SOP.PHYSICS);
		poly.register_node(PlaneSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(PointSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(PolywireSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(RaySopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(ResampleSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(ScatterSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(SkinSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(ShadowsSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(SphereSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(SplitSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(SubdivideSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(SwitchSopNode, CATEGORY_SOP.MISC);
		poly.register_node(TextSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(TorusSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(TorusKnotSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(TransformSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(TransformCopySopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(TransformResetSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(TubeSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(UvProjectSopNode, CATEGORY_SOP.MODIFIER);
	}
}
