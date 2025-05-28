/*
WebSocket 연결 및 메시지 수신 처리

엔드포인트는, 우리 오목 프로젝트의 모든 소켓 구현물들이 다 여기 들어가므로 "/min-value"로 설정
ajax에서 부르기 위해 함수로 구성
이건 웹 소켓 서버가 메세지를 보낼때만 실행되므로, 여기서 waited랑 상태를 받아서 반영해야 한다.
 */
import * as Omok from "../../game/board/board.js";
import * as Modal from "../js/match/modal-ui.js";
// 접속자, 상대방 정보 저장용 전역변수
let youCache = null;
let opponentCache = null;

export let currentTurn = 1;  // 1=흑돌(선공), 2=백돌(후공)
export let myRole = 0;// 0=미할당, 1=흑, 2=백

export function openWebSocket(gameId) {
    const socket = new WebSocket(`ws://localhost:8080/min-value?gameId=${gameId}`);

    //확인용 로그
    socket.onopen = () => console.log("✅ WebSocket 연결됨");
    socket.onerror = (e) => console.error("❌ WebSocket 오류", e);
    socket.onclose = () => console.warn("⚠️ WebSocket 연결 종료");

    //소켓 수신 메세지 처리
    //data.status의 경우는 matching 로직만 사용한다.
    //data.type의 경우는 채팅과 돌 놓는 로직에서 사용한다.
    //채팅 메세지 처리할때 사용하는 socket.onmessage 내부 로직과, 돌 놓을때 처리하는 socket.onmessage 내부 로직은 맡은 사람이 여기에 메서드로 구현해야 한다.
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.status === "WAITING") {
            // 이건 매칭에 쓰임. 상대방이 아직 없는 상태
            handleWaitingStatus(data);
        } else if (data.status === "MATCHED") {
            youCache = data.you;
            console.log(youCache);
            opponentCache = data.opponent;
            myRole = (youCache.id.trim() === data.player1.trim()) ? 1 : 2;
            currentTurn = 1;

            updateTurnIndicator(currentTurn === myRole);
            // 이건 매칭에 쓰임. 상대방이 들어와서 matched 된 상태
            handleMatchedStatus(data);

        } else if (data.type === "chat") {
            // 채팅 메시지 처리
            // appendChatBubble(data.senderId, data.text);
        } else if (data.type === "move") {
            // 돌을 놓는 메시지 처리
            drawStone(data);

        } else if (data.type === "gameover") {
            // 돌을 놓는 메시지 처리
            gameOver(data);

        }
    };

    // 채팅 메시지 처리용 js인 appendChatBubble(data.senderId, data.text); 구현 필요



    // 돌을 놓는 메시지 처리 처리용 js인 drawStone(data.x, data.y, data.userId); 구현 필요
    // 마우스 클릭하여 돌 두기
    // 돌을 놓는 메시지 처리
    function drawStone(data) {
        const { x, y, userId } = data;

        if (Omok.board[x][y] !== 0) return; // 이미 돌이 있으면 무시

        // 사용자 아이디가 내 아이디면 내 역할, 아니면 상대 역할
        const stone = (userId === youCache.id) ? myRole : (myRole === 1 ? 2 : 1);

        Omok.board[x][y] = stone;
        Omok.renderStone(x, y, stone);
        // 턴 교체
        currentTurn = (stone === 1) ? 2 : 1;
        updateTurnIndicator(currentTurn === myRole);

        saveBoardToSession();

        // 내 턴이면 hover 돌 유지, 아니면 숨김
        if (Omok.hoverStone) {
            Omok.hoverStone.style.display = (currentTurn === myRole) ? 'block' : 'none';
        }
    }


    // 돌 놓기 요청 시 호출
    function placeStone(row, col) {
        if (!youCache || myRole === 0) {
            alert("아직 역할이 할당되지 않았습니다.");
            return;
        }

        if (currentTurn !== myRole) {
            alert("현재 당신 차례가 아닙니다.");
            return;
        }

        if (Omok.board[row][col] !== 0) {
            alert("이미 돌이 놓여있는 자리입니다.");
            return;
        }
        const stoneSound = new Audio("../../../music/stonesound.mp3");
        stoneSound.play();

        const message = {
            type: "move",
            x: row,
            y: col,
            userId: youCache.id,
        };

        socket.send(JSON.stringify(message));
    }

    // 턴 UI 업데이트 함수 (예: 알림, 턴 표시)
    function updateTurnIndicator(isMyTurn) {
        const turnIndicator = document.getElementById("turn-indicator");
        if (turnIndicator) {
            turnIndicator.textContent = isMyTurn ? "당신의 턴입니다." : "상대방의 턴입니다.";
        }
    }

    // 클릭 이벤트 등록: 돌 놓기
    Omok.boardElement.addEventListener("click", (e) => {
        const rect = Omok.boardImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cell = Omok.getCellFromMousePosition(x, y);
        if (!cell) return;

        placeStone(cell.row, cell.col);

        if (Omok.checkWin(cell.row, cell.col, currentTurn)) {
            setTimeout(() => {
                console.log((currentTurn === 1 ? "흑" : "백") + " 승리!");
                location.reload();
            }, 100);

            const message = {
                type: "gameover",
                userId: youCache.id,
            };
            socket.send(JSON.stringify(message));
        }

    });

    // 마우스 이동 시 hover 돌 표시
    Omok.boardElement.addEventListener("mousemove", (e) => {
        if (!Omok.hoverStone) Omok.createHoverStone();

        if (myRole !== currentTurn) {
            if (Omok.hoverStone) Omok.hoverStone.style.display = 'none';
            return;
        }

        const rect = Omok.boardImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cell = Omok.getCellFromMousePosition(x, y);

        if (!cell || Omok.board[cell.row][cell.col] !== 0) {
            Omok.hoverStone.style.display = 'none';
            return;
        }

        Omok.hoverStone.style.display = 'block';
        // 위치 맞춤 (gridStartX, cellSizeX 등은 board/board.js에 정의되어 있어야 함)
        const left = Omok.gridStartX + cell.col * Omok.cellSizeX;
        const top = Omok.gridStartY + cell.row * Omok.cellSizeY;
        Omok.hoverStone.style.left = `${left}px`;
        Omok.hoverStone.style.top = `${top}px`;
        Omok.hoverStone.className = `stone hover ${currentTurn === 1 ? 'black' : 'white'}`;
    });

    Omok.boardElement.addEventListener("mouseleave", () => {
        if (Omok.hoverStone) Omok.hoverStone.style.display = 'none';
    });

    // 윈도우 리사이즈 시 보드 재계산 및 재렌더링
    window.addEventListener("resize", () => {
        Omok.calculateGridMetrics();
        Omok.rerenderStones();
        if (Omok.hoverStone) Omok.hoverStone.style.display = 'none';
    });

    // 페이지 로드 시 세션스토리지에서 보드 정보 복원
    window.onload = () => {
        Omok.calculateGridMetrics();

        const savedBoard = sessionStorage.getItem('board');
        const savedTurn = sessionStorage.getItem('turn');

        if (savedBoard) {
            const parsedBoard = JSON.parse(savedBoard);
            for (let r = 0; r < Omok.boardSize; r++) {
                for (let c = 0; c < Omok.boardSize; c++) {
                    Omok.board[r][c] = parsedBoard[r][c];
                    if (Omok.board[r][c] !== 0) {
                        Omok.renderStone(r, c, Omok.board[r][c]);
                    }
                }
            }
        }

        if (savedTurn) {
            currentTurn = parseInt(savedTurn);
            updateTurnIndicator(currentTurn === myRole);
        }
    };

    // 보드 상태 저장 함수
    function saveBoardToSession() {
        sessionStorage.setItem('board', JSON.stringify(Omok.board));
        sessionStorage.setItem('turn', currentTurn);
    }

    //gameover
    function gameOver(data) {
        if (Omok.hoverStone) Omok.hoverStone.style.display = 'none';

        const resultMessage = (data.winnerId === youCache.id)
            ? "🎉 당신이 승리했습니다!"
            : "😢 패배하셨습니다.";

        setTimeout(() => {
            alert(resultMessage);
            sessionStorage.removeItem('board');
            sessionStorage.removeItem('turn');
            location.reload();
        }, 100);
    }

    /* -------여기 아래 두개는 매칭용으로 개발 완료된 것임. 건들면 안된다!!!------- */
    function handleWaitingStatus(data) {
        Modal.renderPlayer("you", youCache);
        document.querySelector(".vs-text").style.display = "none";
        document.getElementById("player2-wrapper").style.display = "none";

        // ✅ youCache에서 내 정보 가져와서 돌 배치
        Modal.setStones(youCache.id, youCache.id); // player1 === you

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
            ex-board.jsp?gameId=63:124 내정보: {id: 'sunJ', rate: 0, img: 6}id: "sunJ"img: 6rate: 0[[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()
            ex-board.jsp?gameId=63:125 상대방과 매칭되었습니다:
            rate가 안날라와서 확인 필요.
         */

        Modal.setStones(data.you.id, data.player1);

        document.querySelector(".vs-text").style.display = "block";
        document.getElementById("player2-wrapper").style.display = "flex";
        Modal.openModal();

        setTimeout(() => {
            Modal.hideModal();
            startGame();
        }, 2000);
    }
}