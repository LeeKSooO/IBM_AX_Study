// client/stateMachine.js

let currentState = "default";
let token = null; // 인증 토큰 저장

const states = {
  default: {
    SIGNUP: "unauthenticated",
    LOGIN: "authenticated",
    TERMINATE: "terminate"
  },
  authenticated: {
    LOGOUT: "unauthenticated",
    CHANGEPW: "authenticated",
    GETMYINFO: "authenticated",
    UPDATEMYINFO: "authenticated",
    WITHDRAW: "default",
    TERMINATE: "terminate"
  },
  unauthenticated: {
    LOGIN: "authenticated",
    SIGNUP: "unauthenticated",
    TERMINATE: "terminate"
  }
};

function transition(action) {
  const upperAction = action.toUpperCase();
  const next = states[currentState]?.[upperAction];
  if (next) {
    currentState = next;
  } else {
    console.log("❌ 잘못된 상태 전이");
  }
  return currentState;
}

function setToken(newToken) {
  token = newToken;
}

function getToken() {
  return token;
}

function getState() {
  return currentState;
}

module.exports = { transition, setToken, getToken, getState };
