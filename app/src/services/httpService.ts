import { LogManager } from "../logManager";

export class HttpService implements IHttpService {
    private readonly _logManager: LogManager

    constructor() {
        this._logManager = new LogManager
    }

    public async get(url: string): Promise<any> {
        return await fetch(url).then((res) => {
            return res
        }).catch((ex) => {
            this._logManager.critical("error  make connection to messages endpoint", ex)
            return
        })
    }
}

export interface IHttpService {
    get(url: string): Promise<any>
}