const mongoose = require('mongoose');

var profileSchema = {
    first_name: String,
    last_name: String,
    email: {
        type: String,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
        lowercase: true
    },
    gender: {
        type: String,
        enum: ['m', 'f']
    },
    friendship: [mongoose.ObjectId]
}

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;