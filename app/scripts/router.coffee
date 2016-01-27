define [], ->

  router = ($routeProvider) ->
    $routeProvider.when('/home',
      template: '<div id="main" class="container"></div>'
      controller: 'homeController').when('/static',
      template: '<div id="static"></div>'
      controller: 'staticController').when('/pagina-inesistente',
      template: '<div id="inesistente"></div>'
      controller: 'paginaInesistenteController').otherwise redirectTo: '/home'
    return

  'use strict'
  router.$inject = [ '$routeProvider' ]
  router
