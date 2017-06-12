const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('lodash');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const {User} = require('../models/User');
const {Message} = require('../models/Messages');

io.on('connection', passport.authenticate('jwt', {session: false}), function (socket) {

  			socket.on('chat-list',(data) => {
  					User.findById(data.userId).then((err, UserInfoResponse)=>{
  						User.find({'online': true , socketId : { $ne : userId }}).then((err, response) =>{

  							io.to(socket.id).emit('chat-list-response',{
  								error : false ,
  								singleUser : false ,
  								chatList : response
  							});

  							socket.broadcast.emit('chat-list-response',{
  								error : false ,
  								singleUser : true ,
  								chatList : UserInfoResponse
  							});

  						});
  					});
  		   });

        socket.on('add-message', (data) => {
  				if (data.message === '') {
  					this.io.to(socket.id).emit(`add-message-response`,`Message cant be empty`);
  				}else if(data.fromUserId === ''){
  					this.io.to(socket.id).emit(`add-message-response`,`Unexpected error, Login again.`);
  				}else if(data.toUserId === ''){
  					this.io.to(socket.id).emit(`add-message-response`,`Select a user to chat.`);
  				}else{
  					let toSocketId = data.toSocketId;
  					let fromSocketId = data.fromSocketId;

            let message = new Message({
              from_user: fromSocketId,
              to_user: toSocketId,
              message: data.message
            });
  					message.save().then((error, response)=>{
  						io.to(toSocketId).emit(`add-message-response`,data);
  					});
  				}
		    });

        socket.on('disconnect', ()=>{
    				socket.broadcast.emit('chat-list-response',{
    					error : false ,
    					userDisconnected : true ,
    					socketId : socket.id
    				});
		    });
});

io.use(function (socket, next) {
    let userID = socket.request._query.userId;
    let userSocketId = socket.id;
    const data = {
        _id: userID,
        value: {
            $set: {
                socketId: userSocketId,
                online: 'Y'
            }
        }
    };

    User.addSocketId(data, (error, response) => {});
    next();
});



router.get('/getmessages', passport.authenticate('jwt', {session: false}), (req, res) => {
    const from = req.user._id;
    const to = req.query.to;
    Message.getMessages(from, to, (err, messages) => {
        if (err) {
            res.status(400).json({success: false, message: 'Server error', error: err});
        } else {
            res.status(200).json({success: true, messages: messages});
        }
    });
});

module.exports = router;

server.listen(2000, () => {
    console.log('Socket server on port 2000');
});
