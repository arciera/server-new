import net from "node:net";
import {ConnectedEvent} from "./event/ConnectedEvent";
import {Connection} from "./Connection";
import {ServerListeningEvent} from "./event/ServerListeningEvent";
import {PluginManager} from "./PluginManager";
import {ConnectionEndEvent} from "./event/ConnectionEndEvent";
import {IncomingDataEvent} from "./event/IncomingDataEvent";
import {EventEmitter} from "./EventEmitter";
import {ConnectionManager} from "./ConnectionManager";

/**
 * Arciera server
 */
export class Server extends EventEmitter {
    /**
     * Create new server
     * @param port port on which the server is listening for connections
     */
    public constructor(
        /**
         * Port on which the server is listening for connections
         */
        public readonly port: number
    ) {
        super();
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
