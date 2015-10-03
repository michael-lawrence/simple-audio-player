import React from 'react';
import {PlayerService, STOPPED, PLAYING} from '../services/PlayerService';

class ControlPanel extends React.Component {
	constructor() {
		super();

		this.state = {'play': 'Play'};

		PlayerService.addListener(PLAYING, () => this.setState({'play': 'Pause'}));
		PlayerService.addListener(STOPPED, () => this.setState({'play': 'Play'}));
	}

	handleClick(file) {
		if (PlayerService.isPlaying) {
			PlayerService.stop();
		} else {
			PlayerService.play();
		}
	}

	render() {
		return (
			<div>
				<button onClick={this.handleClick}>{this.state.play}</button>
			</div>
		);
	}
}

export default ControlPanel;