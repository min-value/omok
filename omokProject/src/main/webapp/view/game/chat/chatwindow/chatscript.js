window.onload = function() {
    const input = document.querySelector('.chat-input');
    const mid = document.querySelector('.chat-mid');
    const btn = document.querySelector('.send-btn');
    sessionStorage.removeItem('myId');
    // 새로운 웹소켓의 경로를 지정
    const socket = new WebSocket("ws://localhost:8090/chat")
    // 웹소켓이 연결됐을 때
    socket.onopen = () => console.log("소켓 열림");

    // 서버에서 메세지를 수신했을 때 evt에 담는다
    socket.onmessage = evt => {
        // 서버에서 받은 evt.data를 자바스크립트 객체로 변환 후 senderId와 text 할당
        const { senderId, text } = JSON.parse(evt.data);
        // myId가 아직 없으면(첫 메시지) 세션스토리지에 저장
        if (text === "__INIT__") {
            // 최초에만 저장
            if (!sessionStorage.getItem('myId')) {
                sessionStorage.setItem('myId', senderId);
            }
            return;
        }
        // 페이지 로드할 때 내 ID 저장
        const myId = sessionStorage.getItem('myId');
        // 새로운 div 객체 생성 클래스명 my-message 내용은 서버에서 수신한 메세지 그 후 chat-mid 클래스의 자식으로 추가
        const message = document.createElement('div');
        // senderId가 myId와 같다면 내가 보낸 메세지 아니면 상대방 메세지
        if (senderId === myId) {
            message.className = 'my-message';
        } else {
            message.className = 'other-message'
        }
        message.innerText = text;
        mid.appendChild(message);
        // chat-mid의 스크롤 높이가 0보다 커질때마다 계속 갱신해서 새로운 메세지가 화면에 바로 보이게 함
        if (mid.scrollHeight > 0) {
            mid.scrollTop = mid.scrollHeight;
        }
    }
    socket.onerror = err => console.log("에러 ", err);
    socket.onclose = () => console.log("소켓 닫힘");

    // text에 양쪽 공백을 제거한 input값을 넣기
    function sendMsg() {
        const text = input.value.trim();
        // 공백이라면 전송 안함
        if (!text) {
            return;
        }
        socket.send(text);
        // 전송 후 내용을 제거
        input.value = '';
    }

    // 전송 버튼을 누르거나 엔터 입력 시 전송
    btn.addEventListener('click', sendMsg);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            sendMsg();
        }
    });
}
