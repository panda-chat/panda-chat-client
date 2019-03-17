import { ILogManager, LogManager } from  "../logManager"
import { PandaMessage } from "../models/pandaMessage";

const SCROLL_TOLERANCE = 20

export class DomService implements IDomService {
    private readonly _messagesContainer: HTMLElement
    private readonly _logManager: ILogManager
    private readonly _document: Document

    private _scrolledToBottom: boolean = true

    /* 
    Dom service is initialized for general listeners on the page (e.g. scroll to bottom of messages),
    and is responsible for receiving messages to attach to the dom.
    */
    constructor() {
        this._document = document
        this._messagesContainer = this._document.getElementById("chat-container-message-history")
        this._logManager = new LogManager()
        this._messagesContainer.addEventListener("scroll", () => {
            this._scrolledToBottom = this.checkScrolledToBottom();
        })        
    }
    public addMessageToContainer(messageEvent: MessageEvent): void {
        //todo: types
        let message: PandaMessage = JSON.parse(messageEvent.data)
        let node: HTMLElement
        if (message.image) {            
            node = this.createImageNode(message.sender, message.image.url)
        }
        else {
            node = this.createTextNode(message.sender, message.text)
        }
        this._messagesContainer.appendChild(node)
        this.scrollToBottom()
    }

    private checkScrolledToBottom(): boolean {
        return (this._messagesContainer.scrollTop + this._messagesContainer.clientHeight + SCROLL_TOLERANCE) >= this._messagesContainer.scrollHeight;
    }

    private scrollToBottom() {
        if (this._scrolledToBottom) { // Keep scrolled to the bottom if it already is.
            setTimeout(() => {
                this._messagesContainer.scrollTop = this._messagesContainer.scrollHeight - this._messagesContainer.clientHeight
            }, 20)
        }
    }

    private createImageNode(sender: string, src: string): HTMLElement {
        let node = this._document.createElement("div")
        node.appendChild(this._document.createTextNode(`${sender} :`))
        let img_node = this._document.createElement("img")
        img_node.setAttribute("src", src)
        // img_node.setAttribute("width", message.image.width)
        // img_node.setAttribute("height", message.image.height)
        node.appendChild(img_node)
        return node        
    }

    private createTextNode(sender: string, text: string): HTMLElement {
        let node = this._document.createElement("p")
        let text_node = this._document.createTextNode(`${sender} : ${text}`)
        node.appendChild(text_node)
        this._messagesContainer.appendChild(node)
        return node
    }

}

export interface IDomService {
    addMessageToContainer(message: MessageEvent): void
}