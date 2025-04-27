let currentState = "default";
let token = null;

const states = {
  default: { ADD: "add", TERMINATE: "terminate" },
  add: { ADD: "add", FIND: "find", DELETE: "delete", LOGIN: "log-in" },
  find: { ADD: "add", FIND: "find", DELETE: "delete", LOGIN: "log-in" },
  delete: { ADD: "add", FIND: "find", DELETE: "delete", LOGIN: "log-in" },
  "log-in": { LOGOUT: "log-out", TERMINATE: "terminate" },
  "log-out": { ADD: "add", FIND: "find", DELETE: "delete", LOGIN: "log-in" }
};

function transition(action) {
  const upper = action.toUpperCase();
  const next = states[currentState]?.[upper];
  if (next) {
    currentState = next;
  }
  render();
}

function setToken(t) {
  token = t;
  alert("🔐 토큰 저장 완료");
}

function render() {
  document.getElementById("state").textContent = `현재 상태: ${currentState}`;
  const menu = document.getElementById("menu");
  const form = document.getElementById("form");
  menu.innerHTML = "";
  form.innerHTML = "";

  const button = (text, action) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => action();
    return btn;
  };

  switch (currentState) {
    case "default":
      menu.appendChild(button("1. 유저 추가", () => transition("ADD")));
      menu.appendChild(button("0. 종료", () => transition("TERMINATE")));
      break;
    case "add":
    case "find":
    case "delete":
    case "log-out":
      menu.appendChild(button("1. 유저 추가", () => addUser()));
      menu.appendChild(button("2. 유저 조회", () => findUser()));
      menu.appendChild(button("3. 유저 삭제", () => deleteUser()));
      menu.appendChild(button("4. 로그인", () => login()));
      menu.appendChild(button("0. 종료", () => transition("TERMINATE")));
      break;
    case "log-in":
      menu.appendChild(button("1. 로그아웃", () => {
        transition("LOGOUT");
        alert("로그아웃 완료");
      }));
      menu.appendChild(button("0. 종료", () => transition("TERMINATE")));
      break;
  }
}

function addUser() {
  const form = document.getElementById("form");
  form.innerHTML = `
    <input id="id" placeholder="ID">
    <input id="pw" type="password" placeholder="Password">
    <button onclick="submitAddUser()">추가</button>
  `;
}

function submitAddUser() {
  const username = document.getElementById("id").value;
  const password = document.getElementById("pw").value;
  fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      alert(`추가 성공: ${data.username}`);
      transition("ADD");
    })
    .catch(() => alert("추가 실패"));
}

function findUser() {
  fetch("http://localhost:3000/users")
    .then(res => res.json())
    .then(data => alert("📋 유저 목록:\n" + JSON.stringify(data)))
    .catch(err => alert("조회 실패: " + err));
}

function deleteUser() {
  const form = document.getElementById("form");
  form.innerHTML = `
    <input id="del-id" placeholder="삭제할 ID">
    <button onclick="submitDeleteUser()">삭제</button>
  `;
}

function submitDeleteUser() {
  const username = document.getElementById("del-id").value.trim();
  fetch(`http://localhost:3000/users/${username}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert("삭제 성공: " + JSON.stringify(data));
      transition("DELETE");
    })
    .catch(() => alert("삭제 실패"));
}

function login() {
  const form = document.getElementById("form");
  form.innerHTML = `
    <input id="login-id" placeholder="ID">
    <input id="login-pw" type="password" placeholder="Password">
    <button onclick="submitLogin()">로그인</button>
  `;
}

function submitLogin() {
  const username = document.getElementById("login-id").value;
  const password = document.getElementById("login-pw").value;
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      alert("로그인 성공! 🔑 토큰: " + data.token);
      setToken(data.token);
      transition("LOGIN");
    })
    .catch(() => alert("로그인 실패"));
}

render(); // 최초 실행
