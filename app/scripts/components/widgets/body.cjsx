define [
	'jquery'
	'typeahead'
	'classnames'
	'react'
	'react-dom'
], ($, typeahead, classNames, React, ReactDOM) ->
	'use strict'
	return { present: (server) ->
		SubmissionView = React.createClass(render: ->
			return (
				<p>
					<strong>{this.props.name}:</strong> {this.props.value}
				</p>
			)
		)
		SubmissionsView = React.createClass(render: ->
			return (
				<div>
					<h3>Submission#{this.props.index}</h3>
            {
              @props.submission.map (item, index) ->
                return <SubmissionView key={index} name={item.name} value={item.value} />
            }
				</div>
			)
		)
		ErrorSpanView = React.createClass(
			getInitialState: ->
				{ show: false }
			componentWillMount: ->
				if @props.spansToShow.indexOf(@props.id) > -1
					@setState show: true
				return
			render: ->
				showMe = classNames(
					'error': true
					'hidden': !@state.show)
				return (
					<p>
						<span id={this.props.id} className={showMe}>{this.props.msg}</span>
					</p>
				)
		)
		FormView = React.createClass(
			getInitialState: ->
				{
					spansToShow: []
					spans: []
					valTypes: []
				}
			componentWillMount: ->
				@props.required = false
				rules = @props.rules
				valTypes = []
				i = 0
				while i < rules.length
					if rules[i].type == 'required'
						@props.required = true
					valTypes.push rules[i].type
					i++
				@setState valTypes: valTypes
				return
			validate: (event) ->
				value = event.target.value
				validationType = @state.valTypes
				spansToShow = []
				spans = []
				rules = @props.rules
				i = 0
				while i < @props.rules.length
					current = @props.rules[i]
					if validationType.indexOf('required') > -1 and current.type == 'required'
						if value == ''
							spansToShow.push @props.name + '-' + current.type
					else if validationType.indexOf('pattern') > -1 and current.type == 'pattern'
						if !current.options.pattern.test(value)
							spansToShow.push @props.name + '-' + current.type
					else if validationType.indexOf('min_len') > -1 and current.type == 'min_len' or validationType.indexOf('min') > -1 and current.type == 'min'
						if value.length <= current.options.val
							spansToShow.push @props.name + '-' + current.type
					else if validationType.indexOf('max_len') > -1 and current.type == 'max_len' or validationType.indexOf('max') > -1 and current.type == 'max'
						if value.length >= current.options.val
							spansToShow.push @props.name + '-' + current.type
					else if validationType.indexOf('email') > -1 and current.type == 'email'
						email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						if !email.test(value)
							spansToShow.push @props.name + '-' + current.type
					i++
				@setState spansToShow: spansToShow
				if spansToShow.length > 0
					k = 0
					while k < rules.length
						id = @props.name + '-' + rules[k].type
						spans.push
							id: id
							msg: rules[k].msg
						k++
				@setState spans: spans
				return
			render: ->
				id = @props.name
				spansToShow = @state.spansToShow
				return (
					<div className="row margin-top">
						<label className="col-md-4" htmlForm={id}>{this.props.label}</label>
						<input className="col-md-8" onBlur={this.validate} data-validation={this.state.valTypes} id={id} required={this.props.required} name={this.props.name} type={this.props.type}/>
						<div className="errors">
              {
                @state.spans.map (item, index) ->
                  return <ErrorSpanView id={item.id} msg={item.msg} spansToShow={spansToShow} />
              }
						</div>
					</div>
				)
		)
		BodyView = React.createClass(
			getInitialState: ->
				{
					showForm: false
					labels: []
					urls: []
					forms: []
					submissions: []
				}
			populateTypeheads: (event) ->
				if event.target.value != undefined and event.target.value.length > 3
					server.autocomplete.get ((response) =>
						if response != null and response.length > 0
							labels = []
							i = 0
							while i < response.length
								labels.push response[i].label
								@state.urls.push response[i]
								i++
							@setState labels: labels
							@setState urls: @state.urls
							$('#search').typeahead
								source: labels
								minLength: 0
						return
					), (error) ->
						console.error 'Errore di comunicazione con il server!', error
						return
				return
			handleFormSearch: (event) ->
				event.preventDefault()
				label = $('#search').val()
				urls = @state.urls
				i = 0
				while i < urls.length
					if urls[i].label == label
						server.customPath = urls[i].url
						server.submission(urls[i].url).get ((response) =>
							if response != null and response.length > 0
								@setState forms: response
								@setState showForm: true
							else
								@setState forms: []
							return
						), (error) ->
							@setState forms: []
							console.error 'Errore di comunicazione con il server!', error
							return
					i++
				return
			validate: (event) ->
				isOk = true
				$(event.target).find('input').each ->
					if @getAttribute('data-validation') and @getAttribute('data-validation').indexOf('required') > -1
						value = @value
						dataValidation = @getAttribute('data-validation')
						type = @getAttribute('type')
						name = @getAttribute('name')
						if type
							if (type == 'checkbox' or type == 'radio') and !@checked
								isOk = false
							else if (type == 'text' or type == 'email' or type == 'textarea') and @value.length == 0
								isOk = false
					return
				if $(event.target).find('.errors p').length > 0
					isOk = false
				isOk
			handleSubmitSubmissions: (event) ->
				event.preventDefault()
				isOk = @validate(event)
				if isOk
					submissions = {}
					submissions.data = $('#formAddSubmission').serializeArray()
					@state.submissions.push submissions
					@setState submissions: @state.submissions
				else
					alert 'Attenzione, devi compilare tutti i campi obbligatori e risolvere gli errori!'
				return
			render: ->
				showFormClass = classNames(
					'border-top': true
					'hidden': !@state.showForm)
				return(
					<div className="row">
						<div id="leftSide" className="col-md-8">
							<div className="row">
								<form name="searchForm" onSubmit={this.handleFormSearch} autocomplete="off">
									<label className="col-md-4" htmlFor="search">Scelta:</label>
									<input autocomplete="off" className="col-md-8" type="text" id="search" val="" onChange={this.populateTypeheads}/>
								</form>
							</div>
							<div className={showFormClass}>
								<form id="formAddSubmission" name="formsForm" onSubmit={this.handleSubmitSubmissions}>
                  {
                    @state.forms.map (item, index) ->
                      return <FormView name={item.name} label={item.label} type={item.type} rules={item.rules} key={item.name}/>
                  }
									<button className="btn btn-default">Submit</button>
								</form>
							</div>
						</div>
						<div id="rightSide" className="col-md-4">
  						{
                @state.submissions.map (item, index) ->
                  return <SubmissionsView submission={item.data} index={index} key={index}/>
  						}
						</div>
					</div>
				)
		)
		ReactDOM.render <BodyView />, document.getElementById 'main'
		return
 }
	this
