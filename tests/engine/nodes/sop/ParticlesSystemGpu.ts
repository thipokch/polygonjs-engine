import {RendererUtils} from '../../../helpers/RendererUtils';
import {ShaderName} from '../../../../src/engine/nodes/utils/shaders/ShaderName';
import {AttribClass} from '../../../../src/core/geometry/Constant';
import {GlConnectionPointType} from '../../../../src/engine/nodes/utils/io/connections/Gl';
import {SceneJsonExporter} from '../../../../src/engine/io/json/export/Scene';
import {AssemblersUtils} from '../../../helpers/AssemblersUtils';
import {SceneJsonImporter} from '../../../../src/engine/io/json/import/Scene';
import {ParticlesSystemGpuSopNode} from '../../../../src/engine/nodes/sop/ParticlesSystemGpu';
import {Vector3Param} from '../../../../src/engine/params/Vector3';
import {AssertUtils} from '../../../helpers/AssertUtils';

QUnit.test('ParticlesSystemGPU simple', async (assert) => {
	const geo1 = window.geo1;
	const scene = window.scene;

	await scene.wait_for_cooks_completed();
	const {renderer} = await RendererUtils.wait_for_renderer();
	assert.ok(renderer, 'renderer created');

	const plane1 = geo1.create_node('plane');
	const delete1 = geo1.create_node('delete');
	const particles1 = geo1.create_node('particles_system_gpu');
	const output1 = particles1.nodes_by_type('output')[0];
	const globals1 = particles1.nodes_by_type('globals')[0];
	const add1 = particles1.create_node('add');
	add1.set_input(0, globals1, 'position');
	output1.set_input('position', add1);
	add1.params.get('add1')!.set([0, 1, 0]);

	plane1.p.size.set([2, 2]);
	plane1.p.use_segments_count.set(1);
	delete1.set_class(AttribClass.OBJECT);
	delete1.p.by_expression.set(1);
	delete1.p.keep_points.set(1);
	delete1.set_input(0, plane1);
	particles1.set_input(0, delete1);

	scene.set_frame(1);
	await particles1.request_container();
	const render_material = particles1.render_controller.render_material()!;
	const uniform = render_material.uniforms.texture_particles_0;
	assert.ok(render_material, 'material ok');
	assert.ok(uniform, 'uniform ok');

	const buffer_width = 1;
	const buffer_height = 1;
	let render_target1 = particles1.gpu_controller.getCurrentRenderTarget(ShaderName.PARTICLES_0)!;
	assert.equal(uniform.value.uuid, render_target1.texture.uuid, 'uniform has expected texture');
	let pixelBuffer = new Float32Array(buffer_width * buffer_height * 4);
	renderer.readRenderTargetPixels(render_target1, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [-1, 1, -1, 0].join(':'), 'point moved up');

	scene.set_frame(2);
	let render_target2 = particles1.gpu_controller.getCurrentRenderTarget(ShaderName.PARTICLES_0)!;
	assert.notEqual(render_target2.texture.uuid, render_target1.texture.uuid);
	assert.equal(uniform.value.uuid, render_target2.texture.uuid, 'uniform has expected texture');
	renderer.readRenderTargetPixels(render_target2, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [-1, 2, -1, 0].join(':'), 'point moved up');

	scene.set_frame(3);
	assert.equal(uniform.value.uuid, render_target1.texture.uuid, 'uniform has expected texture');
	renderer.readRenderTargetPixels(render_target1, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [-1, 3, -1, 0].join(':'), 'point moved up');

	scene.set_frame(4);
	assert.equal(uniform.value.uuid, render_target2.texture.uuid, 'uniform has expected texture');
	renderer.readRenderTargetPixels(render_target2, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [-1, 4, -1, 0].join(':'), 'point moved up');

	RendererUtils.dispose();
});

