var express = require('express');
    app = express(),
    server = require('http').createServer(app).listen(8080),
    io = require('socket.io')(server),
    messages = [];


app.get('/', function(request, response){
    app.use(express.static(__dirname));
    response.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
    socket.on('userJoined', function(name){
        socket.nickname = name;
        socket.emit('showChat', messages);
        socket.broadcast.emit('chatMessage', name + ' has joined the chat.');
    });

    socket.on('message', function(message){
        socket.broadcast.emit('chatMessage', socket.nickname +' : ' + message);
        messages.push({"nickname":socket.nickname, "message": message});
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('chatMessage', socket.nickname + ' has left the chatroom.');
    });
});
console.log('We are alive!!!');
