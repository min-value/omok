// 메세지 내역 렌더링
function loadMsg(mid) {
    const myIds = JSON.parse(sessionStorage.getItem('myServerIds') || '[]');
    // 배열의 길이가 0(아무 아이디도 없을 때) 는 렌더링 X
    if (myIds.length === 0) return;
    // 렌더링 전 화면 초기화하기
    mid.innerHTML = '';

    // 배열이 비었을경우 '[]'로 빈 배열 선언
    // + 이전 채팅 내역이 없어 배열이 없을 경우 null값이라 파싱에서 오류가 남
    const history = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
    // 배열을 순회하며
    history.forEach(({senderId, text}) => {
        const message = document.createElement('div');
        message.className = (myIds.includes(senderId)) ? 'my-message' : 'other-message';
        message.innerText = text;
        mid.appendChild(message);
    })
}

// 메세지 저장 함수
function saveMsg(senderId, text) {
    // 채팅 내역을 세션에 객체 배열로 저장 (파싱)
    // + 이전 채팅 내역이 없어 배열이 없을 경우 null값이라 forEach 에러남
    // 채팅 내용이 없을 경우 '[]'로 빈 배열 선언
    const history = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
    // history에 senderid와 text push해줌
    history.push({senderId, text});
    // 문자열 형식으로 chatHistory에 저장
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
}

// 메시지 전송 함수
function sendMsg(socket, input) {
    const text = input.value.trim();
    if (!text) return;
    socket.send(text);
    input.value = '';
}

// 소켓 초기화 함수
function initSocket(onMessage) {
    const socket = new WebSocket("ws://localhost:8090/chat");
    socket.onopen = () => console.log("소켓 열림");
    socket.onerror = err => console.log("에러 ", err);
    socket.onclose = () => console.log("소켓 닫힘");
    socket.onmessage = onMessage;
    return socket;
}

// DOM 준비 후 초기화 로직
window.onload = function() {
    const input = document.querySelector('.chat-input');
    const mid = document.querySelector('.chat-mid');
    const btn = document.querySelector('.send-btn');

    // myId 초기화
    // onload마다 아이디를 초기화 할 필요 X
    // sessionStorage.removeItem('myId');

    // 소켓 연결 & 메시지 처리 콜백 등록
    const socket = initSocket(evt => {
        const { senderId, text } = JSON.parse(evt.data);

        // 최초 INIT 메시지 처리
        if (text === "__INIT__") {
            // 내 서버 아이디 배열 꺼내기
            let myIds = JSON.parse(sessionStorage.getItem('myServerIds') || '[]');
            // 새로운 id가 배열에 없을 시 추가
            if (!myIds.includes(senderId)) {
                myIds.push(senderId);
                sessionStorage.setItem('myServerIds', JSON.stringify(myIds));
            }
            // 여기서 load
            // 저장된 hisotry + 내 모든 세션 아이디 렌더링
            loadMsg(mid);
            return;
        }

        // 실제 메시지 렌더링
        // myIds에 객체 배열로 저장한 id 불러오기
        const myIds = JSON.parse(sessionStorage.getItem('myServerIds') || '[]');
        const message = document.createElement('div');
        message.className = (myIds.includes(senderId)) ? 'my-message' : 'other-message';
        message.innerText = text;
        saveMsg(senderId, text);
        mid.appendChild(message);
        mid.scrollTop = mid.scrollHeight;
    });

    // 버튼/엔터 이벤트 바인딩
    btn.addEventListener('click', () => sendMsg(socket, input));
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMsg(socket, input);
    });
};
