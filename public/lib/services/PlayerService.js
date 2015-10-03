import AudioLoader from '../loaders/AudioLoader';
import {EventEmitter} from 'fbemitter';

let AudioContext = window.AudioContext || window.webkitAudioContext;

let _samples = 128;

let _audioContext = new AudioContext();

let _analyser = _audioContext.createAnalyser();
_analyser.fftSize = _samples;
_analyser.minDecibels = -100;
_analyser.maxDecibels = 100;

_analyser.connect(_audioContext.destination);
let _currentBuffer;
let _bufferSource;
let _url;
let _isPlaying = false;
let _isLoaded = false;
let _lastTime = _audioContext.currentTime;

class PlayerService extends EventEmitter {
	get currentTime() {
		return _audioContext.currentTime - _lastTime;
	}

	get duration() {
		return _currentBuffer.duration;
	}

	get analyser() {
		return _analyser;
	}

	get url() {
		return _url;
	}

	get isPlaying() {
		return _isPlaying;
	}

	get buffer() {
		return _currentBuffer;
	}

	stop() {
		if (_isPlaying && _bufferSource) {
			_bufferSource.noteOff ? _bufferSource.noteOff() : _bufferSource.stop();
			_bufferSource.disconnect();

			_isPlaying = false;

			this.emit(STOPPED, _url);
		}
	}

	play() {
		if (_isLoaded) {
			this.stop();

			_lastTime = _audioContext.currentTime;

			_bufferSource = _audioContext.createBufferSource();
			_bufferSource.buffer = _currentBuffer;

			_bufferSource.onended = () => {
				this.emit(ENDED, _url);
			};

			_bufferSource.connect(_analyser);


			_bufferSource.noteOn ? _bufferSource.noteOn(0) : _bufferSource.start(0);
			_isPlaying = true;

			this.emit(PLAYING, _url);
		}
	}

	load(file) {
		return new Promise((resolve, reject) => {
			AudioLoader
				.load(file)
				.then((data) => {
					this.emit(LOADED, data);

					if (_url !== data.url) {
						this.emit(CHANGE, data.url, _url);
					}

					_url = data.url;

					_audioContext.decodeAudioData(data.response, (buffer) => {
						_currentBuffer = buffer;
						_isLoaded = true;
						this.play();
						this.emit(BUFFER, _url, buffer);
						resolve(buffer);
					}, () => reject(`Error while decoding ${_url}.`));
				}, (err) => reject(err))
		});
	}
}

let _playerService = new PlayerService();

export default _playerService;
export {_playerService as PlayerService};
export const PLAYING = Symbol();
export const STOPPED = Symbol();
export const LOADED = Symbol();
export const ENDED = Symbol();
export const CHANGE = Symbol();
export const BUFFER = Symbol();