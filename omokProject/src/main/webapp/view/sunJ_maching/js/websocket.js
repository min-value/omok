/*
WebSocket 연결 및 메시지 수신 처리

엔드포인트는, 우리 오목 프로젝트의 모든 소켓 구현물들이 다 여기 들어가므로 "/min-value"로 설정
ajax에서 부르기 위해 함수로 구성
이건 웹 소켓 서버가 메세지를 보낼때만 실행되므로, 여기서 waited랑 상태를 받아서 반영해야 한다.
 */
import * as Omok from "../../game/board/board.js";
import * as Modal from "../js/match/modal-ui.js";
import { cache } from "./match/match-init.js";

// // 접속자, 상대방 정보 저장용 전역변수
// let youCache = null;
// let opponentCache = null;

export let currentTurn = 1;  // 1=흑돌(선공), 2=백돌(후공)
export let myRole = 0;// 0=미할당, 1=흑, 2=백

function openWebSocket(gameId) {
    const socket = new WebSocket(`ws://localhost:8080/min-value?gameId=${gameId}`);

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

        }  else if (data.status === "MATCHED") {
            cache.youCache = data.you;
            console.log(cache.youCache);
            cache.opponentCache = data.opponent;
            myRole = (cache.youCache.id.trim() === data.player1.trim()) ? 1 : 2;
            currentTurn = 1;

            updateTurnIndicator(currentTurn === myRole);
            // 이건 매칭에 쓰임. 상대방이 들어와서 matched 된 상태
            handleMatchedStatus(data);
            loadMsg(mid);
        } else if (data.type === 'chat') {
            appendBubble(mid, data.senderId, data.text);
            saveMsg(data.senderId, data.text);
        } else if (data.type === 'move') {
            drawStone(data);
        } else if (data.type === "gameover") {
            // 돌을 놓는 메시지 처리
            gameOver(data);

        }
    };

    // 채팅 입력 이벤트 바인딩
    btn.addEventListener('click', () => sendMsg(socket, input));
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMsg(socket, input);
    });
}

// 1) 채팅 히스토리 렌더링
function loadMsg(mid) {
    const myIds = youCache.id;
    mid.innerHTML = '';
    const history = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
    history.forEach(({ senderId, text }) => {
        const div = document.createElement('div');
        div.className = senderId === youCache.id ? 'my-message' : 'other-message';
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

/* -------여기 아래 두개는 매칭용으로 개발 완료된 것임. 건들면 안된다!!!------- */
function handleWaitingStatus(data) {
    Modal.renderPlayer("you", cache.youCache);
    document.querySelector(".vs-text").style.display = "none";
    document.getElementById("player2-wrapper").style.display = "none";

    // ✅ youCache에서 내 정보 가져와서 돌 배치
    Modal.setStones(cache.youCache.id, cache.youCache.id); // player1 === you

    Modal.openModal();
}

function handleMatchedStatus(data) {
    Modal.renderPlayer("you", data.you);
    Modal.renderPlayer("opponent", data.opponent);

    //로그 찍어서 확인
    console.log("내정보:", data.you);
    console.log("상대방과 매칭되었습니다:", data.opponent);

    /*
    ✅ WebSocket 연결됨
        game.jsp?gameId=63:124 내정보: {id: 'sunJ', rate: 0, img: 6}id: "sunJ"img: 6rate: 0[[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()
        game.jsp?gameId=63:125 상대방과 매칭되었습니다:
        rate가 안날라와서 확인 필요.
     */

    Modal.setStones(data.you.id, data.player1);

    document.querySelector(".vs-text").style.display = "block";
    document.getElementById("player2-wrapper").style.display = "flex";
    Modal.openModal();

    setTimeout(() => {
        Modal.hideModal();
    }, 2000);
}



