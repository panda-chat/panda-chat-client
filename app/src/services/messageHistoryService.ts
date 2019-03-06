import { LogManager } from "../logManager"
import { MESSAGES_ENDPOINT } from "../settings"
import { HttpService } from "./httpService"

export class MessageHistoryService implements IMessageService {

    private _logManager: LogManager
    private _httpService: HttpService
    
    constructor() {
        this._logManager = new LogManager
        this._httpService = new HttpService
    }

    public async getMessageHistory(numberOfMessages: number) {   
        return await this._httpService.get(MESSAGES_ENDPOINT)
    }
}

export interface IMessageService {
    getMessageHistory(numberOfMessages: number): any
}