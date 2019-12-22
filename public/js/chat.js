const socket = io()

// DOM Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#message')
const $messageFormButton = document.querySelector('#send-button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Query String
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

function autoscroll() {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of Messages container
  const containerHeight = $messages.scrollHeight

  // Scroll from top
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on('message', message => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('locationMessage', location => {
  console.log(location)
  const html = Mustache.render(locationTemplate, {
    username: location.username,
    locationUrl: location.url,
    createdAt: moment(location.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users })
  document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', e => {
  e.preventDefault()

  $messageFormButton.setAttribute('disabled', true)

  const value = $messageFormInput.value

  socket.emit('sendMessage', value, error => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      console.log(error)
    }

    console.log('Message delivered!')
  })
})

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation)
    return alert('Geolocation is not supported by your browser.')

  $sendLocationButton.setAttribute('disabled', true)

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords
    const location = { latitude, longitude }

    socket.emit('sendLocation', location, () => {
      $sendLocationButton.removeAttribute('disabled')
      console.log('Location shared!')
    })
  })
})

socket.emit('join', { username, room }, error => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
