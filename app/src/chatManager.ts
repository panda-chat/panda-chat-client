import { LogManager } from "./logManager"
import { NotificationManager } from "./notificationManager"
import { WebsocketService } from "./services/websocketService";

const SCROLL_TOLERANCE = 20

export class ChatManager {
    private readonly _logManager: LogManager
    private readonly _notificationManager: NotificationManager
    private readonly _websocketService: WebsocketService
    
    private _scrolledToBottom: boolean = true
    private _messagesContainer = document.getElementById("chat-container-message-history")
    //private _img_blob: Blob   
    
    private _chatContainerTextArea = document.getElementById('chat-container-textarea')

    constructor() {
        this._notificationManager = new NotificationManager()
        this._logManager = new LogManager()
        this._websocketService = new WebsocketService()
    }

    public init() {
        this._messagesContainer.addEventListener("scroll", () => {
            this._scrolledToBottom = (this._messagesContainer.scrollTop + this._messagesContainer.clientHeight + SCROLL_TOLERANCE) >= this._messagesContainer.scrollHeight
        })

        this._websocketService.connect((ev: MessageEvent) => this.addTextNode(ev))
        this._notificationManager.init()
    }

    // public sendImageBlob(blob: Blob) {
    //     this._img_blob = blob
    //     this.sendMessage(true)
    // }

    private addTextNode(messageEvent: MessageEvent) {
        let message = JSON.parse(messageEvent.data)
        if (message.image) {
            let node = document.createElement("div")
            let text_node = document.createTextNode(message.sender + ":")
            node.appendChild(text_node)
            let img_node = document.createElement("img")
            img_node.setAttribute("src", message.image.url)
            img_node.setAttribute("width", message.image.width)
            img_node.setAttribute("height", message.image.height)
            node.appendChild(img_node)
            this._messagesContainer.appendChild(node)
        }
        else {
            let node = document.createElement("p")
            let text_node = document.createTextNode(message.sender + ": " + message.text)
            node.appendChild(text_node)
            this._messagesContainer.appendChild(node)
        }
        if (this._scrolledToBottom) { // Keep scrolled to the bottom if it already is.
            setTimeout(() => {
                this._messagesContainer.scrollTop = this._messagesContainer.scrollHeight - this._messagesContainer.clientHeight
            }, 20)
        }
    }

    // private onMessageKeyPress(e: KeyboardEvent) {
    //     let key = e.keyCode
    //     if (key == 13) {
    //         this.sendMessage()
    //         return false
    //     } else {
    //         return true
    //     }
    // }

    public sendChatMessage(message: string) {
        this.sendMessage(message)
    }

    private sendMessage(message: string) {
        //let msg = (this._chatContainerTextArea as HTMLInputElement).value
        if (message) {
            this._websocketService.sendMessage(message);
            (this._chatContainerTextArea as HTMLInputElement).value = ''
        }
        // if (this._img_blob != null) {
        //     this._socket.send(this._img_blob)
        //     document.getElementById("image-box").setAttribute('src', '')
        //     this._img_blob = null
        // }
    }
}

export interface IChatManager {
    init(): void
}