const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
});

let messages = [];

io.on('connection', socket => {
    console.log('New client connected');
    io.emit('retrieveMessages', messages);
    socket.on('sendMessage', (message, callback) => {
        if (message.message.length === 0) return io.emit('error', 'Message is empty');
        if (message.sender.length === 0) return io.emit('error', 'Username is empty');
        messages.push(message);
        io.emit('message', message);
        callback();
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
