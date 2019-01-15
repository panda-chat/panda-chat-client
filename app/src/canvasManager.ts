import { LogManager, ILogManager } from "./logManager"

const STROKE_COLOR: string = "#DF4B26"
const STROKE_JOIN: CanvasLineJoin = "round"
const STROKE_WIDTH: number = 5

class CanvasClick {
    public x_pos: number
    public y_pos: number
    public dragging: boolean
    public color: string
    public shape: CanvasLineJoin
    public width: number

    constructor(x_pos: number, y_pos: number, dragging: boolean, color: string, shape: CanvasLineJoin, width: number) {
        this.x_pos = x_pos
        this.y_pos = y_pos
        this.dragging = dragging
        this.color = color
        this.shape = shape
        this.width = width
    }
}

export class CanvasManager implements ICanvasManager {
    private _canvasContext: CanvasRenderingContext2D
    private _logManager: ILogManager
    private _document: Document

    //canvas drawing variables
    private _canvasClicks: CanvasClick[] = new Array()
    private _painting: boolean
    private _currentStrokeColor: string
    private _currentStrokeWidth: number
    private _currentStrokeJoin: CanvasLineJoin

    private canvas_width: number
    private canvas_height: number

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

        window.addEventListener('resize', (ev) => {
            var cs = window.getComputedStyle(canvasDiv);
            this.canvas_width = canvasDiv.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
            this.canvas_height = this.canvas_width > 500 ? 500 : this.canvas_width
            canvasElement.setAttribute('width', this.canvas_width + 'px')
            canvasElement.setAttribute('height', this.canvas_height + 'px')
        })
        window.dispatchEvent(new Event('resize'))

        canvasDiv.appendChild(canvasElement)

        this._canvasContext = canvasElement.getContext("2d")
        this._currentStrokeColor = STROKE_COLOR
        this._currentStrokeJoin = STROKE_JOIN
        this._currentStrokeWidth = STROKE_WIDTH

        this.addEventListeners(canvasDiv)
        return canvasElement
    }

    public getCanvas() {
        return this._canvasContext
    }

    public setStrokeSize(size: number): void {
        this._currentStrokeWidth = size
    }

    //todo: stroke style can take more than a color
    public setStrokeStyle(color: string): void {
        this._currentStrokeColor = color
    }

    public setStrokeJoinShape(canvasLineJoin: CanvasLineJoin): void {
        this._currentStrokeJoin = canvasLineJoin
    }

    public eraseCanvas(): void {
        this._canvasContext.clearRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height)
        this._canvasClicks = new Array()
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

        canvasDiv.addEventListener("touchstart", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var touch = ev.touches[0];
            var mouseEvent = new MouseEvent("mousedown", {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            canvasDiv.dispatchEvent(mouseEvent);
          }, false);

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

    private addClick(x: number, y: number, dragging?: boolean): void {
        this._canvasClicks.push(
            new CanvasClick(x, y, dragging ? true : false, this._currentStrokeColor, this._currentStrokeJoin, this._currentStrokeWidth)
        )
    }

    //todo dont redraw the entire thing evry tim
    private redraw(): void{
        //this._canvasContext.clearRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height)
        
        this._canvasClicks.forEach((canvasClick, i) => {
            const x_pos = canvasClick.x_pos
            const y_pos = canvasClick.y_pos
            const dragging = canvasClick.dragging
            const prevClick = this._canvasClicks[i-1]

            this._canvasContext.beginPath()
            if(dragging && i){
                this._canvasContext.moveTo(prevClick.x_pos, prevClick.y_pos)
            } else {
                this._canvasContext.moveTo(x_pos-1, y_pos)
            }

            this._canvasContext.lineTo(x_pos, y_pos)
            this._canvasContext.closePath()
            this._canvasContext.strokeStyle = canvasClick.color
            this._canvasContext.lineWidth = canvasClick.width
            this._canvasContext.lineJoin = canvasClick.shape
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
