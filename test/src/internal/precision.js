QUnit.test('GPU Decimal Precision', function(assert) {
  var gpu = new GPU({mode: 'gpu'});
  var add = gpu.createKernel(function(a, b) {
    return a + b;
  }).setDimensions([1]);
  var addResult = add(0.1, 0.2)[0];
  assert.equal(addResult.toFixed(7), (0.1 + 0.2).toFixed(7));

  var reflectValue = gpu.createKernel(function(a) {
    return a;
  }).setDimensions([1]);

  //Just for sanity's sake, recurse the value to see if it spirals out of control
  for (var i = 0; i < 100; i++) {
    var newAddResult = reflectValue(addResult)[0];
    assert.equal(newAddResult, addResult);
    addResult = newAddResult;
  }
});