QUnit.test('ParticlesSystemGPU with param and persisted_config', async (assert) => {
	const geo1 = window.geo1;
	const scene = window.scene;

	await scene.wait_for_cooks_completed();
	const {renderer} = await RendererUtils.wait_for_renderer();
	assert.ok(renderer, 'renderer created');

	const plane1 = geo1.create_node('plane');
	const delete1 = geo1.create_node('delete');
	const particles1 = geo1.create_node('particles_system_gpu');
	const output1 = particles1.nodes_by_type('output')[0];
	const globals1 = particles1.nodes_by_type('globals')[0];
	const add1 = particles1.create_node('add');
	const param1 = particles1.create_node('param');
	param1.set_gl_type(GlConnectionPointType.VEC3);
	param1.p.name.set('test_param');
	add1.set_input(0, globals1, 'position');
	add1.set_input(1, param1);
	output1.set_input('position', add1);

	plane1.p.size.set([2, 2]);
	plane1.p.use_segments_count.set(1);
	delete1.set_class(AttribClass.OBJECT);
	delete1.p.by_expression.set(1);
	delete1.p.keep_points.set(1);
	delete1.set_input(0, plane1);
	particles1.set_input(0, delete1);

	scene.set_frame(1);
	await particles1.request_container();
	const test_param = particles1.params.get('test_param')!;
	assert.ok(test_param, 'test_param is created');
	test_param.set([0, 1, 0]);
	particles1.p.reset.press_button();
	await particles1.request_container();

	const render_material = particles1.render_controller.render_material()!;
	const uniform = render_material.uniforms.texture_particles_0;
	assert.ok(render_material, 'material ok');
	assert.ok(uniform, 'uniform ok');
	const all_variables = particles1.gpu_controller.all_variables();
	assert.equal(all_variables.length, 1);
	const variable = all_variables[0];
	console.log(variable.material.uniforms);
	const param_uniform = variable.material.uniforms.v_POLY_param1_val;
	assert.deepEqual(param_uniform.value.toArray(), [0, 1, 0], 'param uniform set to the expected value');

	const buffer_width = 1;
	const buffer_height = 1;
	let render_target1 = particles1.gpu_controller.getCurrentRenderTarget(ShaderName.PARTICLES_0)!;
	assert.equal(uniform.value.uuid, render_target1.texture.uuid, 'uniform has expected texture');
	let pixelBuffer = new Float32Array(buffer_width * buffer_height * 4);
	renderer.readRenderTargetPixels(render_target1, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [-1, 1, -1, 0].join(':'), 'point moved up');

	scene.set_frame(2);
	let render_target2 = particles1.gpu_controller.getCurrentRenderTarget(ShaderName.PARTICLES_0)!;
	assert.notEqual(render_target2.texture.uuid, render_target1.texture.uuid);
	assert.equal(uniform.value.uuid, render_target2.texture.uuid, 'uniform has expected texture');
	renderer.readRenderTargetPixels(render_target2, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [-1, 2, -1, 0].join(':'), 'point moved up');

	scene.set_frame(3);
	assert.equal(uniform.value.uuid, render_target1.texture.uuid, 'uniform has expected texture');
	renderer.readRenderTargetPixels(render_target1, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [-1, 3, -1, 0].join(':'), 'point moved up');

	test_param.set([0, 0.5, 0]);
	scene.set_frame(4);
	assert.equal(uniform.value.uuid, render_target2.texture.uuid, 'uniform has expected texture');
	renderer.readRenderTargetPixels(render_target2, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [-1, 3.5, -1, 0].join(':'), 'point moved up');

	test_param.set([0, 2, 0]);
	scene.set_frame(5);
	assert.equal(uniform.value.uuid, render_target1.texture.uuid, 'uniform has expected texture');
	renderer.readRenderTargetPixels(render_target1, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [-1, 5.5, -1, 0].join(':'), 'point moved up');

	test_param.set([1, 0, 0]);
	scene.set_frame(6);
	assert.equal(uniform.value.uuid, render_target2.texture.uuid, 'uniform has expected texture');
	renderer.readRenderTargetPixels(render_target2, 0, 0, buffer_width, buffer_height, pixelBuffer);
	assert.deepEqual(pixelBuffer.join(':'), [0, 5.5, -1, 0].join(':'), 'point moved up');

	scene.set_frame(1);
	const data = new SceneJsonExporter(scene).data();
	await AssemblersUtils.with_unregistered_assembler(particles1.used_assembler(), async () => {
		console.log('************ LOAD **************');
		const scene2 = await SceneJsonImporter.load_data(data);
		await scene2.wait_for_cooks_completed();

		const new_particles1 = scene2.node('/geo1/particles_system_gpu1') as ParticlesSystemGpuSopNode;
		assert.notOk(new_particles1.assembler_controller);
		assert.ok(new_particles1.persisted_config);
		const test_param2 = new_particles1.params.get('test_param') as Vector3Param;
		assert.ok(test_param2);

		assert.deepEqual(test_param2.value.toArray(), [1, 0, 0], 'test param is read back with expected value');
		assert.equal(scene2.frame, 1);
		new_particles1.p.reset.press_button();
		await new_particles1.request_container();

		render_target1 = new_particles1.gpu_controller.getCurrentRenderTarget(ShaderName.PARTICLES_0)!;
		renderer.readRenderTargetPixels(render_target1, 0, 0, buffer_width, buffer_height, pixelBuffer);
		assert.deepEqual(
			AssertUtils.array_with_precision(pixelBuffer),
			[0, 0, -1, 0].join(':'),
			'point with persisted config moved x'
		);

		scene2.set_frame(2);
		render_target2 = new_particles1.gpu_controller.getCurrentRenderTarget(ShaderName.PARTICLES_0)!;
		renderer.readRenderTargetPixels(render_target2, 0, 0, buffer_width, buffer_height, pixelBuffer);
		assert.deepEqual(
			AssertUtils.array_with_precision(pixelBuffer),
			[1, 0, -1, 0].join(':'),
			'point with persisted config moved x'
		);

		test_param2.set([0, 2, 0]);
		scene2.set_frame(3);
		render_target1 = new_particles1.gpu_controller.getCurrentRenderTarget(ShaderName.PARTICLES_0)!;
		renderer.readRenderTargetPixels(render_target1, 0, 0, buffer_width, buffer_height, pixelBuffer);
		assert.deepEqual(
			AssertUtils.array_with_precision(pixelBuffer),
			[1, 2, -1, 0].join(':'),
			'point with persisted config moved y'
		);
	});

	RendererUtils.dispose();
});

QUnit.skip(
	'ParticlesSystemGPU spare params are created from param, ramp and texture nodes even when not connected to output',
	async (assert) => {
		assert.equal(1, 2);
	}
);
