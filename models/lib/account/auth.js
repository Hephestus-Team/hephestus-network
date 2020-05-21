const bcrypt = require("bcrypt"), uniqid = require("uniqid"), jwt = require("jsonwebtoken");

let functions = {
	setHash: function (password) { return bcrypt.hashSync(password, 10); },
	verifyHash: function (password, hash) { return bcrypt.compareSync(password, hash); },
	setUniqid: function (type) {
		if (type === "user") {
			return uniqid();
		} else if (type === "post") {
			return uniqid.time();
		} else {
			throw new Error("Cannot proccess type");
		}
	},
	getJwtPayload: function(header_token){
		let token = header_token.split(" ")[1];
		return jwt.verify(token, require("../../../credentials/cfg").jwt.jwtSecret).id;
	}
};

// module.exports = {
// 	setHash: {
// 		name: "setHash",
// 		get: () => functions[this.name]
// 	},
// 	verifyHash: {
// 		name: "verifyHash",
// 		get: () => functions[this.name]
// 	},
// 	setUniqid: {
// 		name: "setUniqid",
// 		get: () => functions[this.name]
// 	},
// 	getJwtPayload: {
// 		name: "getJwtPayload",
// 		get: () => functions[this.name]
// 	}
// };

module.exports = {
	setHash: functions["setHash"],
	verifyHash: functions["verifyHash"],
	setUniqid: functions["setUniqid"],
	getJwtPayload: functions["getJwtPayload"]
};