module.exports = {
	load: (schema, schemaObj) => {
		let schemaPath = "./" + schema;
		require(schemaPath)(schemaObj);
	}
};