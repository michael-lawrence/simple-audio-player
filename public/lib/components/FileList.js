import React from 'react';
import {List, ListItem} from 'material-ui/lib/lists';
import FontIcon from 'material-ui/lib/font-icon';
import $ from 'jquery';
import PlayerService from '../services/PlayerService';

class FileList extends React.Component {
	constructor() {
		super();

		this.state = {
			'files': [],
			'selected': null
		};

		this.playIcon = <FontIcon className="material-icons" color="rgba(255, 84, 0, 0.5)">play_circle_filled</FontIcon>;
	}

	componentDidMount() {
		let url = '/a.json';

		$.ajax({
			'url': url,
			'dataType': 'json',
			'cache': false,
			'success': (data) => {
				this.setState({
					'files': data,
					'selected': null
				});
			},
			'error': (xhr, status, err) => {
				console.error(url, status, err.toString());
			}
		});
	}

	handleClick(e, file) {
		PlayerService
			.load(file)
			.then(
			() => console.log(`Playing ${file}.`),
			(err) => console.error(err)
		);

		this.setState({
			'files': this.state.files,
			'selected': file
		});

		e.preventDefault();
		e.stopPropagation();
	}

	render() {
		return (
			<List>
				{this.state.files.map(item => {
					return (
						<ListItem key={item}
						          primaryText={item}
						          rightIcon={(this.state.selected === item) ? this.playIcon : null}
						          onClick={event => this.handleClick(event, item)}
							/>
					);
				})}
			</List>
		);
	}
}

export default FileList;