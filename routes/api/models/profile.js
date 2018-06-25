const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function(){
	const message_type = {
							text : String,
							homosexual_text : String,
							emotion :
							{
								type : String,
								enum : ['anger', 'disgust', 'fear', 'happiness', 'sadness', 'surprise', 'neutral'],
								default : 'neutral'
							}
						}
	let message_with_exit_type = {};
	Object.assign(message_with_exit_type,message_type);
	message_with_exit_type.exit = { type : Boolean, default : false }


	const profileSchema = mongoose.Schema(
	{
		author : {type : Schema.Types.ObjectId, required:true},
		published : { type : Boolean, required : true, defaults : false },
		title : { type : String, required : true},
		language : { type : String, enum : ['fr', 'en'], 	required : true},
		gender :
			{
				type : String,
				enum : ['m', 'f'],
				required : true
			},
		age : String,
		name : String,
		profession : String,
		quote : String,
		hobby : String,
		movie : String,
		target : String,
		discussion :
			{
				normal_flow :
					[{
						question : message_type,
						answers :
						[{
							user_answer : message_type,
					        profile_answer : message_with_exit_type
						}]
					}],
				answer_after_phone_number : message_type,
				answer_exit_on_lies : message_type
			}

	})


	return mongoose.model("Profile", profileSchema);
}
