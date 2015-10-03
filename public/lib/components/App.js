import React from 'react';
import FileList from './FileList.js!jsx';
import ControlPanel from './ControlPanel.js!jsx';
import Waveform from './Waveform.js!jsx';
import Visualization from './Visualization.js!jsx';

class App extends React.Component {
	render() {
		return (
			<div>
				<FileList />
				<ControlPanel />
				<Waveform width="600px" height="100px" />
				<Visualization width="200px" height="100px" />
			</div>
		);
	}
}

export default App;