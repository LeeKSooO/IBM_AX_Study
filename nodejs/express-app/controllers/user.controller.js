// controller 
// 요창을 받아서 서비스 호출

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

exports.createUser = async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed });
    await newUser.save();
    res.status(201).json(newUser);
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) return res.status(401).json({ message: '유저 없음'});
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({ message: '비밀번호 오류'});

    const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' } 
    );
    res.json({ message: '로그인 성공', token });
};

exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
}

exports.updateUser = async (req, res) => {
    const updated = await User.findByIdAndUpdqte(
        req.params.id,
        { $set : req.body },
        { new: true }
    );
    updated ? res.json(updated) : res.status(404).json({ message:'수정할 사용자 없음' });
};

exports.deleteUser = async (req, res) => {
    const deleted = await User.findOneAndDelete({ username: req.params.username });
    deleted ? res.json({message: '삭제됨' }) : res.status(404).json({ message : '삭제할 사용자 없음' });
};