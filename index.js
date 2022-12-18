const paintCanvas = document.querySelector('.canvas');
const { width, height } = paintCanvas;
const context = paintCanvas.getContext( '2d' );
context.fillStyle = "#252525";
// context.fillStyle = "white";
context.fillRect(0, 0, width, height);


let x = 0, y = 0;
let isMouseOver = false;
let clearInProcess = false

const clear = (step) => {
    let curStep = isNaN(step) ? 0 : step
    const leftSteps = 10 - curStep
    const imgData = context.getImageData( 0, 0, width, height)

    for (let i = 0; i < imgData.data.length / 4; i++) {
        const _i = i * 4;
        if (!leftSteps) {
            imgData.data[_i]=37; //r
            imgData.data[_i+1]=37; //g
            imgData.data[_i+2]=37; //b
        } else {
            if (imgData.data[_i] !== 37) {
                imgData.data[_i] -= ((imgData.data[_i] - 37) / leftSteps);
            }
            if (imgData.data[_i+1] !== 37) {
                imgData.data[_i+1] -= ((imgData.data[_i+1] - 37) / leftSteps);
            }
            if (imgData.data[_i+2] !== 37) {
                imgData.data[_i+2] += ((37 -imgData.data[_i+2]) / leftSteps);
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
        const _x = i % side;
        const _y = Math.trunc(i / side);
        // (x - center_x)² + (y - center_y)² < radius²
        if ((_x - r)**2 + (_y - r)**2 < r**2) {
            const _i = i*4;

            if (imgData.data[_i+2] == 37) {
                imgData.data[_i]=255; //r
                imgData.data[_i+1]=60; //g
                imgData.data[_i+2]=0; //b
                imgData.data[_i+3]=255;
                // todo: transparency == white color for some reason
                // imgData.data[_i+3]=255 - 255 * ((_x - r)**2 + (_y - r)**2) / r**2
            } else if (imgData.data[_i+1] > 55 && imgData.data[_i+1] !== 255) {
                imgData.data[_i+1] += 10;
                imgData.data[_i+3] = 255;
            } else if (imgData.data[_i+1] < 45) {
                imgData.data[_i+1] = Math.min(imgData.data[_i+1] - 10, 0);
                imgData.data[_i+3] = 255;
            } else {
                imgData.data[_i+1] = 44;
                imgData.data[_i+3] = 255;
            }
            // alt to transparency
            // imgData.data[_i+3]= ((_x - r/2)**2 + (_y - r/2)**2) < r**2 ? 0 : 255
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
