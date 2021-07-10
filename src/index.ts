import './styles/style.scss';
import * as bodyPix from '@tensorflow-models/body-pix';
import { ModelConfig } from '@tensorflow-models/body-pix/dist/body_pix_model';
import * as tf from '@tensorflow/tfjs';

const startVideStream = async (videoElement: HTMLVideoElement): Promise<void> => {
	videoElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

	videoElement.onloadedmetadata = (): void => {
		videoElement.width = videoElement.videoWidth;
		videoElement.height = videoElement.videoHeight;
	};
	await videoElement.play();
};

const blur = async (video: HTMLVideoElement, canvas: HTMLCanvasElement, net: bodyPix.BodyPix): Promise<void> => {
	const segmentation = await net.segmentPerson(video);

	const backgroundBlurAmount = 15;
	const edgeBlurAmount = 6;
	const flipHorizontal = false;

	bodyPix.drawBokehEffect(canvas, video, segmentation, backgroundBlurAmount, edgeBlurAmount, flipHorizontal);
	await blur(video, canvas, net);
};

const loadBodyPix = async (video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<void> => {
	const options: ModelConfig = {
		multiplier: 1,
		outputStride: 16,
		quantBytes: 4,
		architecture: 'ResNet50'
	};
	try {
		const net = await bodyPix.load(options);
		void await blur(video, canvas, net);
	} catch (e) {
		console.error('Load error: ', e);
	}
};

const init = (): void => {
	tf.getBackend();
	const video = document.getElementById('videoElement') as HTMLVideoElement;
	const canvas = document.getElementById('canvasPerson') as HTMLCanvasElement;
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	video.onloadeddata = (): void => {
		void loadBodyPix(video, canvas);
	};

	void startVideStream(video);
};

window.onload = (): void => init();
