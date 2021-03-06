import {SceneJsonExporter} from '../../../../src/engine/io/json/export/Scene';
import {SceneJsonImporter} from '../../../../src/engine/io/json/import/Scene';
import {PointSopNode} from '../../../../src/engine/nodes/sop/Point';

QUnit.test('expression points works with path', async (assert) => {
	const geo1 = window.geo1;

	const plane1 = geo1.create_node('plane');
	const attrib_create1 = geo1.create_node('attrib_create');
	const attrib_create2 = geo1.create_node('attrib_create');

	attrib_create1.set_input(0, plane1);
	attrib_create2.set_input(0, attrib_create1);

	attrib_create1.p.name.set('h');
	attrib_create1.p.value1.set('@ptnum');

	attrib_create2.p.name.set('t');
	attrib_create2.p.value1.set('point("../attrib_create1", "h", 2)');

	const container = await attrib_create2.request_container();
	const array = container.core_content()!.objects_with_geo()[0].geometry.attributes['t'].array as number[];
	assert.deepEqual(array.join(','), [2, 2, 2, 2].join(','));
});

QUnit.test('expression points works with input index', async (assert) => {
	const geo1 = window.geo1;

	const plane1 = geo1.create_node('plane');
	const attrib_create1 = geo1.create_node('attrib_create');
	const attrib_create2 = geo1.create_node('attrib_create');

	attrib_create1.set_input(0, plane1);
	attrib_create2.set_input(0, attrib_create1);

	attrib_create1.p.name.set('h');
	attrib_create1.p.value1.set('@ptnum');

	attrib_create2.p.name.set('t');
	attrib_create2.p.value1.set('point(0, "h", 2)');

	const container = await attrib_create2.request_container();
	const array = container.core_content()!.objects_with_geo()[0].geometry.attributes['t'].array as number[];
	assert.deepEqual(array.join(','), [2, 2, 2, 2].join(','));
});

QUnit.test('expression points works in a point sop on scene load', async (assert) => {
	const geo1 = window.geo1;
	const scene = window.scene;

	const line1 = geo1.create_node('line');
	const point1 = geo1.create_node('point');

	point1.set_input(0, line1);

	point1.p.update_y.set(1);
	point1.p.y.set("(point(0, 'P', 0).y + point(0, 'P', 1).y) * 0.5");

	let container = await point1.request_container();
	assert.notOk(point1.states.error.active);
	let geometry = container.core_content()!.objects_with_geo()[0].geometry;
	let positions = geometry.getAttribute('position').array as number[];
	assert.deepEqual(positions.join(','), [0, 0.5, 0, 0, 0.5, 0].join(','));

	const data = new SceneJsonExporter(scene).data();

	console.log('************ LOAD **************');
	const scene2 = await SceneJsonImporter.load_data(data);
	await scene2.wait_for_cooks_completed();
	const point2 = scene2.node(point1.full_path()) as PointSopNode;
	console.log('loaded point2');
	container = await point2.request_container();
	console.log('container', container);
	assert.notOk(point2.states.error.active);
	geometry = container.core_content()!.objects_with_geo()[0].geometry;
	positions = geometry.getAttribute('position').array as number[];
	assert.deepEqual(positions.join(','), [0, 0.5, 0, 0, 0.5, 0].join(','));
});
