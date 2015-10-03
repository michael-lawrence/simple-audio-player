import React from 'react';
import {PlayerService, BUFFER, LOADED} from '../services/PlayerService';

let renderer = new Worker("lib/web-workers/Waveform.js");

function _render(buffer, context, width, height) {
	if (buffer) {
		let image = context.createImageData(width, height);
		let data = buffer.getChannelData(0);
		let {currentTime, duration} = PlayerService;

		renderer.postMessage({
			image,
			data,
			currentTime,
			duration
		});
	}
}

class Waveform extends React.Component {
	componentDidMount() {
		let canvas = React.findDOMNode(this.refs.waveform);
		let context = canvas.getContext('2d');

		PlayerService.addListener(LOADED, () => context.clearRect(0, 0, canvas.width, canvas.height));
		PlayerService.addListener(BUFFER, (url, buffer) => _render(buffer, context, canvas.width, canvas.height));

		setInterval(() =>  _render(PlayerService.buffer, context, canvas.width, canvas.height), 50);

		renderer.onmessage = (e) => context.putImageData(e.data.image, 0, 0);
	}

	render() {
		return (
			<canvas ref='waveform' width={this.props.width} height={this.props.height}/>
		);
	}
}

export default Waveform;