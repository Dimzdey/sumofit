const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('lodash');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const {User} = require('../models/User');
const {Message} = require('../models/Messages');

io.on('connection', function (socket) {

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
                online: true
            }
        }
    };

    User.addSocketId(data, (error, response) => {});
    next();
});



router.post('/getmessages', passport.authenticate('jwt', {session: false}), (req, res) => {
    const from = req.user._id;
    const to = req.body.toUser;
    const data = {
	        '$or' : [
	        	{ '$and': [
	        			{
	        				'to_user': from
	        			},{
	        				'from_user': to
	        			}
	        		]
	        	},{
	        		'$and': [
	        			{
	        				'to_user': to
	        			}, {
	        				'from_user': from
	        			}
	        		]
	        	},
	        ]
	    };
    Message.find(data).populate(['from_user', 'to_user']).then((messages) => {
            res.status(200).json({success: true, messages: messages});
    });
});

router.get('/getchatlist', passport.authenticate('jwt', {session: false}), (req, res) => {
    const from = req.user._id;
    const data = [
    {
        $match: {
            '$or' : [
                {
                    'to_user': from
                },
                {
                    'from_user': from
                }
            ]
        }
    },
    {
        $project: {
            _id: 0,
            'interlocator': {
                $cond: {
                    if: {
                        $eq: ['$to_user', from]
                    },
                    then: '$from_user',
                    else: '$to_user'
                }
            }
        }
    },
    {
        $group: {
            _id: {interlocator: '$interlocator'}
        }
    },
    {
        $lookup: {
            from: 'users',
            localField: "_id.interlocator",
            foreignField: '_id',
            as: 'interlocator'
        }
    }
];
    Message.aggregate(data)
      .then((chats) => {
        var non_duplidated_data = chats.map(chat => chat.interlocator[0]);
        res.status(200).json({success: true, users: non_duplidated_data});
      }).catch((e) => {
        res.status(400).json({success: false, message: 'Server error', error: err});
      });
});

router.post('/sendmessage/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const from = req.user._id;
    const message = req.body.message;
    const to = req.params.id;
    if (!message || !to) {
      res.status(400).json({success: false, message: 'Please fill in all fields'});
    } else {
      let newMessage = new Message({
        from_user : from,
        message : message,
        to_user : to
      });
      newMessage.save().then(() => {
        res.status(200).json({success: true, message: 'You have send a private message'});
      }).catch((e) => {
        res.status(400).json({success: false, message: 'Failed to create', error: e.message});
      });
    }
});

module.exports = router;

server.listen(2000, () => {
    console.log('Socket server on port 2000');
});
