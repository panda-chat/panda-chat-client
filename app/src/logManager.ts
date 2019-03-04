export class LogManager implements ILogManager{
    debug(message: string, exception?: any | null) {
        this.log(message, exception)
    }

    warn(message: string, exception?: any | null) {
        this.log(message, exception)
    }

    info(message: string, exception?: any | null) {
        this.log(message, exception)
    }

    critical(message: string, exception?: any | null) {
        this.log(message, exception)
    }

    private log(message: string, exception?: any | null) {
        window.console.log(message)
        if(exception) {
            window.console.dir(exception)
        }
    }
}

export interface ILogManager {
    debug(message: string, exception?: any): void
    warn(message: string, exception?: any): void
    info(message: string, exception?: any): void
    critical(message: string, exception?: any): void
}