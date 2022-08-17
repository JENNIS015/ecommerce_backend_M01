const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

document.getElementById('messageContainer').style.display = 'none';
document.getElementById('msg').disabled = true;
document.getElementById('btnSend').disabled = true;

function storeDetails() {
  let toUser;
  let element = document.querySelectorAll('.chat-messages');
  document.getElementById('msg').disabled = false;
  document.getElementById('btnSend').disabled = false;
  document.getElementById('messageContainer').style.display = 'block';
  socket.emit('userDetails', { toUser });
}

socket.on('userList', (data) => {
  let selectList = document.getElementById('userList');

  for (let i = 0; i < data.length; i++) {
    let option = document.createElement('option');
    option.value = data[i].email;
    option.text = data[i].name;
    selectList.appendChild(option);
  }
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let list = document.getElementById('userList');
  let toUser = '';
  if (list) {
    let text = list.options[list.selectedIndex];
    toUser = text?.value;
  }
  const msg = e.target.elements.msg.value;

  let final = {
    toUser: toUser,
    msg: msg,
  };

  socket.emit('chatMessage', final);
  document.getElementById('msg').value = ' ';
});

socket.on('output', (data) => {
  for (let i = 0; i < data.length; i++) {
    outputMessage(data[i]);
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('message', (data) => {
  outputMessage(data);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('messageMine', (DataMine) => {
  outputMyMessage(DataMine);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.name}<span> ${message.time}, ${message.date}</span></p>
    <p class ="text">
        ${message.message}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function outputMyMessage(message) {
  const div = document.createElement('div');
  div.classList.add('messageMine');
  div.innerHTML = `<p class="mine">'Yo'<span> ${message.time}, ${message.date}</span></p>
    <p class ="text">
        ${message.message}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}
