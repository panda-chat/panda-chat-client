export class KeyService implements IKeyService {
    public getKeyPressed(key: KEYS, e: KeyboardEvent): boolean { 
       if (e.keyCode == key) {            
            return false
        } else {
            return true
        }
    }
}

export interface IKeyService {
    getKeyPressed(key: KEYS, e: KeyboardEvent): boolean
}

export enum KEYS {
    ENTER = 13
}