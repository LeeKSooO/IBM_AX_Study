// mongoose는 mongoDB를 쉽게 다룰 수 있도록 도와주는 ODM(Object Document Mapper lib)
const mongoose = require('mongoose');

// Connect DB
mongoose.connect('mongodb://127.0.0.1:27017/myDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connection Success!'))
.catch(err => console.log('MongoDB Connection Failed', err));