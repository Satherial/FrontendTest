'use strict'
require.config
  deps: [ 'start' ]
  baseUrl: 'scripts'
  paths:
    'jquery': 'bower_components/jquery/dist/jquery.min'
    'stream': 'bower_components/stream/stream.min'
    'angular': 'bower_components/angular/angular.min'
    'route': 'bower_components/angular-route/angular-route.min'
    'resource': 'bower_components/angular-resource/angular-resource.min'
    'react': 'bower_components/react/react.min'
    'react-dom': 'bower_components/react/react-dom.min'
    'typeahead': 'bower_components/bootstrap3-typeahead/bootstrap3-typeahead.min'
    'home': 'components/homeController'
    'inesistente': 'components/paginaInesistenteController'
    'statico': 'components/staticController'
    'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min'
    'widgets': 'components/widgets'
    'pages': 'components/pages'
    'classnames': 'bower_components/classnames/index'
    'async': 'bower_components/requirejs-plugins/src/async'
    'webrtc': 'bower_components/webrtc-adapter/adapter'
  shim:
    'angular':
      exports: 'angular'
      deps: [ 'jquery' ]
    'route': deps: [ 'angular' ]
    'resource': deps: [ 'angular' ]
    'bootstrap': deps: [ 'jquery' ]

require.onError = (error) ->
  console.error 'ERROR: unable to load module', error.stack
  return
