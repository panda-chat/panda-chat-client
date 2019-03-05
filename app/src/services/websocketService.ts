declare let settings: any;
import { LogManager } from "../logManager"

export class WebsocketService implements IWebsocketService{

    private _socket: WebSocket
    private _logManager: LogManager

    constructor() {
        this._logManager = new LogManager
    }

    //todo types
    public connect = (messageHandler: any, errorHandler?: any): void => {
        this.createSocket(messageHandler, errorHandler)
        setInterval(() => {this.createSocket(messageHandler, errorHandler)}, 5000)
    }

    public sendMessage = (message: string) => {
        if(this._socket) {
            this._socket.send(message)
        } else{
            this._logManager.warn("No socket has been created, call connect() first")
        }
    }

    private createSocket = (messageHandler: any, errorHandler?: any): void => {
        if (!this._socket || this._socket.readyState != WebSocket.OPEN) {
            this._socket = new WebSocket(settings.websocketEndpoint)

            this._socket.onmessage = (ev) => messageHandler(ev)

            this._socket.onerror = errorHandler ? errorHandler : (e) => {
                this._logManager.critical("Socket had an unexpected error", e)
            }
        }
    }
}

export interface IWebsocketService {
    connect(messageHandler: MessageEvent, errorHandler?: MessageEvent): void
}