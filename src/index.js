require('dotenv').config();

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
	pingTimeout: 30000,
	pingInterval: 30000
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo/bochkogram').then(() => console.log('MongoDB is connected'));

const Message = mongoose.model(
	'Message',
	new mongoose.Schema({
		author: String,
		text: String,
		color: String,
		date: Date
	})
);

const loadMessages = () => {
	Message.find({}).exec((error, res) => {
		if (error) {
			console.log('Error', error);
			io.emit('error', error);
		}
		else {
			io.emit('load messages', res);
		}
	})
};

io.on('connection', socket => {
	loadMessages();

	socket.on('add message', newMessage => {
		const message = new Message({
			author: newMessage.author,
			text: newMessage.text,
			color: newMessage.color,
			date: new Date()
		});

		message.save(error => {
			if (error) {
				console.log('Error', error);
			}

			loadMessages();
		});
	});

	socket.on('i need messages', () => {
		loadMessages();
	});
});

http.listen(7000, function() {
	console.log('listening on *:7000');
});
