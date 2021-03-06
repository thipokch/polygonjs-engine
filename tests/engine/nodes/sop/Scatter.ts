QUnit.test('scatter simple', async (assert) => {
	const geo1 = window.geo1;

	const plane1 = geo1.create_node('plane');
	const scatter1 = geo1.create_node('scatter');

	scatter1.set_input(0, plane1);

	let container;

	container = await scatter1.request_container();
	assert.equal(container.points_count(), 100);

	scatter1.p.points_count.set(1000);
	container = await scatter1.request_container();
	assert.equal(container.points_count(), 1000);
});
