function drawPixel(image, x, y, color) {
	var index = (x + y * image.width) * 4;

	image.data[index] = color.r;
	image.data[index + 1] = color.g;
	image.data[index + 2] = color.b;
	image.data[index + 3] = color.a;
}

function getAlpha(n) {
	var total = 100;

	if (n < total / 2) {
		return n;
	} else {
		return (total - n);
	}
}

function render(image, data, currentTime, duration) {
	var imageWidth = image.width;
	var imageHeight = image.height;
	var dataLength = data.length;
	var len = dataLength / imageWidth;
	var amountPlayed = Math.floor(currentTime / duration * 100);
	var greyColor = 127;
	var barWidth = 4;

	for (var x = 0; x < imageWidth; x++) {
		var color = {
			'r': greyColor,
			'g': greyColor,
			'b': greyColor
		};

		if (Math.floor(x / imageWidth * 100) < amountPlayed) {
			color = {
				'r': 255,
				'g': 84,
				'b': 0
			};
		}

		if (x % barWidth === 0) {
			var sample = data[Math.floor(x * len)];
			var y = (1 + sample) * imageHeight / 2;
			var yOffset = (imageHeight - y) / 2;

			for (var j = 0; j < y; j++) {
				var realY = Math.floor(j + yOffset);
				var isTop = realY < Math.floor(imageHeight / 2);
				color.a = isTop ? 255 : 127;

				if (realY !== Math.floor(imageHeight / 2)) {
					for (var realX = 0; realX < barWidth - 1; realX++) {
						drawPixel(image, x + realX, realY, color);
					}
				}
			}
		}
	}

	return image;
}

onmessage = function (e) {
	var image = render(e.data.image, e.data.data, e.data.currentTime, e.data.duration);

	postMessage({image});
};