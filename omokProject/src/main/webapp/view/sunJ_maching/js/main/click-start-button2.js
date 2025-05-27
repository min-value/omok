
/* 이건 연결 테스트용 임시 js 파일입니다. 지울 예정임 */

// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("start_btn").addEventListener("click", startGame);
// });
//
// function startGame() {
//     // 로그인 안 되어 있을 경우 이동해야 해서 이렇게 잡아둠.
//     fetch("/omok/match", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({})
//     })
//         .then(res => {
//             if (res.redirected) {
//                 window.location.href = res.url;
//                 return;
//             }
//             return res.json();
//         })
//         .then(data => {
//             if (!data) return; // 위에서 리다이렉트 되었으면 중단됨
//             //로그 찍기 용
//             console.log("서버 응답:", data); // 🔍 응답 구조 확인용
//             const gameId = data.game.gameId;
//             location.href = `/view/sunJ_maching/ex-board.jsp?gameId=${gameId}`;
//         });
// }

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startBtn").addEventListener("click", startGame);
});

//location.href = `/view/sunJ_maching/ex-board.jsp?gameId=${gameId}`;
//이 부분은 나중에 game화면 생기면 거기 링킹으로 걸어두면 된다.
function startGame() {
    // 로그인 안 되어 있을 경우 이동해야 해서 이렇게 잡아둠.
    fetch("/omok/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    })
        .then(res => {
            if (res.redirected) {
                window.location.href = res.url;
                return;
            }
            return res.json();
        })
        .then(data => {
            if (!data) return; // 위에서 리다이렉트 되었으면 중단됨
            //로그 찍기 용
            console.log("서버 응답:", data); // 🔍 응답 구조 확인용
            const gameId = data.game.gameId;
            location.href = `/view/sunJ_maching/ex-board.jsp?gameId=${gameId}`;
        });
}