# Wongle
Have you ever needed a TCP server that can be configured via middleware, that might need to interchange synchronous 
and asynchronous actions on the data stream without worrying about special processing for either? 

Wanted to write TCP middleware that returns promises, uses generators or async/await, or just does its thing and carries on? 

No? 

Too bad, here's a TCP server designed to do all of those things that you just read.

## Installation

> Wongle hasn't been published to NPM just yet, a super useful middleware is still being written that will be
> bundled with it. It does stream-interrupt buffering based on supplied patterns, and it's really cool.

## Usage

You can check out `src/examples/basic` to see a working server that showcases some of the middleware types. 
Here's a theoretical example:

```js
const Server = require('wongle').TcpServer

const server = new Server(2000) // 2 second middleware timeout

server.use(async packet => {
  const message = packet.data.toString() // packet.data is a buffer containing the current packet's payload
  const userData = await fetchUserData(message)
  packet.user = userData
})

server.use((packet, next) => {
  console.log(packet.userData)
  next()
})

server.listen(3123)
```

The example does a couple of things:

- Imports the TcpServer
- Creates a server with a 2 second timeout for middleware that just hang (Default timeout is 1 minute)
- Tells the server to use an async middleware when it receives a data packet, that takes the data and uses it to fetch
 some sort of user data. The data is then added to the packet so that future middleware can access it
- Adds a second middleware that logs the user data and then (since it's synchronous) calls the next middleware. Passing false
 to the `next` call would skip any subsequent middleware, or not calling `next` would cause the request to hang for the 
 duration of the timeout specified when creating the server and then skip the following middleware
- Listens on port 3123 for TCP connections

## API

Actual docs coming soon
