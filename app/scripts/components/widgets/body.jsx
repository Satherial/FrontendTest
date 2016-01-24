define([
	'jquery', 'typeahead', 'classnames', 'react', 'react-dom'
], function($, typeahead, classNames, React, ReactDOM) {
	'use strict';
	return {
		present: function(server) {

			var SubmissionsView = React.createClass({
				render: function() {
					var submissions = [];
					for(var i = 0; i < this.props.submission.length; i++){
						submissions.push(this.props.submission[i].name+': '+this.props.submission[i]+value);
					}
					return (
						<div>
							<h3>Submission#{this.props.index}</h3>
							{submissions}
						</div>
					)
				}
			});

			var ErrorSpanView = React.createClass({
        getInitialState: function() {
          return {show: false};
        },

        componentWillMount: function() {
         for(var i = 0; i < this.props.show.length ; i++){
           if(his.props.show[i] === this.props.id){
             this.setState({ show: true });
           }
         }
        },

				render: function() {

					var showMe = classNames({
						'hidden': !this.state.show
					});

					return (
						<span id={this.props.id} className={showMe}>{this.props.msg}</span>
					)
				}
			});

			var FormView = React.createClass({
				getInitialState: function() {
					return {spansToShow: []};
				},

				componentWillMount: function() {
					this.props.required = false;
					var rules = this.props.rules;
					var spans = this.props.spans;

					for (var i = 0; i < rules; i++) {
						if (rules[i].type === 'required') {
							this.props.required = true;
						}
						var id = this.props.name + '-' + rules[i].type;
						spans.push( <ErrorSpanView id={id} msg={rules[i].msg} show={this.state.spansToShow} /> );
					}
				},

				validate: function(event) {
					var value = event.target.value;

					for(var i = 0; i < this.props.rules.length; i++){
						var current = this.props.rules[i];

						if (current.type === 'required') {
							if (value === '') {
								this.state.spansToShow.push(this.props.name + '-' + current.type);
							}
						}
						if (current.type === 'pattern') {
							if (!current.options.pattern.test(value)) {
								this.state.spansToShow.push(this.props.name + '-' + current.type);
							}
						}
						if (current.type === 'min_len' || current.type === 'min') {
							if (value.length <= current.options.val) {
								this.state.spansToShow.push(this.props.name + '-' + current.type);
							}
						}
						if (current.type === 'max_len' || current.type === 'max') {
							if (value.length >= current.options.val) {
								this.state.spansToShow.push(this.props.name + '-' + current.type);
							}
						}
						if (current.type === 'email') {
							var email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
							if (!email.test(value)) {
								this.state.spansToShow.push(this.props.name + '-' + current.type);
							}
						}
					}
					this.setState({ spansToShow: this.state.spansToShow});
				},

				render: function() {
					var id = this.props.name;

					return (
						<div>
							<label htmlForm={id}>{this.props.label}</label>
							<input onBlur={this.validate} id={id} required={this.props.required} name={this.props.name} type={this.props.type}/>
							<div className="errors">
								{this.props.span}
							</div>
						</div>
					)
				}
			});

			var BodyView = React.createClass({
				getInitialState: function() {
					return {showForm: false, labels: [], urls: [], forms: [], submissions: []};
				},

				populateTypeheads: function(event) {
					if (event.target.value !== undefined && event.target.value.length > 3) {
						var _this = this;
						server.autocomplete.get(function(response) {
							console.log('response',response);
							if (response !== null && response.length > 0) {
								_this.setState({showForm: true});
								for (var i = 0; i < response.length; i++) {
									_this.state.labels.push(response[i].label);
									_this.state.urls.push(response[i]);
								}
								_this.setState({labels: this.state.labels});
								_this.setState({urls: this.state.urls});
								$('#search').typeahead({source: this.state.labels, minLength: 2});
							}
						}, function(error) {
							console.error('Errore di comunicazione con il server!', error);
						});
					}
				},

				handleSubmitSearch: function(event) {
					event.preventDefault();
					var _this = this;
					var label = $('#search').val();
					var urls = this.state.urls;
					for (var i = 0; i < urls.length; i++) {
						if (urls[i].label === label) {
							server.customPath = urls[i].url;
							server.submission.get(function(response) {
								if (response !== null && response.length > 0) {
									_this.setState({forms: response})
								}
							}, function(error) {
								console.error('Errore di comunicazione con il server!', error);
							});
						}
					}
				},

				handleSubmitSubmissions: function(event) {
					event.preventDefault();
					this.state.submissions = $('#formAddSubmission').serializeArray();
					this.setState({ submissions: this.state.submissions });
				},

				componentWillMount: function() {},

				componentDidMount: function() {},

				render: function() {
					var showFormClass = classNames({
						'hidden': !this.state.showForm
					});

					return (
            <div>
              <div id="leftSide" className="left">
                <div>
                  <form name="searchForm" onSubmit={this.handleSubmitSearch}>
                    <label htmlFor="search">Scelta:</label>
                    <input type="text" id="search" val="" onChange={this.populateTypeheads}/>
                  </form>
                  <form id="formAddSubmission" className={showFormClass} name="formsForm" onSubmit={this.handleSubmitSubmissions}>
                  {
                  this.state.forms.map(function(item) {
                    return <FormView name={item.name} label={item.label} type={item.type} rules={item.rules} key={item.name}/>
                    })
                    }
                    <button className="btn btn-default">Submit</button>
                  </form>
                </div>
              </div>
              <div id="rightSide" className="right">
              {
              this.state.submissions.map(function(item, index) {
                return <SubmissionsView submission={item} index={index} key={index}/>
                })
                }
              </div>
            </div>
					);
				}
			});

			ReactDOM.render(<BodyView />, document.getElementById('main'));
		}
	}
	return this;
});
