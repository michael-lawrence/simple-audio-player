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

function render(image, data) {
	var imageWidth = image.width;
	var imageHeight = image.height;
	var dataLength = imageWidth / Math.ceil(imageWidth / data.length); // Clip the extra samples that don't divide evenly
	var xSpacing = imageWidth / dataLength;
	var ySpacing = imageHeight / 128;
	var barWidth = Math.ceil(xSpacing) || 1;
	var x;
	var y;

	for (x = 0; x < dataLength; x++) {
		var sample = data[x];
		var realX = Math.floor(x * xSpacing);
		var sampleHeight = Math.floor(sample * ySpacing);

		for (y = 0; y < sampleHeight; y++) {
			var realY = imageHeight - y;

			for (var i = 0; i < barWidth; i++) {
				if (barWidth < 5 || i !== barWidth - 1) {
					var color = 255 - (realY * 2);

					drawPixel(image, realX + i, realY, {
						'r': color,
						'g': color,
						'b': color,
						'a': 255
					});
				}
			}
		}
	}

	return image;
}

onmessage = function (e) {
	var image = render(e.data.image, e.data.data);

	postMessage({image});
};