import {BaseNetworkSopNode} from './_Base';
import {NodeContext, NetworkNodeType} from '../../poly/NodeContext';
import {AnimNodeChildrenMap} from '../../poly/registers/nodes/Anim';
import {BaseAnimNodeType} from '../anim/_Base';

export class AnimationsSopNode extends BaseNetworkSopNode {
	static type() {
		return NetworkNodeType.ANIM;
	}

	protected _children_controller_context = NodeContext.ANIM;

	create_node<K extends keyof AnimNodeChildrenMap>(type: K): AnimNodeChildrenMap[K] {
		return super.create_node(type) as AnimNodeChildrenMap[K];
	}
	children() {
		return super.children() as BaseAnimNodeType[];
	}
	nodes_by_type<K extends keyof AnimNodeChildrenMap>(type: K): AnimNodeChildrenMap[K][] {
		return super.nodes_by_type(type) as AnimNodeChildrenMap[K][];
	}
}