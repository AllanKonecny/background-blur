import './styles.scss';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import 'gapi.client';


const detectBody = async (webcamElement: HTMLVideoElement): Promise<void> => {
	const net = await bodyPix.load();
	const t = tf;
	const personSegmentation = await net.segmentPerson(webcamElement, { scoreThreshold: 0.9 });
	if (personSegmentation != null) {
		drawBody(personSegmentation, webcamElement);
	}
	window.requestAnimationFrame(() => detectBody(webcamElement));
};

const webCam = () => {
	const video = document.querySelector('#videoElement') as HTMLVideoElement;
	const constraints = { video: { frameRate: { ideal: 24, max: 24 } } };

	if (navigator.mediaDevices.getUserMedia && video) {
		navigator.mediaDevices.getUserMedia(constraints)
			.then(function(stream) {
				video.srcObject = stream;
				void detectBody(video);
			})
			.catch(function(err0r) {
				console.error('Something went wrong! ', err0r);
			});
	}
};


const drawBody = (personSegmentation: bodyPix.SemanticPersonSegmentation, camera: HTMLVideoElement) => {
	const canvasPerson = document.querySelector('canvas');
	let contextPerson = canvasPerson?.getContext('2d');
	if (canvasPerson && contextPerson) {
		contextPerson.drawImage(camera, 0, 0, camera.width, camera.height);
		let imageData = contextPerson.getImageData(0, 0, camera.width, camera.height);
		let pixel = imageData.data;
		for (var p = 0; p < pixel.length; p += 4) {
			if (personSegmentation.data[p / 4] == 0) {
				pixel[p + 3] = 0;
			}
		}
		// const backgroundDarkeningMask = bodyPix.toMask(personSegmentation);

		// const opacity = 1;
		// const maskBlurAmount = 0;
		// const flipHorizontal = true;
		// const img = new Image();
		// img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Lower_Manhattan_skyline_-_June_2017.jpg/1920px-Lower_Manhattan_skyline_-_June_2017.jpg';

		// bodyPix.drawMask(
		//   canvasPerson, camera, img, opacity, maskBlurAmount, flipHorizontal);
		contextPerson.putImageData(imageData, 0, 0);
	}
};

function getBase64Image(img: HTMLImageElement) {
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx?.drawImage(img, 0, 0);
	var dataURL = canvas.toDataURL('image/png');
	return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
}


function init() {
	webCam();
}

window.onload = () => init();
