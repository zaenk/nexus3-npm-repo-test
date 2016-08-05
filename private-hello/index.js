'use strict'

function hello(name) {
	return 'Hello ' + (name ? name : 'world') + '!';
}

exports.hello = hello;
