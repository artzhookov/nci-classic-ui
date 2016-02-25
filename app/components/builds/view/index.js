'use strict';

var _ = require('underscore'),
	React = require('react'),
	Router = require('react-router'),
	Reflux = require('reflux'),
	BuildActions = require('../../../actions/build'),
	buildStore = require('../../../stores/build'),
	Terminal = require('../../terminal'),
	BuildSidebar = require('./sidebar'),
	CommonComponents = require('../../common'),
	ProjectHeader = require('../../projects/header'),
	template = require('./index.jade');

var Component = React.createClass({
	mixins: [Reflux.ListenerMixin],
	statics: {
		willTransitionTo: function(transition, params) {
			BuildActions.read(Number(params.id));
		}
	},

	componentDidMount: function() {
		this.listenTo(buildStore, this.updateBuild);
	},

	componentWillReceiveProps: function(nextProps) {
		// reset console status when go from build page to another build
		// page (did mount and mount not called in this case)
		if (Number(nextProps.params.id) !== this.state.build.id) {
			this.setState({showConsole: this.getInitialState().showConsole});
		}
	},

	updateBuild: function(build) {
		if (build) {
			BuildActions.readAll({projectName: build.project.name});
		}
		this.setState({build: build});
	},

	getInitialState: function() {
		return {
			build: null,
			showConsole: false
		};
	},

	toggleConsole: function() {
		var consoleState = !this.state.showConsole;
		if (consoleState) {
			BuildActions.readTerminalOutput(this.state.build);
		}
		this.setState({showConsole: consoleState});
	},

	render: template.locals(_({
		Terminal: Terminal,
		Link: Router.Link,
		BuildSidebar: BuildSidebar,
		ProjectHeader: ProjectHeader
	}).extend(CommonComponents))
});

module.exports = Component;
