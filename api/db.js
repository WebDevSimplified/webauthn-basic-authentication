const USERS = []

function getUserByEmail(email) {
  return USERS.find(user => user.email === email)
}

function getUserById(id) {
  return USERS.find(user => user.id === id)
}

function createUser(id, email, passKey) {
  USERS.push({ id, email, passKey })
}

function updateUserCounter(id, counter) {
  const user = USERS.find(user => user.id === id)
  user.passKey.counter = counter
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  updateUserCounter,
}
