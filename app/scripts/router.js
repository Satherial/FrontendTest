define([], function() {
  'use strict';

  function router($routeProvider) {
    
      $routeProvider.when('/home',
      {
        template: '<div id="main"></div>',
        controller: 'homeController'
      })
      .when('/static',
      {
        template: '<div id="static"></div>',
        controller: 'staticController'
      }).when('/pagina-inesistente',
      {
        template: '<div id="inesistente"></div>',
        controller: 'paginaInesistenteController'
      })
      .otherwise(
      {
        redirectTo: '/home'
      });
  }

  router.$inject=['$routeProvider'];

  return router;
});
