import {CoreSleep} from '../../../src/core/Sleep';
import {SceneJsonImporter} from '../../../src/engine/io/json/import/Scene';
import {SceneJsonExporter} from '../../../src/engine/io/json/export/Scene';

QUnit.test('mouse event nodes update the viewer event listeners', async (assert) => {
	const scene = window.scene;
	await scene.wait_for_cooks_completed();
	assert.ok(!scene.loading_controller.is_loading, 'scene is loaded');

	const element = document.createElement('div');
	document.body.appendChild(element);
	const perspective_camera1 = window.perspective_camera1;
	const viewer = perspective_camera1.create_viewer(element);

	assert.deepEqual(viewer.events_controller.registered_event_types(), [], 'no events registered yet');

	const events = scene.root.create_node('events');
	const mouse1 = events.create_node('mouse');
	await mouse1.request_container();
	CoreSleep.sleep(100);

	assert.deepEqual(
		viewer.events_controller.registered_event_types(),
		['mousedown', 'mousemove', 'mouseup'],
		'3 mouse events registered'
	);

	mouse1.p.active.set(0);
	await mouse1.request_container();
	assert.deepEqual(viewer.events_controller.registered_event_types(), [], 'no events if node is set to inactive');

	mouse1.p.active.set(1);
	await mouse1.request_container();
	assert.deepEqual(
		viewer.events_controller.registered_event_types(),
		['mousedown', 'mousemove', 'mouseup'],
		'3 mouse events registered again'
	);

	// TODO: those 3 request_container should not be necessary
	mouse1.p.mousedown.set(0);
	await mouse1.request_container();
	mouse1.p.mousemove.set(0);
	await mouse1.request_container();
	mouse1.p.mouseup.set(0);
	await mouse1.request_container();
	assert.deepEqual(viewer.events_controller.registered_event_types(), [], 'no events are registered anymore');

	mouse1.p.mousedown.set(1);
	await mouse1.request_container();
	assert.deepEqual(viewer.events_controller.registered_event_types(), ['mousedown'], '1 event is registered');

	events.remove_node(mouse1);
	assert.deepEqual(viewer.events_controller.registered_event_types(), [], 'events are removed if node is removed');

	mouse1.p.active.set(1);
	await mouse1.request_container();
	assert.deepEqual(
		viewer.events_controller.registered_event_types(),
		[],
		'setting a deleted node to active does not update the register'
	);

	const mouse2 = events.create_node('mouse');
	await mouse2.request_container();
	mouse2.p.mousemove.set(0);
	await mouse2.request_container();
	mouse2.p.mouseup.set(0);
	await mouse2.request_container();
	mouse2.p.mousedown.set(1);
	await mouse2.request_container();
	mouse2.p.click.set(1);
	await mouse2.request_container();
	// creating a new viewer will set its listeners correctly as well
	const element2 = document.createElement('div');
	document.body.appendChild(element2);
	const viewer2 = perspective_camera1.create_viewer(element);
	assert.deepEqual(viewer2.events_controller.registered_event_types(), ['click', 'mousedown']);

	// clear elements
	viewer.dispose();
	viewer2.dispose();
	document.body.removeChild(element);
	document.body.removeChild(element2);
});

QUnit.test('mouse event are set correctly when saving/loading the scene', async (assert) => {
	const scene = window.scene;
	await scene.wait_for_cooks_completed();
	assert.ok(!scene.loading_controller.is_loading, 'scene is loaded');

	const element = document.createElement('div');
	document.body.appendChild(element);
	const perspective_camera1 = window.perspective_camera1;
	const viewer = perspective_camera1.create_viewer(element);

	assert.deepEqual(viewer.events_controller.registered_event_types(), [], 'no events registered yet');

	const events = scene.root.create_node('events');
	const mouse1 = events.create_node('mouse');
	await mouse1.request_container();
	CoreSleep.sleep(100);
	// TODO: those 3 request_container should not be necessary
	mouse1.p.mousedown.set(0);
	await mouse1.request_container();
	mouse1.p.mousemove.set(0);
	await mouse1.request_container();
	mouse1.p.mouseup.set(0);
	await mouse1.request_container();
	mouse1.p.click.set(1);
	await mouse1.request_container();

	assert.deepEqual(viewer.events_controller.registered_event_types(), ['click'], 'only click registered');

	const data = new SceneJsonExporter(scene).data();
	console.log('************ LOAD **************');
	const scene2 = await SceneJsonImporter.load_data(data);
	await scene2.wait_for_cooks_completed();
	const element2 = document.createElement('div');
	document.body.appendChild(element2);
	const perspective_camera2 = scene2.root.nodes_by_type('perspective_camera')[0];
	const events2 = scene2.root.nodes_by_type('events')[0];
	const mouse2 = events2.nodes_by_type('mouse')[0];
	const viewer2 = perspective_camera2.create_viewer(element);

	assert.deepEqual(
		viewer2.events_controller.registered_event_types(),
		['click'],
		'only click registered on scene reload'
	);

	mouse2.p.click.set(0);
	await mouse2.request_container();
	assert.deepEqual(viewer2.events_controller.registered_event_types(), [], 'no events registered on scene reload');
	mouse2.p.click.set(1);
	await mouse2.request_container();
	assert.deepEqual(
		viewer2.events_controller.registered_event_types(),
		['click'],
		'only click registered on scene reload again'
	);

	// clear elements
	viewer.dispose();
	viewer2.dispose();
	document.body.removeChild(element);
	document.body.removeChild(element2);
});

