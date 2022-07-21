const uniqid = require("uniqid");
const Friendships = require("../friendships");
const jwt = require("jsonwebtoken"), { mongo: mongoConfig, jwt: jwtConfig } = require("../../credentials/cfg");

module.exports = {
	uniqid: function () {
		return uniqid();
	},
	getProfile: async function(profileUniqid) {
		
		// GET USER DATA
		let userData = await this.findOne({ uniqid: profileUniqid }, { _id: 0, birthday: 1, bio: 1 }, { lean: true });

		// GET FRIENDSHIPS
		let userFriendships = await Friendships.parseFriendships({ referrerUniqid: userData["uniqid"], referrerName: userData["name"] }, 6)
		userData["friendships"] = {...userFriendships};
		
		return userData;

	}, 
	getUser: async function(userUniqid, options) {
		// GET USER DOCUMENT
		let user = await this.findOne({ uniqid: userUniqid }, { __v: 0, bio: 0, birthday: 0, created_at: 0, gender: 0 }, { lean: true });

		// GET NAME
		user["name"] = user["first_name"] + " " + user["last_name"];

		// CHECK OPTIONS
		if(options["parseFriendships"]){
			user["friendships"] = await Friendships.find({ users: userUniqid }, { _id: 0, is_accepted: 0, __v: 0 }, { limit: 3 });
		}

		if(options["setJWT"]){
			user["token"] = "Bearer " + jwt.sign({ id: user["_id"] }, jwtConfig.secret, { expiresIn: "2d" });
		}

		delete user["_id"];
		delete user["first_name"];
		delete user["last_name"];

		return user;
	}
};