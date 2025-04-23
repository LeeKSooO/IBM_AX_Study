const readline = require("readline");
const axios = require("axios");
// stateMachine.js path setting
const { transition, getState, setToken, getToken } = require("./stateMachine");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// state 정의
function menu() {
    const state = getState();
    console.log(`현재 상태 : ${state}`)
    
    switch(state) {
        case "default":
            console.log("1. 유저 추가");
            console.log("0. 종료");
            rl.question("선택 : ", handleDefault);
            break;
        case "add":
            console.log("1. 유저 추가");
            console.log("2. 유저 조회");
            console.log("3. 유저 삭제");
            console.log("4. 로그인");
            console.log("0. 종료");
            rl.question("선택 : ", handleAdd);
            break;
        case "find":
            console.log("1. 유저 추가");
            console.log("2. 유저 조회");
            console.log("3. 유저 삭제");
            console.log("4. 로그인");
            console.log("0. 종료");
            rl.question("선택 : ", handleFind);
            break;
        case "delete":
            console.log("1. 유저 추가");
            console.log("2. 유저 조회");
            console.log("3. 유저 삭제");
            console.log("4. 로그인");
            console.log("0. 종료");
            rl.question("선택 : ", handleDelete);
            break;
        case "log-in":
            console.log("1. 로그아웃");
            console.log("0. 종료");
            rl.question("선택 : ", handleLogin);
            break;
        case "log-out":
            console.log("1. 유저 추가");
            console.log("2. 유저 조회");
            console.log("3. 유저 삭제");
            console.log("4. 로그인");
            console.log("0. 종료");
            rl.question("선택 : ", handleLogout);
            break;
    }
}

function handleDefault(input) {
    if(input == "1") {
        transition("ADD");
        addUser();
    } else {
        transition("TERMINATE");
        rl.close();
    }
}

// handler
function handleAdd(input) {
    switch(input) {
        case "1": transition("ADD"); return addUser();
        case "2": transition("FIND"); return findUser();
        case "3": transition("DELETE"); return deleteUser();
        case "4": transition("LOGIN"); return login();
        case "0": transition("TERMINATE"); return rl.close();
        default: console.log("wrong input"); return menu();
    }
}

function handleFind(input) {
    switch(input) {
        case "1": transition("ADD"); return addUser();
        case "2": transition("FIND"); return findUser();
        case "3": transition("DELETE"); return deleteUser();
        case "4": transition("LOGIN"); return login();
        case "0": transition("TERMINATE"); return rl.close();
        default: console.log("wrong input"); return menu();
    }
}

function handleDelete(input) {
    switch(input) {
        case "1": transition("ADD"); return addUser();
        case "2": transition("FIND"); return findUser();
        case "3": transition("DELETE"); return deleteUser();
        case "4": transition("LOGIN"); return login();
        case "0": transition("TERMINATE"); return rl.close();
        default: console.log("wrong input"); return menu();
    }
}

function handleLogin(input) {
    switch(input) {
        case "1": transition("LOGOUT");
        console.log("로그아웃 완료");
        menu();
        break;
        case "0": transition("TERMINATE"); return rl.close();
        default: console.log("wrong input"); return menu();
    }
}

function handleLogout(input) {
    switch(input) {
        case "1": transition("ADD"); return addUser();
        case "2": transition("FIND"); return findUser();
        case "3": transition("DELETE"); return deleteUser();
        case "4": transition("LOGIN"); return login();
        case "0": transition("TERMINATE"); return rl.close();
        default: console.log("wrong input"); return menu();
    }
}

// -- --
async function addUser() {
    rl.question("ID: ", (username) => {
        rl.question("password : ", async (password) => {
            try {
                //API Call
                const res = await axios.post("http://localhost:3000/users", { username, password });
                console.log(`admin successfully restored as.. ${res.data.username}`);      
            } catch {
                console.error("admin failed");
            }
            menu();
        });
    });
}

// 전체 유저 조회
async function findUser() {
    try {
        // API Call
        const res = await axios.get("http://localhost:3000/users");
        console.log("--User List--", res.data);
    } catch (err) {
        console.error("유저 조회 실패", err.response?.data || err.message);
    }
    menu();
}

async function deleteUser() {
    rl.question("삭제할 유저 ID : ", async (username) => {
        try {
            const res = await axios.delete(`http://localhost:3000/users/${username.trim()}`);
            console.log("삭제 성공", res.data);
        } catch {
            console.error("삭제 실패 (토큰 또는 ID 확인 필요)");
        }
        menu();
    });
}

async function login() {
    rl.question("ID : ", (username) => {
        rl.question("password : ", async (password) => {
            try {
                const res = await axios.post("http://localhost:3000/login", {username, password});
                console.log("로그인 성공 (토큰) : ", res.data.token);
                setToken(res.data.token);
                transition("LOGIN");
            } catch {
                console.error("로그인 실패");
                //transition("FAIL");
            }
            menu();
        });
    });
}

menu();