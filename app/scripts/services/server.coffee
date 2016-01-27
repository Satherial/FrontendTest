define [
  'angular'
  'resource'
], (angular) ->
  'use strict'
  svc = angular.module('server', [ 'ngResource' ])
  svc.factory 'server', [
    '$resource'
    ($resource) ->
      autocompletePath = 'https://prontopro.getsandbox.com/autocomplete'
      {
        autocomplete: $resource(autocompletePath, {}, get:
          method: 'GET'
          isArray: true)
        submission: (path) ->
          $resource path, {}, get:
            method: 'GET'
            isArray: true

      }
  ]
  return
