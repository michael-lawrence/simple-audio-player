import React from 'react';
import {PlayerService, BUFFER, LOADED, ENDED} from '../services/PlayerService';

let requestAnimationFrame = window.requestAnimationFrame && window.webkitRequestAnimationFrame;
let renderer = new Worker("lib/web-workers/Visualization.js");
let samples = 64;
let maxSampleValue = 255;

function _render() {
	if (PlayerService.isPlaying) {
		let canvas = React.findDOMNode(this.refs.visualization);
		let context = canvas.getContext('2d');

		context.globalAlpha = 0.1;
		context.fillStyle = "#fff";
		context.fillRect(0, 0, canvas.width, canvas.height);

		let image = context.getImageData(0, 0, canvas.width, canvas.height);
		let analyser = PlayerService.analyser;

		let data = new Uint8Array(samples);
		analyser.getByteFrequencyData(data);

		renderer.postMessage({
			image,
			data
		});
	}
}

class Visualization extends React.Component {
	componentDidMount() {
		let canvas = React.findDOMNode(this.refs.visualization);
		let context = canvas.getContext('2d');

		PlayerService.addListener(LOADED, () =>  context.clearRect(0, 0, canvas.width, canvas.height));
		PlayerService.addListener(ENDED, () =>  context.clearRect(0, 0, canvas.width, canvas.height));
		PlayerService.addListener(BUFFER, (url, buffer) => requestAnimationFrame(_render.bind(this)));

		renderer.onmessage = (e) => {
			context.putImageData(e.data.image, 0, 0);

			requestAnimationFrame(_render.bind(this));
		};
	}

	render() {
		return (
			<canvas ref='visualization' width={this.props.width} height={this.props.height}/>
		);
	}
}

export default Visualization;