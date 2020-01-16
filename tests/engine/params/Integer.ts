QUnit.test('int eval correctly when set to different values', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const param = box1.p.divisions;

	param.set(2);
	await param.compute();
	assert.equal(param.value, 2);

	param.set_expression('2+1');
	await param.compute();
	assert.equal(param.value, 3);

	param.set_expression('(2+1) * 0.5');
	await param.compute();
	assert.equal(param.value, 2);
});
