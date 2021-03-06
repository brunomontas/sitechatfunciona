var app = require('express')();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("Server running...");




app.get('/', function(req, res) {
    res.sendFile((__dirname + '/index.html'));
});

app.get('/sobre', function(req, res) {
    res.sendFile((__dirname + '/sobre.html'));
});

app.get('/protocolo', function(req, res) {
    res.sendFile((__dirname + '/protocolo.html'));
});

app.get('/chat', function(req, res) {
    res.sendFile((__dirname + '/chat.html'));
});

app.get('/privateDiana', function(req, res) {
    res.sendFile((__dirname + '/privateDiana.html'));
});


io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    io.sockets.emit('get users', users);

    

    // Disconnect
    socket.on('disconnect', function(data){
        if(socket.username){
            console.log('warning')
            users.splice(users.indexOf(socket.username), 1);
            updateUsernames();
        }
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s socket connected', connections.length)

    });
    // Send message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    // New User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

});

