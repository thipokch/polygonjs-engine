import {SceneJsonExporter} from '../../../../src/engine/io/json/export/Scene';
import {SceneJsonImporter} from '../../../../src/engine/io/json/import/Scene';
import {SwitchSopNode} from '../../../../src/engine/nodes/sop/Switch';
import {CoreSleep} from '../../../../src/core/Sleep';

QUnit.test('event set_param simple', async (assert) => {
	const geo1 = window.geo1;
	const scene = window.scene;

	const box1 = geo1.create_node('box');
	const sphere1 = geo1.create_node('sphere');
	const switch1 = geo1.create_node('switch');
	switch1.set_input(0, box1);
	switch1.set_input(1, sphere1);

	await scene.wait_for_cooks_completed();

	switch1.p.input.set(0);
	let container = await switch1.request_container();
	assert.equal(container.points_count(), 24);

	const events1 = scene.root.create_node('events');
	const set_param1 = events1.create_node('set_param');
	set_param1.p.param.set(switch1.p.input.full_path());
	await set_param1.p.param.compute();
	set_param1.p.number.set(1);

	// manual trigger
	await set_param1.p.execute.press_button();
	await CoreSleep.sleep(100);
	assert.equal(switch1.pv.input, 1, 'switch input is set to 1');
	container = await switch1.request_container();
	assert.equal(container.points_count(), 961);

	set_param1.p.number.set(0);
	await set_param1.p.execute.press_button();
	await CoreSleep.sleep(100);
	assert.equal(switch1.pv.input, 0, 'switch input is set to 0');
	container = await switch1.request_container();
	assert.equal(container.points_count(), 24);

	// then setup on scene load
	set_param1.p.number.set(1);
	switch1.p.input.set(0); // make sure to save with input as 0
	const scene1 = events1.create_node('scene');
	set_param1.set_input(0, scene1, 0);

	const data = new SceneJsonExporter(scene).data();
	console.log('loading...', data);
	const scene2 = await SceneJsonImporter.load_data(data);
	await scene2.wait_for_cooks_completed();

	await CoreSleep.sleep(100);

	const switch2 = scene2.node(switch1.full_path()) as SwitchSopNode;
	assert.equal(switch2.pv.input, 1);
});
