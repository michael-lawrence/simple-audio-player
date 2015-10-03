let _rootPath = '/a/';

function load(path) {
	console.log(`Loading file ${path}.`);

	let url = `${_rootPath}${path}`;

	return new Promise((resolve, reject) => {
		let req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.responseType = 'arraybuffer';

		req.onreadystatechange = () => {
			if (req.readyState == 4) {
				if (req.status == 200) {
					resolve({
						url,
						'response': req.response
					});
				} else {
					reject(`Status Code: ${req.status}. Failed to load ${url}. Wrong url or cross origin issue.`);
				}
			}
		};

		req.send();
	});
}

export default {
	load
};