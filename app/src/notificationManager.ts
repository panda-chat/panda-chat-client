import { LogManager } from "./logManager"

export class NotificationManager implements INotificationManager{ 
    private readonly _logManager: LogManager
    private readonly _documentTitle = "Panda Chat"
    private numberOfUnreadMessages: number

    constructor() {
        this._logManager = new LogManager()
        this.numberOfUnreadMessages = 0
    }

    public init() {
        window.addEventListener("focus", () => {
            this.markRead()
        })
    }

    public notify() {
        if(document.hasFocus()) {
            this.markRead()
        }
        else {
            this.numberOfUnreadMessages++
            document.title = `(${this.numberOfUnreadMessages}) - ${this._documentTitle}`
        }
    }

    public markRead() {
        this.numberOfUnreadMessages = 0
        document.title = this._documentTitle
    }
}

export interface INotificationManager {
    init(): void
    notify(): void
    markRead(): void
}
