import React from 'react';
import FileList from './FileList.js!jsx';
import ControlPanel from './ControlPanel.js!jsx';

class App extends React.Component {
	render() {
		return (
			<div>
				<FileList />
				<ControlPanel />
			</div>
		);
	}
}

export default App;