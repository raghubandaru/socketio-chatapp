const users = []

function addUser({ id, username, room }) {
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  if (!username || !room) {
    return { error: 'Username and Room are required' }
  }

  const existingUser = users.find(
    user => user.room === room && user.username === username
  )

  if (existingUser) {
    return { error: 'Username provided is already in use' }
  }

  const user = { id, username, room }
  users.push(user)

  return { user }
}

function removeUser(id) {
  const index = users.findIndex(user => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

function getUser(id) {
  return users.find(user => user.id === id)
}

function getUsersByRoom(room) {
  room = room.trim().toLowerCase()
  return users.filter(user => user.room === room)
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersByRoom
}

// addUser({ id: 1, username: 'Raghu', room: 'React' })
// console.log('users: ', users)

// addUser({ id: 2, username: 'Pruthvi', room: 'React' })
// console.log('users: ', users)

// addUser({ id: 3, username: 'Naveen', room: 'Angular' })
// console.log('users: ', users)

// addUser({ id: 4, username: 'Abhinaya', room: 'Angular' })
// console.log('users: ', users)

// removeUser(4)
// console.log(users)

// console.log(getUser(2))
// console.log(getUsersByroom('react'))
