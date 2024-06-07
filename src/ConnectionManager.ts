import {Connection} from "./Connection.js";
import {Packet} from "./Packet.js";
import {Server} from "./Server.js";
import {IncomingDataEvent} from "./event/IncomingDataEvent.js";
import {Listener} from "./Listener.js";
import {PacketEvent} from "./event/PacketEvent.js";

/**
 * Manages active TCP connections connected to the server. Also tracks packet fragments and emits full packets when
 * complete (using {@link PacketEvent}).
 * @todo Clean up #incompletePackets when no further data is received for a while.
 */
export class ConnectionManager {
    /**
     * @internal
     */
    public constructor(server: Server) {
        // listens for incoming data from connections and emits PacketEvent when full/complete packets are received
        server.on(IncomingDataEvent, new Listener(IncomingDataEvent, e => {
            // check for previously stored packet fragment
            const partial = this.getIncompletePacket(e.connection);
            // if no previous fragment and this packet is complete, emit PacketEvent
            if (partial === null && Packet.isComplete(e.data)) {
                e.connection.emit(new PacketEvent(e.connection, new Packet(e.data)));
                return;
            }

            let d: number[] = partial !== null ? [...partial] : [];
            // add one byte to the fragment at a time, until a full/complete packet is achieved and emitted
            for (const byte of e.data) {
                d.push(byte);
                const b = Buffer.from(d);
                if (Packet.isComplete(b)) {
                    e.connection.emit(new PacketEvent(e.connection, new Packet(b)));
                    // start over to proceed with other packet data included in this IncomingDataEvent
                    d = [];
                    this.removeIncompletePacket(e.connection);
                }
            }
            // if there is remaining incomplete packet data, store it for use in future IncomingDataEvents
            if (d.length > 0) this.setIncompletePacket(e.connection, Buffer.from(d));
        }, 100));
    }

    /**
     * Map of ID to active connection
     */
    #connections: Map<string, Connection> = new Map();

    /**
     * Get a connection by ID
     * @param id Connection ID, see {@link Connection#id}
     */
    public get(id: string): Connection | null {
        return this.#connections.get(id) ?? null;
    }

    /**
     * Map of connection ID to last incomplete packet for which more data is awaited
     */
    #incompletePackets: Map<string, Buffer> = new Map();

    /**
     * Get incomplete packet by connection ID
     * @param connection
     */
    public getIncompletePacket(connection: Connection): Buffer | null {
        if (connection.id === null) return null;
        return this.#incompletePackets.get(connection.id) ?? null;
    }

    /**
     * Set new incomplete packet. Will not do anything if connection ID is null.
     * @param connection The connection
     * @param packet The incomplete packet
     */
    public setIncompletePacket(connection: Connection, packet: Buffer) {
        if (connection.id === null) return;
        this.#incompletePackets.set(connection.id, packet);
    }

    /**
     * Remove incomplete packet for this connection from the memory
     * @param connection The connection
     */
    public removeIncompletePacket(connection: Connection) {
        if (connection.id === null) return;
        this.#incompletePackets.delete(connection.id);
    }
}
