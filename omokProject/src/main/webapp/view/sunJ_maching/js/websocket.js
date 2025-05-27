// WebSocket 연결 및 메시지 수신 처리
// 엔드포인트는 일단 /match"로 설정
// ajax에서 부르기 위해 함수로 구성
// 이건 웹 소켓 서버가 메세지를 보낼때만 실행되므로, 여기서 waited랑 상태를 받아서 반영해야 한다.
function openWebSocket(gameId) {
    const socket = new WebSocket(`ws://localhost:8090/match?gameId=${gameId}`);

    //확인용 로그
    socket.onopen = () => console.log("✅ WebSocket 연결됨");
    socket.onerror = (e) => console.error("❌ WebSocket 오류", e);
    socket.onclose = () => console.warn("⚠️ WebSocket 연결 종료");

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.status === "WAITING") {
            // 상대방이 아직 없는 상태
            renderPlayer("you", youCache);
            document.querySelector(".vs-text").style.display = "none";
            document.getElementById("player2-wrapper").style.display = "none";

            // ✅ youCache에서 내 정보 가져와서 돌 배치
            setStones(youCache.id, youCache.id); // player1 === you

            openModal();

        } else if (data.status === "MATCHED") {
            renderPlayer("you", data.you);
            renderPlayer("opponent", data.opponent);

            //로그 찍어서 확인
            console.log("내정보:", data.you);
            console.log("상대방과 매칭되었습니다:", data.opponent);

            /*
            ✅ WebSocket 연결됨
                ex-board.jsp?gameId=63:124 내정보: {id: 'sunJ', rate: 0, img: 6}id: "sunJ"img: 6rate: 0[[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()
                ex-board.jsp?gameId=63:125 상대방과 매칭되었습니다:
                rate가 안날라와서 확인 필요.
             */

            setStones(data.you.id, data.player1);

            document.querySelector(".vs-text").style.display = "block";
            document.getElementById("player2-wrapper").style.display = "flex";
            openModal();

            setTimeout(() => {
                hideModal();
                // debugPrintGamePlayers(data.you, data.opponent);
                startGame();
            }, 2000);
        }
    };

    socket.onerror = (e) => console.error("WebSocket 오류", e);
    socket.onclose = () => console.warn("WebSocket 연결 종료");
}