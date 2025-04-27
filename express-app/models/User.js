const mongoose = require('mongoose');

// 스키마 정의
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // id
  password: { type: String, required: true }, // pw
  name : { type: String },                    // name
  phone : { type: String },                   // phone
  email : { type: String, unique: true}       // email
});

// 정의한 모델 export
module.exports = mongoose.model('User', userSchema);
