import {SceneJsonImporter} from '../../../src/engine/io/json/import/Scene';
import {SceneJsonExporter} from '../../../src/engine/io/json/export/Scene';
import {Poly} from '../../../src/engine/Poly';
import {BoxSopNode} from '../../../src/engine/nodes/sop/Box';
import {OperationsComposerSopNode} from '../../../src/engine/nodes/sop/OperationsComposer';
import {TransformSopNode} from '../../../src/engine/nodes/sop/Transform';

QUnit.test('scene can be imported with a single optimized node', async (assert) => {
	const scene = window.scene;
	const geo1 = window.geo1;
	const box1 = geo1.create_node('box');
	box1.flags.optimize.set(true);

	const data = new SceneJsonExporter(scene).data();

	Poly.instance().set_player_mode(false);
	const scene_no_player = await SceneJsonImporter.load_data(data);

	Poly.instance().set_player_mode(true);
	const scene_player = await SceneJsonImporter.load_data(data);
	assert.equal(scene_player.graph.next_id(), scene_no_player.graph.next_id() - 8);
	assert.equal(scene_player.nodes_controller.all_nodes().length, scene_no_player.nodes_controller.all_nodes().length);

	const box1_player = scene_player.node(box1.full_path()) as BoxSopNode;
	assert.equal(box1_player.type, OperationsComposerSopNode.type());

	let container = await box1_player.request_container();
	const core_group = container.core_content();
	const geometry = core_group?.objects_with_geo()[0].geometry;
	assert.equal(geometry?.getAttribute('position').array.length, 72);
});

QUnit.test('scene can be imported with a 2 optimized nodes plugged into each other', async (assert) => {
	const scene = window.scene;
	const geo1 = window.geo1;
	const box1 = geo1.create_node('box');
	const transform1 = geo1.create_node('transform');
	transform1.set_input(0, box1);
	box1.flags.optimize.set(true);
	transform1.flags.optimize.set(true);
	transform1.flags.display.set(true);

	const data = new SceneJsonExporter(scene).data();

	Poly.instance().set_player_mode(false);
	const scene_no_player = await SceneJsonImporter.load_data(data);

	Poly.instance().set_player_mode(true);
	const scene_player = await SceneJsonImporter.load_data(data);
	assert.equal(scene_player.graph.next_id(), scene_no_player.graph.next_id() - 33);
	assert.equal(
		scene_player.nodes_controller.all_nodes().length,
		scene_no_player.nodes_controller.all_nodes().length - 1
	);

	const transform1_player = scene_player.node(transform1.full_path()) as TransformSopNode;
	assert.equal(transform1_player.type, OperationsComposerSopNode.type());

	let container = await transform1_player.request_container();
	const core_group = container.core_content();
	const geometry = core_group?.objects_with_geo()[0].geometry;
	assert.equal(geometry?.getAttribute('position').array.length, 72);
});

QUnit.test(
	'scene can be imported with a multiple optimized nodes creating a node with multiple inputs',
	async (assert) => {
		const scene = window.scene;
		const geo1 = window.geo1;
		const box1 = geo1.create_node('box');
		const sphere1 = geo1.create_node('sphere');
		const add1 = geo1.create_node('add');
		const jitter1 = geo1.create_node('jitter');
		const transform1 = geo1.create_node('transform');
		const transform2 = geo1.create_node('transform');
		const merge1 = geo1.create_node('merge');
		const merge2 = geo1.create_node('merge');
		transform1.set_input(0, box1);
		jitter1.set_input(0, transform1);
		transform2.set_input(0, sphere1);
		merge1.set_input(0, jitter1);
		merge1.set_input(1, transform2);
		merge2.set_input(0, merge1);
		merge2.set_input(1, add1);
		merge2.flags.display.set(true);

		transform1.flags.optimize.set(true);
		transform2.flags.optimize.set(true);
		jitter1.flags.optimize.set(true);
		merge1.flags.optimize.set(true);
		merge2.flags.optimize.set(true);

		const data = new SceneJsonExporter(scene).data();

		Poly.instance().set_player_mode(false);
		const scene_no_player = await SceneJsonImporter.load_data(data);

		Poly.instance().set_player_mode(true);
		const scene_player = await SceneJsonImporter.load_data(data);
		assert.equal(scene_player.graph.next_id(), scene_no_player.graph.next_id() - 68);
		assert.equal(
			scene_player.nodes_controller.all_nodes().length,
			scene_no_player.nodes_controller.all_nodes().length - 4
		);

		const merge2_player = scene_player.node(merge2.full_path()) as TransformSopNode;
		assert.equal(merge2_player.type, OperationsComposerSopNode.type());

		let container = await merge2_player.request_container();
		const core_group = container.core_content();
		const geometry = core_group?.objects_with_geo()[0].geometry;
		assert.equal(geometry?.getAttribute('position').array.length, 2955);
	}
);
