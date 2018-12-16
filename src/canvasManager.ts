import { LogManager, ILogManager } from "./logManager"

const WIDTH: string = "600px"
const HEIGHT: string = "600px"
const STROKE_COLOR: string = "#DF4B26"
const STROKE_JOIN: CanvasLineJoin = "round"
const STROKE_WIDTH: number = 5

export class CanvasManager implements ICanvasManager {
    private _canvasContext: CanvasRenderingContext2D
    private _logManager: ILogManager
    private _document: Document
    private _clickX: number[] = new Array()
    private _clickY: number[] = new Array()
    private _clickDrag: boolean[] = new Array()
    private _painting: boolean

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

        this._canvasContext = canvasElement.getContext("2d")
        this._canvasContext.strokeStyle = STROKE_COLOR
        this._canvasContext.lineJoin = STROKE_JOIN
        this._canvasContext.lineWidth = STROKE_WIDTH

        this.addEventListeners(canvasDiv)
        return canvasElement
    }

    public getCanvas() {
        return this._canvasContext
    }

    public setStrokeSize(size: number): void {
        this._canvasContext.lineWidth = size
    }

    //todo: stroke style can take more than a color
    public setStrokeStyle(color: string): void {
        this._canvasContext.strokeStyle = color
    }

    public setStrokeJoinShape(canvasLineJoin: CanvasLineJoin): void {
        this._canvasContext.lineJoin = canvasLineJoin
    }

    private addEventListeners(canvasDiv:HTMLElement) {
        
        canvasDiv.addEventListener('mousedown', (ev) => {
            var mouseX = ev.pageX - canvasDiv.offsetLeft
            var mouseY = ev.pageY - canvasDiv.offsetTop
                  
            this._painting = true;
            this.addClick(mouseX, mouseY)
            this.redraw()
        })

        canvasDiv.addEventListener('mouseleave', (ev) => {
            this._painting = false
        })

        canvasDiv.addEventListener('mouseup', (ev) => {
            this._painting = false
        })

        canvasDiv.addEventListener('mousemove', (ev) => {
            if(this._painting) {
                this.addClick(ev.pageX - canvasDiv.offsetLeft, ev.pageY - canvasDiv.offsetTop, true)
                this.redraw()
            }
        })

        canvasDiv.addEventListener("touchmove", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var touch = ev.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            canvasDiv.dispatchEvent(mouseEvent);
          }, false);
    }

    private addClick(x: number, y: number, dragging?: boolean) {
        this._clickX.push(x)
        this._clickY.push(y)
        this._clickDrag.push(dragging ? true : false)
    }

    //todo what do we need to redraw for? Examples show this but its currently working without this. Doin me a confuse
    private redraw(){
        //this._canvasContext.clearRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height)
        
        this._clickX.forEach((clickX, i) => {
            this._canvasContext.beginPath()
            if(this._clickDrag[i] && i){
                this._canvasContext.moveTo(this._clickX[i-1], this._clickY[i-1])
            } else {
                this._canvasContext.moveTo(this._clickX[i]-1, this._clickY[i])
            }
            this._canvasContext.lineTo(this._clickX[i], this._clickY[i])
            this._canvasContext.closePath()
            this._canvasContext.stroke()
        })
    }
}

export interface ICanvasManager {
    init(id: string, width?: string, height?: string): HTMLCanvasElement
    getCanvas(): CanvasRenderingContext2D
    setStrokeSize(size: number): void
    setStrokeStyle(color: string): void
    setStrokeJoinShape(shape: CanvasLineJoin): void
}