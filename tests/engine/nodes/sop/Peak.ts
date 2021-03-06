QUnit.test('peak simple', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const peak1 = geo1.create_node('peak');

	peak1.set_input(0, box1);

	let container, size;

	container = await peak1.request_container();
	size = container.size().toArray();
	assert.equal(size[0], 3);
	assert.equal(size[1], 3);
	assert.equal(size[2], 3);

	peak1.p.amount.set(0.5);
	container = await peak1.request_container();
	size = container.size().toArray();
	assert.equal(size[0], 2);
	assert.equal(size[1], 2);
	assert.equal(size[2], 2);
});
