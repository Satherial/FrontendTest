define [
  'jquery'
  'widgets/body'
], ($, body) ->

  homeController = (server) ->
    body.present server
    return

  'use strict'
  homeController.$inject = [ 'server' ]
  homeController
