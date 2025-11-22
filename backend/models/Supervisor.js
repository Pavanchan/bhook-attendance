const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true }
});

module.exports = mongoose.model('Supervisor', supervisorSchema);
