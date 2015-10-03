import React from 'react';
import $ from 'jquery';
import PlayerService from '../services/PlayerService';

class FileList extends React.Component {
	constructor() {
		super();

		this.state = {
			'files': []
		};
	}

	componentDidMount() {
		let url = '/a.json';

		$.ajax({
			'url': url,
			'dataType': 'json',
			'cache': false,
			'success': (data) => {
				console.log('DATA', data);

				this.setState({
					'files': data
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

		e.preventDefault();
		e.stopPropagation();
	}

	render() {
		return (
			<ul>
				{ this.state.files.map(item => {
					return (
						<li key={item}>
							<a href='#' onClick={event => this.handleClick(event, item)}>{item}</a>
						</li>
					);
				}) }
			</ul>
		);
	}
}

export default FileList;