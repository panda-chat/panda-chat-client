import { CanvasManager } from "./canvasManager"
import { LogManager } from "./logManager";
import * as AColorPicker from "../../node_modules/a-color-picker/dist/acolorpicker"
import '../site.scss';

let canvasManager: CanvasManager = new CanvasManager();
const canvasElement: HTMLCanvasElement = canvasManager.init('canvas')
const canvas: CanvasRenderingContext2D = canvasManager.getCanvas()
const logManager: LogManager = new LogManager
AColorPicker.from('div.container')[0].on('change', (p, c) => {
    canvasManager.setStrokeStyle(c)
})

//todo this file is the main file in the app and a playground for testing
//as tested code works we need to move it into an appropriate manager
function img(src?: string) {
    const drawimg = document.getElementById('drawimg')
    drawimg.setAttribute('src', src ? src : canvasElement.toDataURL('image/png'))
}

function downimg() {
    const downimg = document.getElementById('downimg')
    var durl = canvasElement.toDataURL('image/png')
    downimg.setAttribute('href', durl)   
}

function removeDragData(ev: DragEvent) {
    logManager.debug('Removing drag data');
  
    if (ev.dataTransfer.items) {
        ev.dataTransfer.items.clear();
    } else {
        ev.dataTransfer.clearData();
    }
}

document.getElementById('downimg').addEventListener('click', () => {
    downimg()
})

document.getElementById('erase-canvas').addEventListener('click', () => {
    canvasManager.eraseCanvas()
})

document.getElementById('drop-zone').addEventListener('drop', (ev) => {
    ev.stopPropagation()
    ev.preventDefault()

    //todo POC
    const droppedFile = ev.dataTransfer.items[0].getAsFile()
    var image = new Image()
    image.onload = () => {
        canvas.drawImage(image, 0, 0)
        URL.revokeObjectURL(image.src)
    }
    image.src = URL.createObjectURL(droppedFile)
}, false)

document.getElementById('drop-zone').addEventListener('dragdrop', (ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    alert('dropped')
}, false)

document.getElementById('drop-zone').addEventListener('dragenter', (ev) => {
    ev.preventDefault();
    window.console.log('enter')
})

document.getElementById('drop-zone').addEventListener('dragover', (ev) => {
    ev.preventDefault();
    window.console.log('over')
})

document.getElementById('drop-zone').addEventListener('dragleave', (ev) => {
    ev.preventDefault();
    window.console.log('leave')
})