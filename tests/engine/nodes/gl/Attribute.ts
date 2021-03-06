import {GlConnectionPointType} from '../../../../src/engine/nodes/utils/io/connections/Gl';
import {SceneJsonExporter} from '../../../../src/engine/io/json/export/Scene';
import {SceneJsonImporter} from '../../../../src/engine/io/json/import/Scene';

QUnit.test('gl attribute updates its output type correctly when created', async (assert) => {
	const MAT = window.MAT;
	const material_basic_builder1 = MAT.create_node('mesh_basic_builder');
	assert.equal(material_basic_builder1.children().length, 2);

	const attribute1 = material_basic_builder1.create_node('attribute');
	assert.equal(attribute1.pv.name, 'attribute1');

	assert.equal(attribute1.io.outputs.named_output_connection_points.length, 1);
	assert.equal(attribute1.io.outputs.named_output_connection_points[0].type, GlConnectionPointType.FLOAT);

	attribute1.p.type.set(attribute1.pv.type + 1);
	assert.equal(attribute1.io.outputs.named_output_connection_points.length, 1);
	assert.equal(attribute1.io.outputs.named_output_connection_points[0].type, GlConnectionPointType.VEC2);
});

QUnit.test('gl attribute updates its output type correctly when scene is loaded', async (assert) => {
	const scene = window.scene;
	const MAT = window.MAT;
	const material_basic_builder1 = MAT.create_node('mesh_basic_builder');

	const attribute1 = material_basic_builder1.create_node('attribute');
	assert.equal(attribute1.pv.type, 0);
	attribute1.p.type.set(attribute1.pv.type + 1);
	assert.equal(attribute1.pv.type, 1);

	const data = new SceneJsonExporter(scene).data();
	const scene2 = await SceneJsonImporter.load_data(data);
	await scene2.wait_for_cooks_completed();

	const material_basic_builder2 = scene.node('/MAT/mesh_basic_builder1')!;
	assert.ok(material_basic_builder2);
	assert.equal(material_basic_builder2.children().length, 3, 'new mat has 3 children');
	const attribute2 = material_basic_builder1.node('attribute1')!;
	assert.ok(attribute2);
	assert.equal(attribute2.pv.type, 1);
	assert.equal(attribute1.io.outputs.named_output_connection_points.length, 1);
	assert.equal(attribute1.io.outputs.named_output_connection_points[0].type, GlConnectionPointType.VEC2);
});

QUnit.skip(
	'gl attribute is changed, then the shader is updated correctly, without double definition',
	async (assert) => {}
);
