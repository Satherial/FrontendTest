define([
	'react',
	'react-dom'
], function (React, ReactDOM) {
'use strict';

		return {
			present: function(){

		    var InesistenteView = React.createClass({
		      render: function () {
		        return (
							<div className="container">
                <div className="row">
                  <div className="col-md-4">
                  </div>
                  <div className="col-md-4 bold large center">
                    <a href="/#/">404</a>
        					</div>
                  <div className="col-md-4">
                  </div>
                </div>
							</div>
		        );
		      }
		    });

				ReactDOM.render(<InesistenteView />, document.getElementById('inesistente'));
			}
    }
		return this;
});
