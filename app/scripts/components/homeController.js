define([
	'jquery',
	'widgets/body'
], function($, body) {
		'use strict';

		function homeController(server) {
			body.present(server);
		}

		homeController.$inject=['server'];

		return homeController;
});
