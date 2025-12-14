export interface Logger {
    debug(msg: string, ...args: any[]): void;

    info(msg: string, ...args: any[]): void;

    warn(msg: string, ...args: any[]): void;

    error(msg: string, ...args: any[]): void;
}

export class DefaultLogger implements Logger {

    logger: Logger

    constructor(logger?: Logger) {
        this.logger = logger ?? console;
    }

    debug(msg: string, ...args: any[]) {
        this.logger.debug(msg, ...args);
    }

    info(msg: string, ...args: any[]) {
        this.logger.info(msg, ...args);
    }

    warn(msg: string, ...args: any[]) {
        this.logger.warn(msg, ...args);
    }

    error(msg: string, ...args: any[]) {
        this.logger.error(msg, ...args);
    }
}

export const Logger: Logger = new DefaultLogger();