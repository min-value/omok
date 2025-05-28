import {openWebSocket} from "../websocket.js";

let youCache = null;
let opponentCache = null;

// AJAX로 초기 상태 확인
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("gameId");

    if (!gameId) {
        alert("gameId 없음!");
        return;
    }

    // gameId를 서버에 넘겨서 상태 확인
    // 앞에서 받을 경우, 파라미터에 지저분하게 남겨야 해서 두 번 받기로 함.
    fetch("/omok/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId })
    })
        .then(res => res.json())
        .then(data => {
            const status = data.game.status;

            // 유저 정보 저장, 이건 왜 넣는거징. 일단 넣어보자.
            youCache = data.you;
            opponentCache = data.opponent || null;

            openWebSocket(gameId); // 소켓 연결

            if (status === "WAITING") {
                console.log("상대방을 기다리는 중..."); //콘솔로 확인만 한다.
            } else if (status === "MATCHED") {
                console.log("상대방과 매칭되었습니다.");
            }
        });
});

function startGame() {
    console.log("게임 시작!");
}