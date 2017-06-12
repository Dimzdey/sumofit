const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from_user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },

  message : {
    type: String
  },

  to_user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },

  created_at : {
    type: Date,
    default : Date.now()
  }
});


MessageSchema.statics.getMessages = (userId, toUserId, callback) => {
		const data = {
	        '$or' : [
	        	{ '$and': [
	        			{
	        				'to_user': userId
	        			},{
	        				'from_user': toUserId
	        			}
	        		]
	        	},{
	        		'$and': [
	        			{
	        				'to_user': toUserId
	        			}, {
	        				'from_user': userId
	        			}
	        		]
	        	},
	        ]
	    };

			Message.find(data, callback);

	}

const Message = mongoose.model('Message', MessageSchema);
module.exports = {Message};
