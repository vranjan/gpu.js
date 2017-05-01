// Test precompiled mode
function precompileTest( assert, inMode ) {
	// The kernel function to use
	var kFunc = function kernelFunction(A) {
		var res = A[this.thread.x];
		for(var i=1; i < 5000; ++i) {
			res = (res*i)/((res-1)*i);
		}
		return res;
	};

	// Gpu test instance
	var g = new GPU();

	// Create the sample kernel
	var sampleK = g.createKernel(kFunc).dimensions([5000]);

	// Get sample args
	var sampleArgs = [];
	for(var i=0; i<5000; ++i) {
		sampleArgs[i] = i;
	}

	// Precompiled output
	var precompille = sampleK.outputPrecompiledKernel(["Array"]);

	// Get the sample result
	var baseResult = g.createKernel(kFunc, { mode : inMode }).dimensions([5000])(sampleArgs);

	// Prebuilt GPU.JS mode
	var prebuiltKernel = PrecompiledGPU(precompille, { mode : inMode });
	var prebuiltResult = prebuiltKernel(sampleArgs);

	// Assert equality
	assert.deepEqual( baseResult, prebuiltResult );
}

QUnit.test( "precompiled (auto)", function( assert ) {
	precompileTest(assert, null);
});

QUnit.test( "precompiled (GPU)", function( assert ) {
	precompileTest(assert, "gpu");
});

QUnit.test( "precompiled (CPU)", function( assert ) {
	precompileTest(assert, "cpu");
});
