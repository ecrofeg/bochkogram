require('dotenv').config();

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/bochkogram').then(() => console.log('MongoDB is connected'));

const Message = mongoose.model(
	'Message',
	new mongoose.Schema({
		author: String,
		text: String,
		color: String,
		date: Date
	})
);

const loadMessages = () => Message.find({}).exec((error, res) => io.emit('load messages', res));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
	loadMessages();

	socket.on('add message', newMessage => {
		const message = new Message({
			author: newMessage.author,
			text: newMessage.text,
			color: newMessage.color,
			date: new Date()
		});

		message.save().then(() => loadMessages());
	});
});

http.listen(7000, function() {
	console.log('listening on *:7000');
});
