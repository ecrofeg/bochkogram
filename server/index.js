var app = require("express")();
var http = require("http").Server(app);

var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/telesram");

const Message = mongoose.model("Message", {
  author: String,
  text: String,
  color: String,
  date: Date
});

const loadMessages = socket => {
  Message.find({}).exec((error, res) => socket.emit("load messages", res));
};

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  loadMessages(socket);

  socket.on("add message", newMessage => {
    const message = new Message({
      author: newMessage.author,
      text: newMessage.text,
      color: newMessage.color,
      date: new Date()
    });

    message.save(() => loadMessages(socket));
  });
});

http.listen(7000, function() {
  console.log("listening on *:7000");
});
