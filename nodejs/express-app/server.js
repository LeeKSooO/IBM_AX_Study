const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

// app < Express App Instance, 이 객체를 통해 서버 라우팅, 미들웨어 등록, 리스닝 포트 설정 등을 수행
const app = express();
const PORT = 3000;

// DB Config
require("./database/db");

// app.use() <- 미들웨어를 등록하는 메서드(미들웨어는 Request - 처리(middleware) - Response 에서 역할 수행)
// usage : app.use(path, middlewareFunction); 
// path 생략가능, middlewareFunction은 (req,res,next)를 인자로 받음

// JSON Parsing middleware
app.use(express.json());
//app.use(express.static('public'));

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Express API Server');
});

// Connect userRouter(/users 요청이 들어오면 userRoutes로 전달)
app.use("/users", userRoutes);

// Connect adminRouter(/admin 요청시 adminRouter로 전달)
//app.use("/admin", adminRoutes);

// listener
app.listen(PORT, () => {
    console.log(`✅Server running on http://localhost:${PORT}`);
});