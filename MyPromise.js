
var MyPromise = (function() {

	var MyPromise = function MyPromise( fn ) {
	/**
	 * [self 把this对象保存在self变量中，便于闭包引用和bind方法调用]
	 * @type {[Object]}
	 */
	 var self = this;
	 this.state = 'pending';
	 this.data = undefined;
	 this.progress = undefined;
	 this.settledValue = undefined;
	 this.successFn = [];
	 this.errorFn = [];
	 this.progressFn = [];
	/**
	 * [该方法用来resolve一个promise，使得promise对象的状态变为resolved，同时如果resolve函数
	 * 传入参数，把参数值保存到promise对象的data属性上]
	 * @param  {[String,Object,Boolean,Number...]} data [任意数据类型]
	 * @return {[undefined]}      [没有返回值]
	 */
	 function resolve(data) {
	 	this.data = data;
	 	this.state = 'resolved';
	 }
	/**
	 * [reject 该方法用来reject一个promise对象，使得该对象的状态转变为rejected，同时如果reject
	 * 函数中有参数，就把参数数值保存到promise的data属性上]
	 * @param  {[Any Type]} error [Any Type]
	 * @return {[undefined]}       [undefined]
	 */
	 function reject(error) {
	 	this.data = error;
	 	this.state = 'rejected';
	 }
	/**
	 * [notify 不改变promise对象的状态，但是调用该方法且该方法传入参数，会改变promise对象的progress值
	 * then方法第三个参数函数能够监控到这一变化]
	 * @param  {[Any Type]} progress [Any Type]
	 * @return {[undefined]}          [undefined]
	 */
	 function notify( progress ) {
	 	this.state = 'pending';
	 	this.progress = progress;
	 }
	/**
	 * 通过new 操作符调用该MyPromise构造函数时，调用fn方法。并把上面三个方法传入fn.
	 */
	 fn(resolve.bind( self ), reject.bind( self ), notify.bind( self ));
	/**
	 * [observer Object.observe的监控函数]
	 * @param  {[Array]} changes [变化数组]
	 * @return {[undefined]}   [undefined]
	 */
	 var observer = function ( changes ) {
	 	changes.forEach( function ( change ) {
	 		if(/^state$/.test( change.name )) {

	 			if(self.state === 'resolved' ) {
	 				if(self.successFn.length == 0 ) self.settledValue = self.data;
	 				self.successFn.forEach(function( fn ) {
	 					var value = fn(self.data);
	 					self.settledValue = value;
	 				})
	 			} else if( self.state === 'rejected' ) {
	 				if(self.errorFn.length == 0) self.settledValue = self.data;
	 				self.errorFn.forEach( function( fn ) {
	 					var value = fn(self.data);
	 					self.settledValue = value;
	 				});
	 			}

	 			//Object.unobserve(self, observer);
	 		} 
	 		if( /^progress$/.test( change.name )) {
	 			if( self.progressFn.length !== 0 ){
	 				self.progressFn.forEach( function (fn) {
	 					fn( self.progress );
	 				});
	 			}
	 		}
	 	});
	 }
	/**
	 * [调用ECMAScript2016 中的Object.observe方法监控promise对象的变化]                                                             
	 */
	 Object.observe(self, observer);
	}
/**
 * [prototype MyPromise 原型对象]
 * @type {Object}
 */
 function isFunction ( fn ) {
 	return ~(Object.prototype.toString.call( fn ).indexOf('Function'));
 } 
 MyPromise.prototype = {
 	constructor : MyPromise,

 	then : function(successFn, errorFn, progressFn) {
 		var self = this;
 		if( isFunction(successFn ) ){
 			this.successFn.push(successFn);
 		}
 		if( isFunction( errorFn ) ){
 			this.errorFn.push(errorFn);
 		}
 		if( isFunction( progressFn ) ){
 			this.progressFn.push(progressFn);
 		}
 		if(successFn === undefined && errorFn === undefined ) return this;

 		return new MyPromise(function (resolve, reject, notify) {
 			
 			Object.observe(self, function (changes) {
	 			changes.forEach(function (change) {
	 				if(change.name === 'data' && self.state == 'resolved'){
	 					resolve(self.settledValue);
	 				} 
	 					
	 				if(change.name === 'data' && self.state == 'rejected') {
	 					reject(self.settledValue);
	 				}
	 			});
	 		});
 		});
 	}, 
 	/**
 	 * [catch this part need to be checked]
 	 * @param  {[type]} errorFn [description]
 	 * @return {[type]}         [description]
 	 */
 	catch: function ( errorFn ) {
 		this.then(undefined, errorFn, undefined);
 		return this;
 	}
 };
/**
 * [MyPromise property and method]
 */
 MyPromise.length = 1;














 return MyPromise;
})();