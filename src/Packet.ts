/**
 * A packet
 */
export class Packet {
    readonly #buffer: Buffer;

    /**
     * Create a new packet
     * @param buffer The packet data. Use `Buffer.alloc(0)` or leave empty if you plan to write a packet
     */
    public constructor(buffer: Buffer = Buffer.alloc(0)) {
        this.#buffer = buffer;
    }

    /**
     * Get packet data
     */
    public buffer(): Buffer {
        return this.#buffer;
    }

    /**
     * Check if this packet is complete
     *
     * A VarInt is read from the beginning of the packet and compared to the packet's current buffer length.
     */
    public isComplete(): boolean {
        return this.buffer().byteLength === Packet.readVarInt(this.buffer()).value;
    }

    /**
     * Parse VarInt from the beginning of a buffer
     * @param data
     * @param offset
     */
    public static readVarInt(data: Buffer, offset: number = 0): Packet.ParseResult<number> {
        let value = 0;
        let shift = 0;
        let byte = 0;
        let index = offset;

        do {
            byte = data[index++]!;
            value += (byte & 0x7F) << shift;
            shift += 7;
        } while (byte & 0x80);

        return new Packet.ParseResult(value, index - offset);
    }

    /**
     * Write VarInt
     * @param value
     */
    public static writeVarInt(value: number): Buffer {
        const buffer = Buffer.alloc(5);
        let index = 0;

        while (true) {
            let byte = value & 0x7F;
            value >>>= 7;

            if (value !== 0) {
                byte |= 0x80;
            }

            buffer[index++] = byte;

            if (value === 0) {
                break;
            }
        }

        return buffer.subarray(0, index);
    }
}

export namespace Packet {
    export class ParseResult<T> {
        constructor(
            public readonly value: T,
            public readonly length: number
        ) {}
    }
}
