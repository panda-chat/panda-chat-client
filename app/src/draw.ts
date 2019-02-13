import { CanvasManager } from "./canvasManager"
import { ChatManager } from "./chatManager";
import { LogManager } from "./logManager";
import * as AColorPicker from "../../node_modules/a-color-picker/dist/acolorpicker"
import '../site.scss';

let canvasManager: CanvasManager = new CanvasManager();
const canvasElement: HTMLCanvasElement = canvasManager.init('canvas')
const canvas: CanvasRenderingContext2D = canvasManager.getCanvas()
const logManager: LogManager = new LogManager
const chatManager: ChatManager = new ChatManager();
chatManager.init();

AColorPicker.from('div.drawing-container-color-picker')[0].on('change', (p, c) => {
    canvasManager.setStrokeStyle(c)
})

//todo change the way this works so we dont have to keep the stroke size here
let currentWidth: number = 5

//todo this file is the main file in the app and a playground for testing
//as tested code works we need to move it into an appropriate manager
function img(src?: string) {
    const drawimg = document.getElementById('drawimg')
    drawimg.setAttribute('src', src ? src : canvasElement.toDataURL('image/png'))
}

function downloadImage() {
    const downimg = document.getElementById('download-image')
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

document.getElementById('download-image').addEventListener('click', () => {
    downloadImage()
})

document.getElementById('erase-canvas').addEventListener('click', () => {
    window.console.log('erase');
    canvasManager.eraseCanvas()
})

document.getElementById('send-canvas').addEventListener('click', () => {
    var durl = canvasElement.toBlob((b) =>{ 
        chatManager.sendImageBlob(b)
     })
})

document.getElementById('drawing-container-controls-undo').addEventListener('click', () => {
    window.console.log("undio");
    canvasManager.undo();
})

document.querySelectorAll('.stroke-size').forEach((elem) => {
    elem.addEventListener('click', (e) => {
       const target = e.target as Element
       const type = target.getAttribute('attr-type')
       if(type === "up") {
           currentWidth++
           if(currentWidth > 20){
               currentWidth = 20
           }
           canvasManager.setStrokeSize(currentWidth)
       }
       else if(type === "down") {
            currentWidth--
            if(currentWidth < 1){
                currentWidth = 1
            }
            canvasManager.setStrokeSize(currentWidth)
       }
    })
})

document.getElementById('canvas').addEventListener('drop', (ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    canvasManager.eraseCanvas()
    //todo POC
    const droppedFile = ev.dataTransfer.items[0].getAsFile()
    var image = new Image()
    image.onload = () => {
        canvas.drawImage(image, 0, 0)
        URL.revokeObjectURL(image.src)
    }
    image.src = URL.createObjectURL(droppedFile)
}, false)

document.getElementById('canvas').addEventListener('dragdrop', (ev) => {
    ev.stopPropagation()
    ev.preventDefault()
}, false)

document.getElementById('canvas').addEventListener('dragenter', (ev) => {
    ev.preventDefault();
})

document.getElementById('canvas').addEventListener('dragover', (ev) => {
    ev.preventDefault();
})

document.getElementById('canvas').addEventListener('dragleave', (ev) => {
    ev.preventDefault();
})