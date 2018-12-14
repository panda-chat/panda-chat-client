import { LogManager } from "./logManager"

const WIDTH: string = "600px"
const HEIGHT: string = "600px"

export class CanvasManager implements ICanvasManager {
    private canvas: CanvasRenderingContext2D
    private _logManager: LogManager
    private _document: Document
    private clickX: number[] = new Array()
    private clickY: number[] = new Array()
    private clickDrag: boolean[] = new Array()
    private painting: boolean

    constructor() {
        this._logManager = new LogManager
        this._document = document
    }

    public init(id: string, width?: string, height?: string): HTMLCanvasElement {
        const canvasDiv: HTMLElement = this._document.getElementById(id)
        if (!canvasDiv) {
            this._logManager.warn(`Canvas element ${id} not found`)
            return
        }

        let canvasElement: HTMLCanvasElement = this._document.createElement('canvas')
        if(!canvasElement) {
            this._logManager.warn(`Cannot create canvas element`)
            return
        }

        canvasElement.setAttribute('width', width ? width : WIDTH)
        canvasElement.setAttribute('height', height ? height : HEIGHT)
        canvasDiv.appendChild(canvasElement)

        this.canvas = canvasElement.getContext("2d")
        this.addEventListeners(canvasDiv)
        return canvasElement
    }

    public getCanvas() {
        return this.canvas
    }

    private addEventListeners(canvasDiv:HTMLElement) {
        
        canvasDiv.addEventListener('mousedown', (ev) => {
            var mouseX = ev.pageX - canvasDiv.offsetLeft
            var mouseY = ev.pageY - canvasDiv.offsetTop
                  
            this.painting = true;
            this.addClick(mouseX, mouseY)
            this.redraw()
        })

        canvasDiv.addEventListener('mouseleave', (ev) => {
            this.painting = false
        })

        canvasDiv.addEventListener('mouseup', (ev) => {
            this.painting = false
        })

        canvasDiv.addEventListener('mousemove', (ev) => {
            if(this.painting) {
                this.addClick(ev.pageX - canvasDiv.offsetLeft, ev.pageY - canvasDiv.offsetTop, true);
                this.redraw();
            }
        })
    }

    private addClick(x: number, y: number, dragging?: boolean) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging ? true : false)
    }

    private redraw(){
        let context = this.canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        
        context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = 5;
                  
        for(var i=0; i < this.clickX.length; i++) {		
          context.beginPath();
          if(this.clickDrag[i] && i){
            context.moveTo(this.clickX[i-1], this.clickY[i-1]);
           }else{
             context.moveTo(this.clickX[i]-1, this.clickY[i]);
           }
           context.lineTo(this.clickX[i], this.clickY[i]);
           context.closePath();
           context.stroke();
        }
      }
}

export interface ICanvasManager {
    init(id: string, width?: string, height?: string): HTMLCanvasElement
    getCanvas(): CanvasRenderingContext2D
}