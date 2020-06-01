import { TypedObjNode } from './_Base';
import { Group } from 'three/src/objects/Group';
import { BaseNodeType } from '../_Base';
import { DisplayNodeController } from '../utils/DisplayNodeController';
import { NodeContext } from '../../poly/NodeContext';
import { BaseSopNodeType } from '../sop/_Base';
import { TransformController } from './utils/TransformController';
import { GeoNodeChildrenMap } from '../../poly/registers/nodes/Sop';
import { FlagsControllerD } from '../utils/FlagsController';
import { HierarchyController } from './utils/HierarchyController';
import { NodeParamsConfig } from '../utils/params/ParamsConfig';
import { ChildrenDisplayController } from './utils/ChildrenDisplayController';
declare const GeoObjParamConfig_base: {
    new (...args: any[]): {
        transform: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FOLDER>;
        rotation_order: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.INTEGER>;
        t: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.VECTOR3>;
        r: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.VECTOR3>;
        s: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.VECTOR3>;
        scale: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FLOAT>;
    };
} & typeof NodeParamsConfig;
declare class GeoObjParamConfig extends GeoObjParamConfig_base {
    display: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
}
export declare class GeoObjNode extends TypedObjNode<Group, GeoObjParamConfig> {
    params_config: GeoObjParamConfig;
    static type(): string;
    readonly hierarchy_controller: HierarchyController;
    readonly transform_controller: TransformController;
    readonly flags: FlagsControllerD;
    create_object(): Group;
    readonly children_display_controller: ChildrenDisplayController;
    readonly display_node_controller: DisplayNodeController;
    protected _children_controller_context: NodeContext;
    private _on_create_bound;
    private _on_child_add_bound;
    initialize_node(): void;
    is_display_node_cooking(): boolean;
    create_node<K extends keyof GeoNodeChildrenMap>(type: K): GeoNodeChildrenMap[K];
    children(): BaseSopNodeType[];
    nodes_by_type<K extends keyof GeoNodeChildrenMap>(type: K): GeoNodeChildrenMap[K][];
    _on_create(): void;
    _on_child_add(node: BaseNodeType): void;
    cook(): void;
}
export {};