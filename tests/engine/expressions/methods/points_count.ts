QUnit.test('expression points_count works with path', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const box2 = geo1.create_node('box');

	box2.p.size.set(`points_count('../${box1.name}')`);

	await box2.p.size.compute();
	assert.equal(box2.p.size.value, 24);
});

QUnit.test('expression points_count works with input index', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const box2 = geo1.create_node('box');

	box2.set_input(0, box1);

	box2.p.size.set('points_count(0)');

	await box2.p.size.compute();
	assert.equal(box2.p.size.value, 24);
});

QUnit.test('expression points_count updates when dependency changes', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const box2 = geo1.create_node('box');

	box1.p.divisions.set(1);

	box2.p.size.set("points_count('../box1')");

	await box2.p.size.compute();
	assert.equal(box2.p.size.value, 24);

	assert.ok(!box2.p.size.is_dirty);
	await box2.request_container();
	assert.ok(!box2.is_dirty, 'box is dirty');

	// check that bbox2 is set to dirty if box1 changes
	box1.p.divisions.set(2);
	assert.ok(box2.p.size.is_dirty);
	assert.ok(box2.is_dirty);

	await box2.p.size.compute();
	assert.equal(box2.p.size.value, 54);

	// check that bbox2 is NOT set to dirty if box1 changes after the expression is removed
	assert.equal(box1.graph_successors().length, 2, 'successors');
	box2.p.size.set('1+1');
	assert.ok(box2.is_dirty);
	await box2.request_container();
	assert.ok(!box2.is_dirty);
	box1.p.divisions.set(3);

	assert.equal(box1.graph_successors().length, 1);

	assert.ok(!box2.is_dirty);
});

QUnit.skip('expression points_count cannot create infinite loop if scene is loaded', async (assert) => {
	// const geo1 = window.geo1
	// window.scene.mark_as_loaded();
	// const box1 = geo1.create_node('box');
	// const box2 = geo1.create_node('box');
	// box1.p.divisions.set(1);
	// box2.p.size.set("points_count('../box1')");
	// box2.request_container_p().then(() => {
	// 	assert.notOk(b.error_message());
	// 	box1.p.size.set("points_count('../box2')");
	// 	box1.p.size.compute().then(val=> {
	// 		console.logx1.p.size.error_message(), val);
	// 		assert.equal(box1.p.size.error_message(), "expression points_count error: cannot create infinite graph");
	// 		console.log("THIS DOES NOT RETURN, because the points_cloud method fails to connect to the node, as the graph is then cyclic. and the throw call fucks up somewhere in the callbacks...")
	// 		box1.request_container_p().then(() => {
	// 			assert.equal(box1.error_message(), "param 'size' error: expression points_count error: cannot create infinite graph");
	// 			done()
	// 		});
	// 	});
	// });
	//done();
});

QUnit.test('expression points_count fails with bad path', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const box2 = geo1.create_node('box');

	box2.set_input(0, box1);

	box2.p.size.set("points_count('../doesnotexist')");

	await box2.p.size.compute();
	assert.ok(!box2.states.error.active);
	await box2.request_container();
	assert.equal(
		box2.states.error.message,
		"param 'size' error: expression error: \"points_count('../doesnotexist')\" (invalid input (../doesnotexist))"
	);
});

QUnit.test('expression points_count fails with bad input index 1', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const box2 = geo1.create_node('box');

	box2.set_input(0, box1);

	box2.p.size.set('points_count(1)');

	await box2.p.size.compute();
	assert.ok(!box2.states.error.active);
	await box2.request_container();
	assert.equal(
		box2.states.error.message,
		'param \'size\' error: expression error: "points_count(1)" (invalid input (1))'
	);
});

QUnit.test('expression points_count fails with bad input index 0', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const box2 = geo1.create_node('box');

	box2.p.size.set('points_count(0)');

	await box2.p.size.compute();
	assert.equal(box2.p.size.value, 1);
	assert.equal(box2.p.size.states.error.message, 'expression error: "points_count(0)" (invalid input (0))');
	assert.ok(!box2.states.error.active);
	await box2.request_container();
	assert.equal(
		box2.states.error.message,
		'param \'size\' error: expression error: "points_count(0)" (invalid input (0))'
	);

	box2.set_input(0, box1);

	await box2.p.size.compute();
	assert.equal(box2.p.size.value, 24);
	assert.ok(!box2.p.size.states.error.message);
	assert.ok(box2.states.error.active);
	await box2.request_container();
	assert.ok(!box2.p.size.states.error.message);
});

// box1 = geo1.create_node('box')
// box2 = geo1.create_node('box')
// console.log(box1.full_path(), box2.full_path())

// box2.p.size.set("points_count(0)")

// box2.p.size.eva>
// 	assert.equal box2.p.size.error_message(), "expression points_count error: no node found for argument 0"
// 	assert !box2.is_errored()
// 	box2.request_container =>
// 		assert.equal box2.error_message(), "param 'size' error: expression points_count error: no node found for argument 0"

// 		console.log("==========")
// 		box2.set_input(0, box1)

// 		box2.p.size.eval =>

// 			assert.notOk box2.p.size.error_message()
// 			assert.equal box2.error_message(), "param 'size' error: expression points_count error: no node found for argument 0"

// 			box2.request_container (container)=>
// 				console.log(container)
// 				console.log(box2.error_message())
// 				assert.notOk box2.error_message()

// 				done()

QUnit.test('if dependent is deleted, node becomes dirty', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const box2 = geo1.create_node('box');

	box2.p.size.set("points_count('../box1')");

	await box2.p.size.compute();
	assert.equal(box2.p.size.value, 24);

	assert.ok(!box2.p.size.is_dirty);
	await box2.request_container();
	assert.ok(!box2.is_dirty);

	assert.equal(box2.p.size.graph_all_predecessors().length, 9);
	assert.equal(box2.p.size.graph_predecessors().length, 1);
	assert.equal(box2.p.size.graph_predecessors()[0].name, 'box1');

	geo1.remove_node(box1);
	assert.ok(box2.p.size.is_dirty);
	assert.ok(box2.is_dirty);

	assert.equal(box2.p.size.graph_all_predecessors().length, 0);
	assert.equal(box2.p.size.graph_predecessors().length, 0);

	await box2.p.size.compute();
	assert.null(box2.p.size.value);

	// assert !box2.p.size.is_dirty
	// box2.request_container =>
	// 	assert !box2.is_dirty

	//  	# test if the expression can reconnect by itself
	// 	geo1.add_node(box1)
	// 	assert box2.p.size.is_dirty
	// 	#assert box2.is_dirty

	// 	box2.p.size.eval (val)=>
	// 		assert.equal val, 24
});

QUnit.test('if the points count of input changes, the param gets updated', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const box2 = geo1.create_node('box');

	box2.p.size.set('points_count(0)');

	box2.set_input(0, box1);

	await box2.p.size.compute();
	assert.equal(box2.p.size.value, 24);

	box1.p.divisions.set(2);
	box2.p.size.compute();
	assert.equal(box2.p.size.value, 54);

	box1.p.divisions.set(3);
	box2.p.size.compute();
	assert.equal(box2.p.size.value, 96);
});
