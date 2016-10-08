const TcpServer = require('../server/TcpServer')

const server = new TcpServer(2000)

server.use((packet, next) => {
	console.log("YES")
	next()
})

server.use(packet => {
	console.log(packet.data)
	packet.scratch = {message: 'hello'}
	return new Promise(r => setTimeout(r, 5000))

})

server.use((packet) => {
	console.log("well that was a wait")
	console.log(packet.scratch)
})

server.listen(3123)