QUnit.test('keyboard event nodes update the viewer event listeners', async (assert) => {
	const scene = window.scene;
	await scene.wait_for_cooks_completed();
	assert.ok(!scene.loading_controller.is_loading);

	const element = document.createElement('div');
	document.body.appendChild(element);
	const perspective_camera1 = window.perspective_camera1;
	const viewer = perspective_camera1.create_viewer(element);

	assert.deepEqual(viewer.events_controller.registered_event_types(), []);

	const events = scene.root.create_node('events');
	const keyboard1 = events.create_node('keyboard');
	await keyboard1.request_container();
	assert.deepEqual(viewer.events_controller.registered_event_types(), ['keydown']);

	keyboard1.p.active.set(0);
	await keyboard1.request_container();
	assert.deepEqual(viewer.events_controller.registered_event_types(), [], 'no events if node is set to inactive');

	keyboard1.p.active.set(1);
	await keyboard1.request_container();
	assert.deepEqual(viewer.events_controller.registered_event_types(), ['keydown']);

	keyboard1.p.keydown.set(0);
	await keyboard1.request_container();
	assert.deepEqual(viewer.events_controller.registered_event_types(), []);

	keyboard1.p.keyup.set(1);
	await keyboard1.request_container();
	assert.deepEqual(viewer.events_controller.registered_event_types(), ['keyup']);

	events.remove_node(keyboard1);
	await keyboard1.request_container();
	assert.deepEqual(viewer.events_controller.registered_event_types(), []);

	keyboard1.p.active.set(1);
	await keyboard1.request_container();
	assert.deepEqual(
		viewer.events_controller.registered_event_types(),
		[],
		'setting a deleted node to active does not update the register'
	);

	const keyboard2 = events.create_node('keyboard');
	await keyboard2.request_container();
	keyboard2.p.keydown.set(0);
	await keyboard2.request_container();
	keyboard2.p.keypress.set(1);
	await keyboard2.request_container();
	// creating a new viewer will set its listeners correctly as well
	const element2 = document.createElement('div');
	document.body.appendChild(element2);
	const viewer2 = perspective_camera1.create_viewer(element);
	assert.deepEqual(viewer2.events_controller.registered_event_types(), ['keypress']);

	// clear elements
	viewer.dispose();
	viewer2.dispose();
	document.body.removeChild(element);
	document.body.removeChild(element2);
});

QUnit.test('scene event nodes do not add events to the viewer', async (assert) => {
	const scene = window.scene;
	await scene.wait_for_cooks_completed();
	assert.ok(!scene.loading_controller.is_loading);

	const element = document.createElement('div');
	document.body.appendChild(element);
	const perspective_camera1 = window.perspective_camera1;
	const viewer = perspective_camera1.create_viewer(element);

	assert.deepEqual(viewer.events_controller.registered_event_types(), []);

	const events = scene.root.create_node('events');
	const scene1 = events.create_node('scene');

	assert.deepEqual(viewer.events_controller.registered_event_types(), []);

	scene1.p.active.set(0);
	assert.deepEqual(viewer.events_controller.registered_event_types(), [], 'no events if node is set to inactive');

	scene1.p.active.set(1);
	assert.deepEqual(viewer.events_controller.registered_event_types(), []);

	scene1.p.tick.set(1);
	assert.deepEqual(viewer.events_controller.registered_event_types(), []);

	// clear elements
	viewer.dispose();
	document.body.removeChild(element);
});
