export class LogManager implements ILogManager{
    debug(message: string) {
        this.log(message)
    }

    warn(message: string) {
        this.log(message)
    }

    info(message: string) {
        this.log(message)
    }

    private log(message: string) {
        window.console.log(message)
    }
}

export interface ILogManager {
    debug(message: string): void
    warn(message: string): void
    info(message: string): void
}