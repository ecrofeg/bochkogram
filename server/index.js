require('dotenv').config();

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const mongoose = require('mongoose');

mongoose.connect('mongodb://root:example@mongo/bochkogram').then(() => console.log('MongoDB is connected'));

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
			console.log('Loading messages');
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
});

http.listen(7000, function() {
	console.log('listening on *:7000');
});
