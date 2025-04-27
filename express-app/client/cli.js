// client/cli.js

const readline = require("readline");
const axios = require("axios");
const { transition, setToken, getToken, getState } = require("./stateMachine");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BASE_URL = "http://localhost:3000";

function menu() {
  const state = getState();
  console.log(`\n현재 상태: ${state}`);

  switch (state) {
    case "default":
    case "unauthenticated":
      console.log("1. 회원가입");
      console.log("2. 로그인");
      console.log("0. 종료");
      rl.question("선택: ", handleUnauthenticated);
      break;
    case "authenticated":
      console.log("1. 로그아웃");
      console.log("2. 비밀번호 변경");
      console.log("3. 내 정보 조회");
      console.log("4. 내 정보 수정");
      console.log("5. 회원 탈퇴");
      console.log("0. 종료");
      rl.question("선택: ", handleAuthenticated);
      break;
    case "terminate":
      console.log("프로그램 종료");
      rl.close();
      break;
  }
}

function handleUnauthenticated(input) {
  switch (input) {
    case "1": return signup();
    case "2": return login();
    case "0": transition("TERMINATE"); return menu();
    default: console.log("잘못된 입력"); return menu();
  }
}

function handleAuthenticated(input) {
  switch (input) {
    case "1": return logout();
    case "2": return changePassword();
    case "3": return getMyInfo();
    case "4": return updateMyInfo();
    case "5": return withdraw();
    case "0": transition("TERMINATE"); return menu();
    default: console.log("잘못된 입력"); return menu();
  }
}

// --------- 기능별 함수 ---------

async function signup() {
  rl.question("아이디: ", id => {
    rl.question("비밀번호: ", pw => {
      rl.question("이름: ", name => {
        rl.question("전화번호: ", phone => {
          rl.question("이메일: ", async email => {
            try {
              const res = await axios.post(`${BASE_URL}/users`, {
                username: id,
                password: pw,
                name,
                phone,
                email
              });
              console.log("✅ 회원가입 성공:", res.data.username);
              transition("SIGNUP");
            } catch (err) {
              console.error("❌ 회원가입 실패:", err.response?.data || err.message);
            }
            menu();
          });
        });
      });
    });
  });
}

async function login() {
  rl.question("아이디: ", username => {
    rl.question("비밀번호: ", async password => {
      try {
        const res = await axios.post(`${BASE_URL}/users/login`, { username, password });
        console.log("✅ 로그인 성공!");

        setToken(res.data.token);
        transition("LOGIN");
      } catch (err) {
        console.error("❌ 로그인 실패:", err.response?.data || err.message);
      }
      menu();
    });
  });
}

async function logout() {
  try {
    await axios.delete(`${BASE_URL}/users/logout`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    console.log("✅ 로그아웃 성공");
    setToken(null);
    transition("LOGOUT");
  } catch (err) {
    console.error("❌ 로그아웃 실패:", err.response?.data || err.message);
  }
  menu();
}

async function changePassword() {
    rl.question("현재 비밀번호: ", curPassword => {
        rl.question("새 비밀번호: ", async newPassword => {
            try {
                await axios.patch(`${BASE_URL}/users/me/password`, 
                    { currentPassword: curPassword, newPassword: newPassword },
                    { headers: { Authorization: `Bearer ${getToken()}` }
                  });

                  console.log("✅ 비밀번호 변경 완료");
                  transition("CHANGEPW");
        } catch(err) {
             console.error("비밀번호 변경 실패: ", err.response?.data || err.message);
        }
        menu();
        });
    });
}

async function getMyInfo() {
  try {
    const res = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    console.log("📋 내 정보:", res.data);
    transition("GETMYINFO");
  } catch (err) {
    console.error("❌ 내 정보 조회 실패:", err.response?.data || err.message);
  }
  menu();
}

async function updateMyInfo() {
    console.log("\n수정할 항목 선택:");
    console.log("1. 이름");
    console.log("2. 핸드폰 번호");
    console.log("3. 이메일");
    console.log("0. 취소");
  
    rl.question("선택: ", (choice) => {
      switch (choice) {
        case "1":
          rl.question("새 이름 입력: ", async (newName) => {
            await patchMyInfo({ name: newName });
          });
          break;
        case "2":
          rl.question("새 핸드폰 번호 입력: ", async (newPhone) => {
            await patchMyInfo({ phone: newPhone });
          });
          break;
        case "3":
          rl.question("새 이메일 입력: ", async (newEmail) => {
            await patchMyInfo({ email: newEmail });
          });
          break;
        case "0":
          console.log("수정 취소");
          menu();
          break;
        default:
          console.log("잘못된 입력입니다.");
          menu();
      }
    });
  }
  
  // 실제 PATCH 요청 보내는 함수
  async function patchMyInfo(data) {
    try {
      await axios.patch(`${BASE_URL}/users/me`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      console.log("✅ 내 정보 수정 완료");
      transition("UPDATEMYINFO");
    } catch (err) {
      console.error("❌ 내 정보 수정 실패:", err.response?.data || err.message);
    }
    menu();
  }
  

async function withdraw() {
  try {
    await axios.delete(`${BASE_URL}/users/withdraw`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    console.log("✅ 회원 탈퇴 완료");
    setToken(null);
    transition("WITHDRAW");
  } catch (err) {
    console.error("❌ 회원 탈퇴 실패:", err.response?.data || err.message);
  }
  menu();
}

// --------- 시작 ---------

menu();
