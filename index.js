const paintCanvas = document.querySelector('.canvas');
const { width, height } = paintCanvas;
const context = paintCanvas.getContext( '2d' );
context.fillStyle = "rgba(0, 0, 0, 0)";
context.fillRect(0, 0, width, height);


let x = 0, y = 0;
let isMouseOver = false;
let clearInProcess = false;

const clear = (step) => {
    let curStep = isNaN(step) ? 0 : step;
    const leftSteps = 30 - curStep;
    const imgData = context.getImageData( 0, 0, width, height);

    for (let i = 0; i < imgData.data.length / 4; i++) {
        const _i = i * 4;

        if (!leftSteps) {
            imgData.data[_i+1] = 0;
            imgData.data[_i+3] = 0;
        }
        if (imgData.data[_i+3] < 255) {
            imgData.data[_i+3] -= 33;
        } else {
            if (imgData.data[_i+1] < 45) {
                imgData.data[_i+1] += 10;
            } else if(imgData.data[_i+1] > 55) {
                imgData.data[_i+1] = imgData.data[_i+1] > 70 ? imgData.data[_i+1] - 15 : 55;
            } else if(imgData.data[_i+1] === 55) {
                imgData.data[_i+1] = 60;
                imgData.data[_i+3] -= 33;
            } else {
                imgData.data[_i+1] = 255;
            }
        }
    }

    context.putImageData(imgData, 0, 0);

    if (!leftSteps) {
        clearInProcess = false;
        return
    }

    setTimeout(() => {
        clear(++curStep);
    }, 50);
}

const draw = (x, y) => {
    const side = 20;
    const r = side / 2;
    const imgData = context.getImageData(x - r, y - r, side, side, { colorSpace: "srgb" });

    for (let i = 0; i < imgData.data.length / 4; i++)
    {
        const _x = i % side - 10;
        const _y = Math.trunc(i / side) - 10;

        // (x - center_x)² + (y - center_y)² < radius²
        if ((_x)**2 + (_y)**2 < r**2) {
            const _i = i*4;

            if (imgData.data[_i+3] === 0) {
                imgData.data[_i] = 255; //r
                imgData.data[_i+1] = 60; //g
                imgData.data[_i+2] = 0; //b
                imgData.data[_i+3] = 125
            } else  if (imgData.data[_i+3] < 255 ){
                imgData.data[_i+3] += 44
            } else if (imgData.data[_i+1] > 55 && imgData.data[_i+1] !== 255) {
                imgData.data[_i+1] += 15;
            } else if (imgData.data[_i+1] < 45) {
                imgData.data[_i+1] = Math.min(imgData.data[_i+1] - 10, 0);
            } else {
                imgData.data[_i+1] = 44;
            }
        }
    }
    context.putImageData(imgData, x - r, y - r);
}

const stopDrawing = () => {
    isMouseOver = false;
    // todo: debounce
    clearInProcess = true;
    clear();
}
const startDrawing = event => {
    isMouseOver = true;
    [x, y] = [event.offsetX, event.offsetY];
}
const drawLine = event => {
    if ( isMouseOver && !clearInProcess ) {
        draw(event.offsetX, event.offsetY);
    }
}

paintCanvas.addEventListener( 'mouseover', startDrawing );
paintCanvas.addEventListener( 'mousemove', drawLine );
paintCanvas.addEventListener( 'mouseout', stopDrawing );
