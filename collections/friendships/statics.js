module.exports = {
	parseFriendships: async function ({ referrerUniqid, referrerName }, nFriendships) {

		// BUILD PIPELINES
		let pipelines = [{
			$match: { users: referrerUniqid }
		}, {
			$sort: { is_accepted: -1 }
		}, {
			$limit: nFriendships
		}, {
			$project: {
				_id: 0,
				uniqid: 1,
				user: { $arrayElemAt: [{ $filter: { input: "$users", as: "user", cond: { $ne: ["$$user", referrerUniqid] } } }, 0] },
				name: { $arrayElemAt: [{ $filter: { input: "$names", as: "name", cond: { $ne: ["$$name", referrerName] } } }, 0] }
			}
		}];

		// AGGREGATE FRIENDSHIPS
		let friendships = await this.aggregate(pipelines);

		return friendships;

	}
};