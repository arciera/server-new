import EnhancedSwitch from "enhanced-switch";

/**
 * A logger for printing messages into the console
 */
export class Logger {
    /**
     * Create new logger
     * @param name The name of the logger
     * @param level Minimum log level required to display the message. Defaults to {@link Logger.Level.INFO}
     */
    public constructor(
        /**
         * The name of the logger
         */
        private readonly name: string,
        /**
         * Minimum log level required to display the message. Defaults to {@link Logger.Level.INFO}
         */
        private level: Logger.Level = Logger.Level.INFO
    ) {}

    private formatError(e: Error) {
        let text = (e.stack ?? e.message);
        if (e.cause instanceof Error)
            text += "\nCaused by: " + this.formatError(e.cause);
        return text;
    }

    private format(level: Logger.Level, message: string, error?: Error) {
        const levelName = new EnhancedSwitch<Logger.Level, string>(level)
            .case(Logger.Level.DEBUG, "DEBUG")
            .case(Logger.Level.INFO, "INFO")
            .case(Logger.Level.WARN, "WARN")
            .case(Logger.Level.ERROR, "ERROR")
            .case(Logger.Level.FATAL, "FATAL")
            .default("UNKNOWN", true);
        const color = new EnhancedSwitch<Logger.Level, string>(level)
            .case(Logger.Level.WARN, Logger.ansi.format.bold + Logger.ansi.color.gold)
            .case(Logger.Level.ERROR, Logger.ansi.format.bold + Logger.ansi.color.red)
            .case(Logger.Level.FATAL, Logger.ansi.format.bold + Logger.ansi.color.dark_red)
            .default("", true);
        const time = new Date().toLocaleTimeString();
        const text = message + (error ? "\n" + Logger.ansi.format.end.bold + this.formatError(error) : "");
        return `${color}[${time} ${levelName}]: [${this.name}] ${text}`;
    }

    public log(level: Logger.Level, message: string, error?: Error) {
        if (level < this.level) return;
        process.stdout.write(this.format(level, message, error) + Logger.ansi.reset + "\n");
    }

    public debug(message: string, error?: Error) {
        this.log(Logger.Level.DEBUG, message, error);
    }

    public info(message: string, error?: Error) {
        this.log(Logger.Level.INFO, message, error);
    }

    public warn(message: string, error?: Error) {
        this.log(Logger.Level.WARN, message, error);
    }

    public error(message: string, error?: Error) {
        this.log(Logger.Level.ERROR, message, error);
    }

    public fatal(message: string, error?: Error) {
        this.log(Logger.Level.FATAL, message, error);
    }
}

export namespace Logger {
    /**
     * Log message level
     */
    export enum Level {
        DEBUG = 0,
        INFO = 1,
        WARN = 2,
        ERROR = 3,
        FATAL = 4
    }

    export const ansi = {
        reset: "\x1b[0m",
        format: {
            bold: "\x1b[1m",
            dim: "\x1b[2m",
            italic: "\x1b[3m",
            underline: "\x1b[4m",
            strike: "\x1b[9m",
            end: {
                bold: "\x1b[22m"
            }
        },
        color: {
            black: "\x1b[38;5;16m",
            dark_blue: "\x1b[34m",
            dark_green: "\x1b[32m",
            dark_aqua: "\x1b[36m",
            dark_red: "\x1b[31m",
            dark_purple: "\x1b[35m",
            gold: "\x1b[33m",
            gray: "\x1b[37m",
            dark_gray: "\x1b[90m",
            blue: "\x1b[94m",
            green: "\x1b[92m",
            aqua: "\x1b[96m",
            red: "\x1b[91m",
            light_purple: "\x1b[95m",
            yellow: "\x1b[93m",
            white: "\x1b[97m",
        }
    } as const;
}
