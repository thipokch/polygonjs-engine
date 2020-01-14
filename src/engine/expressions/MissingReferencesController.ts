import {BaseNode} from 'src/engine/nodes/_Base'
import {BaseParam} from 'src/engine/params/_Base'
import {
	MissingExpressionReference,
	MissingExpressionReferenceByIdByFullPath,
} from './MissingReference'
import jsep from 'jsep'

export class MissingReferencesController {
	private references: MissingExpressionReferenceByIdByFullPath = {}
	private next_id: number = 0
	private next_id_s: string = '0'

	register(
		param: BaseParam,
		jsep_node: jsep.Expression,
		full_path: string
	): MissingExpressionReference {
		const id = this.next_id_s
		const missing_expression_reference = new MissingExpressionReference(
			param,
			jsep_node,
			full_path,
			id
		)
		this.references[full_path] = this.references[full_path] || {}
		this.references[full_path][id] = missing_expression_reference

		this.next_id += 1
		this.next_id_s = `${this.next_id}`

		return missing_expression_reference
	}
	unregister(ref: MissingExpressionReference) {
		if (this.references[ref.full_path]) {
			delete this.references[ref.full_path][ref.id]
		}
	}

	// call this from node.create and node.rename
	check_for_references(node: BaseNode) {
		const full_path = node.full_path()
		const refs = this.references[full_path]
		if (refs) {
			const ref_ids = Object.keys(refs)
			ref_ids.forEach((ref_id) => {
				const ref = refs[ref_id]
				ref.resolve_with_node(node)
			})
			delete this.references[full_path]
		}
	}
}