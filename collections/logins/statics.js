const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../users");
const { mongo: mongoConfig, jwt: jwtConfig } = require("../../credentials/cfg");

module.exports = {
	checkPassword: function (password, hash) {
		return bcrypt.compareSync(password, hash);
	},
	checkJwt: async function(token, userUniqid){
		
		// EXTRACT TOKEN
		token = token.split(" ")[1];

		// GET DECODED TOKEN
		let tokenDecoded = jwt.decode(token, jwtConfig.secret);

		// GET LOGIN _ID
		let user = await Users.findOne({ uniqid: userUniqid }, { _id: 1 }, { lean: true });
		if(!user) return false;
		
		// CHECK _ID AND TOKEN.UNIQID 
		return Boolean(tokenDecoded["id"] == user["_id"]);

	}
};