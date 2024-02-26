function authenticate(loginData) {
  if (loginData) {
    let login = dbMockUsers.find(
      (user) =>
      loginData.username === user.username &&
      loginData.password === user.password
    );
    return login;
  }else{
    return undefined;
  }
}

const dbMockUsers = [
  {
    id: 1,
    username: "marcosf@shifta.la",
    password: "miPassword",
  },
  {
    id: 2,
    username: "lucass@shifta.la",
    password: "shifta",
  },
  {
    id: 3,
    username: "nataliap@shifta.la",
    password: "password123",
  },
];

module.exports = { authenticate }
