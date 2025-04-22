const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// public 폴더를 정적 파일 폴더로 설정
// 현재는 API 전용 서버로 작성하므로 주석처리
/* 
-- app.use(express.static('public'))의 목적 --
public/ 폴더를 웹에서 바로 접근 가능하게 함
웹사이트 화면을 보여주는 front-end 정적 파일이 있을 때 사용
현재는 백앤드 전용 API이므로 추후 정적 파일 제공시 활성화
*/
//app.use(express.static('public'));

// JSON 파싱 미들웨어
app.use(express.json());

// MongoDB Connect
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser:true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connection Success!'))
.catch(err => console.error('MongoDB Connection Failed'))

// 사용자 스키마 & 모델
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Log-in
app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username, password});
  if (user) {
    res.json({message:'로그인 성공', userId: user._id});
  } else {
    res.status(401).json({message:'ID 또는 Password Error'});
  }
});

// Add Users
app.post('/Users', async(req, res)=> {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  await newUser.save();
  res.status(201).json(newUser);
});

// find all users
app.get('/users', async(req, res) => {
  const users = await User.find();
  res.json(users);
});

// find some user
app.get('/users/:id', async(req, res)=> {
  const user = await User.findById(req.params.id);
  user ? res.json(user) : res.status(404).json({message: '사용자 없음'});
});

// update user
app.put('/users/:id', async(req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  updated ? res.json(updated) : res.status(404).json({message: '수정할 사용자 없음'
  });
});

// delete user
app.delete('/users/:id', async(req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  deleted ? res.json({message: '삭제됨'}) : res.status(404).json({message:'삭제할 사용자 없음'});
});

// 기본 라우트(ex : localhost:3000 -> index.html)
/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
*/

// 3000번 포트로 서버 실행
app.listen(PORT, () => {
  console.log('✅ 서버 실행 중: http://localhost:${PORT}');
});