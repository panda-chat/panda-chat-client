import { CanvasManager } from "./canvasManager"

let canvasManager: CanvasManager = new CanvasManager
const canvasElement: HTMLCanvasElement = canvasManager.init('canvas')
const canvas: CanvasRenderingContext2D = canvasManager.getCanvas()

function img() {
    const drawimg = document.getElementById('drawimg')
    drawimg.setAttribute('src', canvasElement.toDataURL('image/png'))
}

function downimg() {
    //const drawimg = document.getElementById('drawimg')
    const downimg = document.getElementById('downimg')
    //drawimg.setAttribute('src', canvasElement.toDataURL('image/png'))
    //img()
    var durl = canvasElement.toDataURL('image/png')
    downimg.setAttribute('href', durl)   
}

document.getElementById('printimg').addEventListener('click', () => {
    img()
})

document.getElementById('downimg').addEventListener('click', () => {
    downimg()
})

document.getElementById('drop-zone').addEventListener('drop', (ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    alert('dropped')
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