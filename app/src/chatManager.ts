import { LogManager, ILogManager } from "./logManager"
import { NotificationManager, INotificationManager } from "./notificationManager"
import { WebsocketService, IWebsocketService } from "./services/websocketService";
import { IDomService, DomService } from "./services/domService";
import { KeyService, IKeyService, KEYS } from "./services/keyService";

export class ChatManager {
    private readonly _logManager: ILogManager
    private readonly _notificationManager: INotificationManager
    private readonly _websocketService: IWebsocketService
    private readonly _domService: IDomService
    private readonly _keypressService: IKeyService
    
    private _chatContainerTextArea: HTMLInputElement        
    private _chatContainerSendButton: HTMLElement

    /* 
    Chat Manager is the orchestrator between the user's interaction with the chat and
    the websocket service as well as the dom service to display the messages to the user
    */
    constructor() {
        this._notificationManager = new NotificationManager()
        this._logManager = new LogManager()
        this._websocketService = new WebsocketService()
        this._keypressService = new KeyService()
        this._domService = new DomService()
    }

    public init() {
        this._chatContainerTextArea = document.getElementById('chat-container-textarea') as HTMLInputElement
        this._chatContainerSendButton = document.getElementById('chat-container-send-button')

        this._websocketService.connect((ev: MessageEvent) => this._domService.addMessageToContainer(ev))
        this._notificationManager.init()

        this._chatContainerTextArea.onkeypress = (e) => {
            if (this._keypressService.getKeyPressed(KEYS.ENTER, e)) {
               this.sendMessage()
            }
        }

        this._chatContainerSendButton.addEventListener('click', (ev) => {
            this.sendMessage()
        })
    }
    
    private sendMessage() {
        let msg = this._chatContainerTextArea.value
        if (msg) {
            //send message triggers the websocket event that will write the message to the dom container
            this._websocketService.sendMessage(msg)
            this._chatContainerTextArea.value = ''
        }
    }
}

export interface IChatManager {
    init(): void
}