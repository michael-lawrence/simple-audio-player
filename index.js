import express from 'express';
import commander from 'commander';
import path from 'path';
import fs from 'fs';

commander
	.version('1.0.0')
	.option('-i, --directory <dir>', 'Directory containing audio files.')
	.parse(process.argv);

let app = express();
let audioDirectory = path.resolve('./audio');

app.use(express.static('public'));

if (commander.directory) {
	audioDirectory = path.resolve(commander.directory);
}

app.use('/a', express.static(audioDirectory));

app.get('/a.json', function (req, res) {
	fs.readdir(path.resolve(audioDirectory), (err, files) => {
		res.json(err ? err : files.filter(file => path.extname(file) === '.mp3'));
	});
});

let server = app.listen(3000, () => {
	let {address, port} = server.address();

	console.log('Listening at http://%s:%s', address, port);
});