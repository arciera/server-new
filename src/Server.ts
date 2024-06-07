import net from "node:net";
import {ConnectedEvent} from "./event/ConnectedEvent.js";
import {Connection} from "./Connection.js";
import {ServerListeningEvent} from "./event/ServerListeningEvent.js";
import {PluginManager} from "./PluginManager.js";
import {ConnectionEndEvent} from "./event/ConnectionEndEvent.js";
import {IncomingDataEvent} from "./event/IncomingDataEvent.js";
import {EventEmitter} from "./EventEmitter.js";
import {ConnectionManager} from "./ConnectionManager.js";
import {Logger} from "./Logger.js";

/**
 * Arciera server
 */
export class Server extends EventEmitter {
    public logger: Logger;
    /**
     * Create new server
     * @param port Port on which the server is listening for connections
     * @param logLevel Minimum log level required to display log messages
     */
    public constructor(
        /**
         * Port on which the server is listening for connections
         */
        public readonly port: number,
        logLevel: Logger.Level
    ) {
        super();
        this.logger = new Logger("Server", logLevel);
    }

    /**
     * This server's plugin manager
     */
    public plugins = new PluginManager(this);

    /**
     * This server's connection manager
     */
    public connections = new ConnectionManager(this);

    /**
     * Opens the server for connections
     */
    public async listen() {
        await new Promise(resolve => {
            this.tcpServer.once("listening", resolve);
            this.tcpServer.listen(this.port);
        });
        this.logger.info("Server listening on port " + this.port);
        this.emit(new ServerListeningEvent(this));
    }

    private tcpServer: net.Server = new net.Server(this.connectionListener.bind(this));

    private connectionListener (socket: net.Socket) {
        const connection = new Connection(this, socket);
        this.emit(new ConnectedEvent(connection));
        connection.socket.once("end", () => connection.emit(new ConnectionEndEvent(connection)));
        connection.socket.on("data", data => connection.emit(new IncomingDataEvent(connection, data)));
    }
}
