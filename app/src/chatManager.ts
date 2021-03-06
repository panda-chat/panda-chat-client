import { LogManager } from "./logManager"
import { NotificationManager } from "./notificationManager"
import { settings } from "./settings";

const SCROLL_TOLERANCE = 20

export class ChatManager {
    private readonly _logManager: LogManager
    private readonly _notificationManager: NotificationManager
    
    private _scrolledToBottom: boolean = true
    private _request: XMLHttpRequest
    private _socket: WebSocket = null
    private _messages: any
    private _img_blob: Blob    
    
    private _chatContainerTextArea = document.getElementById('chat-container-textarea')
    private _chatContainerMessageHistory = document.getElementById("chat-container-message-history")

    constructor() {
        this._notificationManager = new NotificationManager()
        this._logManager = new LogManager()
        this._request = new XMLHttpRequest()
        this._socket = window.location.host ? new WebSocket(settings.websocketEndpoint) : null
    }

    public init() {
        this._messages = this._chatContainerMessageHistory
        this._messages.addEventListener("scroll", () => {
            this._scrolledToBottom = (this._messages.scrollTop + this._messages.clientHeight + SCROLL_TOLERANCE) >= this._messages.scrollHeight
        })

        //todo please reformat me please
        this.startChat()

        if(this._socket){
            this._socket.onmessage = (event) => {
                this.addTextNode(JSON.parse(event.data))
                this._notificationManager.notify()
            }
            this._socket.onclose = (event) => {
                this.checkSocket()
            }
        }

        setInterval(() => {this.checkSocket()}, 5000)

        this._chatContainerTextArea.onkeypress = (e) => this.onMessageKeyPress(e)

        //todo implement this in the image manager
        //Code for copying from clipboard taken from here - https://stackoverflow.com/a/15369753
        this._chatContainerTextArea.onpaste = (event: any) => {
            // use event.originalEvent.clipboard for newer chrome versions
            var items = (event.clipboardData  || event.originalEvent.clipboardData).items
            // find pasted image among pasted items
            let blob: Blob = null
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") === 0) {
                    blob = items[i].getAsFile()
                }
            }
            // load image if there is a pasted image
            if (blob !== null) {
                var reader = new FileReader()
                reader.onload = (event) => {
                    document.getElementById("image-box").setAttribute('src', (<any>event.target).result)
                    this._img_blob = blob
                }
                reader.readAsDataURL(blob)
            }
        }

        this._notificationManager.init()
    }

    public sendImageBlob(blob: Blob) {
        this._img_blob = blob
        this.sendMessage(true)
    }

    private checkSocket() {
        if (!this._socket || this._socket.readyState == WebSocket.CLOSED) {
            this.startChat()
        }
    }

    private startChat() {
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._request.onreadystatechange = () => this.onReadyState()

            try{
                this._request.open("GET", settings.messagesEndpoint, false)
                this._request.send()
            }
            catch(e) {
                this._logManager.warn("cannot make connection to messages endpoint")
                this._logManager.warn(e)
            }
        }
    }

    private onReadyState() {
        if (this._request.readyState == 4 && this._request.status == 200) {
            let response = JSON.parse(this._request.responseText)
            this.clearChat()
            // Response is in reverse chronological order.
            for (let i = response.length - 1; i >= 0; i--) {
                this.addTextNode(response[i])
            }
        }
    }

    private clearChat() {
        while (this._messages.firstChild) {
            this._messages.removeChild(this._messages.firstChild)
        }
    }

    private addTextNode(message: any) {
        if (message.image) {
            let node = document.createElement("div")
            let text_node = document.createTextNode(message.sender + ":")
            node.appendChild(text_node)
            let img_node = document.createElement("img")
            img_node.setAttribute("src", message.image.url)
            img_node.setAttribute("width", message.image.width)
            img_node.setAttribute("height", message.image.height)
            node.appendChild(img_node)
            this._messages.appendChild(node)
        }
        else {
            let node = document.createElement("p")
            let text_node = document.createTextNode(message.sender + ": " + message.text)
            node.appendChild(text_node)
            this._messages.appendChild(node)
        }
        if (this._scrolledToBottom) { // Keep scrolled to the bottom if it already is.
            setTimeout(() => {
                this._messages.scrollTop = this._messages.scrollHeight - this._messages.clientHeight
            }, 20)
        }
    }

    private onMessageKeyPress(e: KeyboardEvent) {
        let key = e.keyCode
        if (key == 13) {
            this.sendMessage(false)
            return false
        } else {
            return true
        }
    }

    public sendChatMessage() {
        this.sendMessage()
    }

    private sendMessage(ignoreMessage?: boolean) {
        let msg = (<HTMLInputElement>this._chatContainerTextArea).value
        if (msg && !ignoreMessage) {
            this._socket.send(msg);
            (this._chatContainerTextArea as HTMLInputElement).value = ''
        }
        if (this._img_blob != null) {
            this._socket.send(this._img_blob)
            //document.getElementById("image-box").setAttribute('src', '')
            this._img_blob = null
        }
    }
}

export interface IChatManager {
    init(): void
}
