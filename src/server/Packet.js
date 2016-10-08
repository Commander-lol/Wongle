// @flow
import typeof { Socket } from 'net'

class Packet {
	socket: Socket
	data: Buffer

	constructor(socket: Socket, data: Buffer) {
		this.socket = socket
		this.data = data
	}
}

module.exports = Packet
