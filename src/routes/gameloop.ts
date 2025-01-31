export class GameLoop {
	LastFrameTime = 0;
	accumulatedTime = 0;
	timeStep = 1000;
	rafid: null | number = null;
	isRunning = false;
	Tick: () => void;
	Render: (frac: number) => void;

	constructor(tick: () => void, render: (frac: number) => void) {
		this.Tick = tick;
		this.Render = render;
	}

	mainLoop = (timestamp: number) => {
		if (!this.isRunning) return;

		let deltaTime = timestamp - this.LastFrameTime;
		this.LastFrameTime = timestamp;

		this.accumulatedTime += deltaTime;

		while (this.accumulatedTime >= this.timeStep) {
			this.Tick();
			this.accumulatedTime -= this.timeStep;
		}

		this.Render(this.accumulatedTime / this.timeStep);
		requestAnimationFrame(this.mainLoop)
	}

	start() {
		if (!this.isRunning) {
			this.isRunning = true;
			this.LastFrameTime = document.timeline.currentTime!;
			this.rafid = requestAnimationFrame(this.mainLoop);
		}
	}

	stop() {
		if (this.rafid) {
			cancelAnimationFrame(this.rafid);
		}
		this.isRunning = false;
	}
}
