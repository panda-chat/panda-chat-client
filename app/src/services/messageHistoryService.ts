import { LogManager } from "../logManager"
import { MESSAGES_ENDPOINT } from "../settings"
import { HttpService } from "./httpService"

export class MessageHistoryService implements IMessageService {

    private _logManager: LogManager
    private _httpService: HttpService
    
    constructor() {
        this._logManager = new LogManager()
        this._httpService = new HttpService()
    }

    public async getMessageHistory(numberOfMessages: number) {
        this._logManager.debug(`Retrieving message history from ${MESSAGES_ENDPOINT}`)   
        return await this._httpService.get(MESSAGES_ENDPOINT)
    }

    private async getMessagesSince(lastMessage: string) {   
        return await this._httpService.get(MESSAGES_ENDPOINT)
    }
}

export interface IMessageService {
    getMessageHistory(numberOfMessages: number): any
}