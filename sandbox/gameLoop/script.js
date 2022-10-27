class Rect {
    constructor(vpw, vph) {
        this.x = 0;
        this.y = 0;
        this.vx = 7;
        this.vy = 7;
        this.width = 100;
        this.height = 100;
        this.vpw = vpw;
        this.vph = vph;
    }

    update(correlation = 1) {
        this.x += this.vx * correlation;
        this.y += this.vy * correlation;
        if (this.x < 0) {
            this.x = 0;
            this.vx = -this.vx;
        }
        if (this.x + this.width > this.vpw) {
            this.x = this.vpw - this.width;
            this.vx = -this.vx;
        }
        if (this.y < 0) {
            this.y = 0;
            this.vy = -this.vy;
        }
        if (this.y + this.height > this.vph) {
            this.y = this.vph - this.height;
            this.vy = -this.vy;
        }
    }

    draw(context) {
        context.fillStyle = "green";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 800;
const rect = new Rect(canvas.width, canvas.height);

const fps = 60;
const frameInterval = 1000 / fps;
let lastTime = 0;

let lastFpsUpdate = 0;
const timestamps = [];
let actualFps = 0;

function updateFrameRate(timestamp) {
    if (timestamps.length > 500) {
        timestamps.shift();
    }
    timestamps.push(timestamp);
    if (timestamps.length > 1 && timestamp - lastFpsUpdate > 500) {
        lastFpsUpdate = timestamp;
        const timeElapsed = timestamps[timestamps.length - 1] - timestamps[0];
        const averageFrameTime = timeElapsed / timestamps.length;
        actualFps = Math.round(1000 / averageFrameTime * 100) / 100;
    }
}

function showFrameRate() {
    context.font = "24px serif";
    context.fillStyle = "black";
    context.fillText(`FPS: ${actualFps}`, 450, 50);
}

// animate_normalLoop(0);
// animate_withCorrelation(0);
// animate_fixedFps(0);
animate_fixedFps_includeDifference(0);

// Rect speed is depending on monitor refresh rate
function animate_normalLoop(timestamp) {
    updateFrameRate(timestamp);

    rect.update();

    context.clearRect(0, 0, canvas.width, canvas.height);
    rect.draw(context);
    showFrameRate();

    requestAnimationFrame(animate_normalLoop);
}

// Actually looks like good results on any monitor refresh rates
// Fps stills same as monitor refresh rate but speed of objects is correlated
function animate_withCorrelation(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    updateFrameRate(timestamp);

    const correlation = deltaTime / frameInterval;
    rect.update(correlation);

    context.clearRect(0, 0, canvas.width, canvas.height);
    rect.draw(context);
    showFrameRate();

    requestAnimationFrame(animate_withCorrelation);
}

// Fps is fixed but never equal expected since we miss difference. It always lower then expected
// if monitor refresh rate is lower then expected refresh rate - animation is laggy
// If monitor refresh rate is higher - works fine but on lower fps then expected
function animate_fixedFps(timestamp) {
    requestAnimationFrame(animate_fixedFps);

    const deltaTime = timestamp - lastTime;
    if (deltaTime > frameInterval) {
        updateFrameRate(timestamp);
        lastTime = timestamp;
        rect.update();
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    rect.draw(context);
    showFrameRate();
}

// Fixes problems of previous loop, shows correct fps without lags on lower refresh rates
// But if monitor refresh rate is not multiplier of expected fps - you'll got lags per time
function animate_fixedFps_includeDifference(timestamp) {
    requestAnimationFrame(animate_fixedFps_includeDifference);

    const deltaTime = timestamp - lastTime;
    if (deltaTime > frameInterval) {
        updateFrameRate(timestamp);
        lastTime = timestamp - (deltaTime % frameInterval);
        rect.update();
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    rect.draw(context);
    showFrameRate();
}