// @flow
const net = require('net')
const Packet = require('./Packet')
import type { Middleware } from '../types/Server.types'

export type ServerOptions = {
	host?: string,
	backlog?: number,
	path?: string,
	exclusive?: boolean,
}

class TcpServer {
	middleware: Array<Middleware> = []
	server: net.Server

	constructor(timeout: number = 60 * 1000) {
		this.server = net.createServer((socket) => {
			let socketIsOpen = true
			let cont = Promise.resolve(null)

			socket.on('data', (data: Buffer) => {
				const packet = new Packet(socket, data)
				for (let middleware of this.middleware) {

					cont = cont.then((abort) => socketIsOpen && new Promise(r => {
							if (abort === false) {
								r(abort)
								return
							}

							const res = middleware(packet, r)

							if (res instanceof Promise) {
								res.then(r)
							} else if (res != null && (res: any)[Symbol.iterator]) {
								for (const discarded of res) {} // Just exhaust the generator, we don't care about the values
								r(null)
							} else {
								timeout > 0 && setTimeout(() => {
									r(false)
								}, timeout)
							}
						})
					)
				}
			})

			socket.on('end', (err: boolean) => {
				socketIsOpen = false
			})
		})
	}

	use = (middleware: Middleware) => this.middleware.push(middleware)

	listen = (port: number, opts?: ServerOptions = {}) => {
		this.server.listen({
			port,
			...opts
		})
	}
}

module.exports = TcpServer
