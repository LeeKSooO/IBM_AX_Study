// stateMachine.js

const states = {
    default:     { ADD: "add", TERMINATE: "terminate" },
    add:         { ADD: "add", FIND: "find", DELETE: "delete", LOGIN: "log-in" },
    find:        { ADD: "add", FIND: "find", DELETE: "delete", LOGIN: "log-in" },
    delete:      { ADD: "add", FIND: "find", DELETE: "delete", LOGIN: "log-in" },
    "log-in":    { LOGOUT: "log-out", TERMINATE: "terminate" },
    "log-out":   { ADD: "add", FIND: "find", DELETE: "delete", LOGIN: "log-in" }
  };
  
  let currentState = "default";
  let token = null;
  
  function transition(action) {
    const upperAction = action.toUpperCase();
    const next = states[currentState]?.[upperAction];
    if (next) {
      currentState = next;
      //console.log(`\u{1F4C8} 상태 전이: ${currentState}`);
    } else {
      //console.log("\u274C 잘못된 상태 전이");
    }
    return currentState;
  }
  
  function setToken(newToken) {
    token = newToken;
    console.log("\u{1F511} 토큰 저장 완료");
  }
  
  function getToken() {
    return token;
  }
  
  function getState() {
    return currentState;
  }
  
  module.exports = { transition, getState, setToken, getToken };