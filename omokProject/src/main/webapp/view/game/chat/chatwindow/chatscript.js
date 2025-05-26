window.onload = function() {
    const input = document.querySelector('.chat-input');
    const mid = document.querySelector('.chat-mid');
    const btn = document.querySelector('.send-btn');

    function sendMsg() {
        const text = input.value.trim();
        const message = document.createElement('div');
        message.className = 'my-message';
        message.innerText = text;
        // text가 공백이면 전송 안함
        if(!text) {
            return;
        }
        mid.appendChild(message);
        input.value = '';
        // 스크롤 아래 고정
        if(mid.scrollHeight > 0) {
            mid.scrollTop = mid.scrollHeight;
        }
    }

    btn.addEventListener('click', sendMsg);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            sendMsg();
        }
    });
}