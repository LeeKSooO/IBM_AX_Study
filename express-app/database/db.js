// mongoose는 mongoDB를 쉽게 다룰 수 있도록 도와주는 ODM(Object Document Mapper lib)
const mongoose = require('mongoose');
require('dotenv').config();

// Connect DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connection Success!'))
.catch(err => console.log('MongoDB Connection Failed', err));