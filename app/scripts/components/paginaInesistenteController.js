define([
  'pages/inesistente'
], function(inesistente) {
    'use strict';

    function paginaInesistenteController() {
      inesistente.present();
    }

    return paginaInesistenteController;
});
