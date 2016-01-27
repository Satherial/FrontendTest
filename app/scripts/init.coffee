define [
  'angular'
  'home'
  'inesistente'
  'statico'
  'router'
  'services/server'
  'jquery'
  'route'
  'resource'
  'stream'
  'bootstrap'
], (angular, home, inesistente, statico, router) ->
  'use strict'
  app = angular.module('prontopro', [
    'ngResource'
    'ngRoute'
    'server'
  ])
  app.config router
  app.controller 'staticController', [
    '$scope'
    '$location'
    'server'
    statico
  ]
  app.controller 'paginaInesistenteController', inesistente
  app.controller 'homeController', [
    'server'
    home
  ]
  return
