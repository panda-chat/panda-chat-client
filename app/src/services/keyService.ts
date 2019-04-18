export class KeyService implements IKeyService {
    public getKeyPressed(key: KEYS, e: KeyboardEvent): boolean { 
        return e.keyCode === key
    }
}

export interface IKeyService {
    getKeyPressed(key: KEYS, e: KeyboardEvent): boolean
}

export enum KEYS {
    ENTER = 13
}