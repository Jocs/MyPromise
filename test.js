var promise = new MyPromise(function ( resolve, reject , notify) {
	var progress = 0, timer;
	timer = setInterval(function () {
		notify(progress);
		progress = progress + 10;
		if( progress > 100 ) {
			reject('eeeee');
			clearInterval(timer);
			progress = 0;
		}
	} , 50);
});
promise.then(function( data ){
	console.log(data);
	return data + 'aaddd1';
}, undefined, function( progress ) {
	console.log('当前进度：' + progress + '%');
})
.then(function ( data ) {
	console.log( data );
	return data + 'add33333';
})
.catch(function(error){
	console.log(error);
});