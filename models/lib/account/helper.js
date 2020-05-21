let functions = {
	getNameByUniqid: async function(uniqid){
		let name = await this.findOne({ uniqid: uniqid }, { _id: 0, first_name: 1, last_name: 1 });
		return `${name.first_name} ${name.last_name}`;
	},
	getIndexByUniqid: function(array, value){
		return array.findIndex((element) => {
			return element.uniqid === value;
		});
	}
};

module.exports = {
	getNameByUniqid: functions["getNameByUniqid"],
	getIndexByUniqid: functions["getIndexByUniqid"]
};