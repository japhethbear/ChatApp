const port = 8000;
const express = require('express');
const app = express();


// Last Copy
//Commented out by RB
// const { notFound, errorHandler } = require('./error')


// cors cross-origin requests
const cors = require('cors')

// middleware for cookies
const cookieParser = require('cookie-parser');

app.use(express.json()) // to accept JSON data
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser())

//RB updated to .use and pulled back into code
// app.use(notFound);
// app.use(errorHandler);

require('dotenv').config();
require('./config/mongoose.config');
require('./routes/user.routes')(app);
require('./routes/message.routes')(app);
require('./routes/chats.routes')(app);


app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User Joined Room: ' + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit('message received', newMessageReceived)
        })
    });

    socket.off('setup', () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });

});

