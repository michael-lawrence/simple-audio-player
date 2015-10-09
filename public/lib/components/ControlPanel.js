import React from 'react';
import {Toolbar, ToolbarSeparator, ToolbarGroup, ToolbarTitle} from 'material-ui/lib/toolbar';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import {PlayerService, STOPPED, PLAYING} from '../services/PlayerService';
import Waveform from './Waveform.js!jsx';
import Visualization from './Visualization.js!jsx';

class ControlPanel extends React.Component {
	constructor() {
		super();

		this.state = {
			'isPlaying': false,
			'url': null
		};

		this.playIcon =
			<FontIcon className="material-icons" color="rgba(255, 84, 0, 0.5)">play_circle_filled</FontIcon>;
		this.pauseIcon =
			<FontIcon className="material-icons" color="rgba(255, 84, 0, 0.5)">pause_circle_filled</FontIcon>;

		PlayerService.addListener(PLAYING, (file) => this.setState({'isPlaying': true, 'url': file}));
		PlayerService.addListener(STOPPED, () => this.setState({'isPlaying': false, 'url': null}));
	}

	handleClick() {
		if (PlayerService.isPlaying) {
			PlayerService.stop();
		} else {
			PlayerService.play();
		}
	}

	render() {
		return (
			<Toolbar>
				<ToolbarGroup>
					<IconButton tooltip={this.state.isPlaying ? 'Pause' : 'Play'} onClick={this.handleClick}>
						{this.state.isPlaying ? this.pauseIcon : this.playIcon}
					</IconButton>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarTitle text={this.state.url} />
				</ToolbarGroup>
				<ToolbarGroup float="right">
					<Waveform width="400px" height="36px"/>
					<Visualization width="100px" height="36px"/>
				</ToolbarGroup>
			</Toolbar>
		);
	}
}

export default ControlPanel;