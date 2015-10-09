#!/usr/bin/env node

import express from 'express';
import commander from 'commander';
import path from 'path';
import fs from 'fs';
import vhost from 'vhost';

commander
	.version('1.0.0')
	.option('-i, --directory <dir>', 'Directory containing audio files.')
	.option('-h, --host <host>', 'The hostname to use.')
	.option('-P, --port <port>', 'Port to use [8080].', parseInt)
	.parse(process.argv);

let app = express();
let audioDirectory = path.resolve('./audio');

// @todo This needs to be tested better.
if (commander.host) {
	vhost(commander.host, express.static('/'));
}

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

let server = app.listen(commander.port || 8080, () => {
	let {address, port} = server.address();

	console.log('Listening at http://%s:%s', address, port);
});