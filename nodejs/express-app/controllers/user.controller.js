// controller 
// 요창을 받아서 서비스 호출

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

// register user(sign-up)
exports.createUser = async (req, res) => {
    const { username, password, name, phone, email } = req.body;
    
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(409).json({ message: '이미 등록된 이메일입니다' });
      }

    const hashed = await bcrypt.hash(password, 10);
    
    const newUser = new User({ 
        username, 
        password: hashed,
        name,
        phone,
        email
    });

    await newUser.save();
    res.status(201).json(newUser);
};

// log-in
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) return res.status(401).json({ message: '유저 없음'});
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({ message: '비밀번호 오류'});

    const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' } 
    );
    res.json({ message: '로그인 성공', token });
};

// log-out
// localStorage.removeItem('token'); 추가 필요
exports.logout = async (req, res) => { 
    res.json({ message: '로그아웃 성공' });
};

// change password
exports.changePW = async (req, res) => {

    console.log('req.user: ', req.user);
    const { currentPassword, newPassword } = req.body;
    const id = req.user.id;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: '사용자 없음' });

        // current pw check
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch) return res.status(401).json({ message: '비밀번호 불일치' });

        // new pw hashing and save
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.json({ message: '비밀번호가 성공적으로 변경되었습니다' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: '서버 에러 발생' });
    }
};

// search own data
// JWTtoken은 localStorage 등에 저장하여 로그인부터 로그아웃까지 계속 쓸 예정
exports.getMyInfo = async (req, res) => {
    try {
        // JWT 인증 미들웨어(auth.js)에서 req.user에 사용자 정보 담았다고 가정
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');

        if(!user) {
            return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다' });
        }

        res.json(user);
    } catch(err) {
        console.error('getMyInfo error: ', err);
        res.status(500).json({ message: 'server error' });
    }
};

// update my info
exports.updateMyInfo = async (req, res) => {
    try {
        const userId = req.user.id;

        // 허용된 필드만 업데이트
        const { name, phone, email } = req.body;

        // 중복 이메일 확인
        if (email) {
            const emailOnwer = await User.findOne({ email });
            if (emailOnwer && emailOnwer._id.toString() !== userId) {
                return res.status(409).json({ message: '이미 사용 중인 이메일입니다' });
            }
        }

        const updated = await User.findByIdAndUpdate(
            userId,
            { $set: {name, phone, email}},
            { new : true, runValidators: true }
        ).select('-password');

        if (!updated) {
            return res.statue(404).json({ message: '사용자를 찾을 수 없습니다' });
        }

        res.json({ message: '정보가 수정되었습니다', user: updated });
    } catch(err) {
        console.error('정보 수정 오류', err);
        res.status(500).json({ message: '서버 오류 발생' });
    }
};

// withdraw
exports.withdraw = async (req, res) => {
    try{
        const userId = req.user.id;
        
        const deleted = await User.findByIdAndDelete(userId);

        if(!deleted) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.json({ message: '회원 탈퇴가 완료되었습니다.' });
    } catch(err) {
        console.error('회원 탈퇴 오류', err);
        res.status(500).json({ message: '서버 오류 발생' });
    }
};






// search *(user)
exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// update user
exports.updateUser = async (req, res) => {
    const updated = await User.findByIdAndUpdqte(
        req.params.id,
        { $set : req.body },
        { new: true }
    );
    updated ? res.json(updated) : res.status(404).json({ message:'수정할 사용자 없음' });
};

// delete user
exports.deleteUser = async (req, res) => {
    const deleted = await User.findOneAndDelete({ username: req.params.username });
    deleted ? res.json({message: '삭제됨' }) : res.status(404).json({ message : '삭제할 사용자 없음' });
};

// search particular user
exports.getUser = async (req, res) => {
};
