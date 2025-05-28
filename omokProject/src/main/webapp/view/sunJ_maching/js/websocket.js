// let youCache = null;
// let opponentCache = null;

// 1) 채팅 히스토리 렌더링
function loadMsg(mid) {
    const myIds = JSON.parse(sessionStorage.getItem('myServerIds') || '[]');
    if (!myIds.length) return;
    mid.innerHTML = '';
    const history = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
    history.forEach(({ senderId, text }) => {
        const div = document.createElement('div');
        div.className = myIds.includes(senderId) ? 'my-message' : 'other-message';
        div.innerText = text;
        mid.appendChild(div);
    });
    mid.scrollTop = mid.scrollHeight;
}

// 2) 채팅 저장
function saveMsg(senderId, text) {
    const history = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
    history.push({ senderId, text });
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
}

// 3)  서버에 채팅 전송
function sendMsg(socket, input) {
    const text = input.value.trim();
    if (!text) return;
    const myIds = JSON.parse(sessionStorage.getItem('myServerIds') || '[]');
    const payload = {
        type : 'chat',
        senderId : youCache.id || '',
        message : text
    };
    socket.send(JSON.stringify(payload));
    console.log(payload);
    input.value = '';
}
// 채팅 화면에 렌더링
function appendBubble(mid, senderId, text) {
    const div = document.createElement('div');
    // senderId 가 내 ID 면 .my-message, 아니면 .other-message
    div.className = senderId === youCache.id ? 'my-message' : 'other-message';
    div.innerText = text;
    mid.appendChild(div);
    mid.scrollTop = mid.scrollHeight;
}

// 4) WebSocket 연결 및 메시지 처리
function openWebSocket(gameId) {
    const socket = new WebSocket(`ws://localhost:8090/min-value?gameId=${gameId}`);

    socket.onopen  = ()  => console.log('✅ WebSocket 연결됨');
    socket.onerror = e   => console.error('❌ WebSocket 오류', e);
    socket.onclose = ()  => console.warn('⚠️ WebSocket 연결 종료');

    const mid   = document.querySelector('.chat-mid');
    const input = document.querySelector('.chat-input');
    const btn   = document.querySelector('.send-btn');

    socket.onmessage = event => {
        const data = JSON.parse(event.data);

        if (data.status === 'WAITING') {
            handleWaitingStatus(data);

        } else if (data.status === 'MATCHED') {
            handleMatchedStatus(data);
            youCache = data.you;
            opponentCache = data.opponent;
        } else if (data.type === 'chat') {
            appendBubble(mid, data.senderId, data.text);
            saveMsg(data.senderId, data.text);

        } else if (data.type === 'move') {
            drawStone(data.x, data.y, data.userId);

        } // 기타 gameover 등은 기존 로직 그대로
    };

    // 채팅 입력 이벤트 바인딩
    btn.addEventListener('click', () => sendMsg(socket, input));
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMsg(socket, input);
    });
}

// 5) 매칭 로직 (건들지 마세요)
function handleWaitingStatus(data) {
    renderPlayer("you", youCache);
    document.querySelector(".vs-text").style.display = "none";
    document.getElementById("player2-wrapper").style.display = "none";
    setStones(youCache.id, youCache.id);
    openModal();
}

function handleMatchedStatus(data) {
    renderPlayer("you", data.you);
    renderPlayer("opponent", data.opponent);
    console.log("내정보:", data.you);
    console.log("상대방:", data.opponent);
    setStones(data.you.id, data.player1);
    document.querySelector(".vs-text").style.display = "block";
    document.getElementById("player2-wrapper").style.display = "flex";
    openModal();
    setTimeout(() => {
        hideModal();
        startGame();
    }, 2000);
}


