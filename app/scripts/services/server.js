define([
  'angular',
  'resource'
],function(angular){
    'use strict';

    var svc = angular.module('server',['ngResource']);
    var customPath = '';

    svc.factory('server', ['$resource', function($resource){
      var autocompletePath = 'http://prontoproit.github.io/FrontendTest/autocomplete'
      return {
        autocomplete: $resource(autocompletePath, {callback: 'JSON_CALLBACK'}, {get: {method: 'JSONP', isArray: true} }),
        submission: $resource(customPath, {callback: 'JSON_CALLBACK'}, {get: {method: 'JSONP', isArray: true} })
      };
      }
    ]);

});
