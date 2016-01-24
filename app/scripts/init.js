define([
	'angular',
	'home',
	'inesistente',
	'statico',
	'router',
	'services/server',
	'jquery',
	'route',
	'resource',
	'stream',
	'bootstrap'
], function(angular, home, inesistente, statico, router) {
	'use strict';

	var app = angular.module('prontopro', ['ngResource', 'ngRoute', 'server']);
	app.config(router);
	app.controller('staticController', ['$scope', '$location', 'server', statico]);
	app.controller('paginaInesistenteController', inesistente);
  app.controller('homeController', ['server', home]);
})
});
