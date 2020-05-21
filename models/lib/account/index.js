module.exports = (schemaObj) => {
	let methodGroup = [
		require("./auth"),
		require("./helper"),
		require("./profile")
	];

	// IF USING OBJ INSTEAD OF ARRAY
	// Object.getOwnPropertyNames(methodGroup).forEach(group => {
	// 	Object.getOwnPropertyNames(group).forEach(method => {
	// 		let methodObj = group[method];
	// 		// schemaObj.statics[methodObj.name] = methodObj.get();
	// 		console.log(methodObj);
	// 	});
	// });

	methodGroup.forEach(group => {
		let methodsInGroup = Object.getOwnPropertyNames(group);
		methodsInGroup.forEach(method => {
			schemaObj.statics[method] = group[method];
		});
	});
};