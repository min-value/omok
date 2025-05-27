<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<button id="startBtn">게임 시작</button>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("startBtn").addEventListener("click", startGame);
    });

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
                location.href = `ex-board.jsp?gameId=${'${gameId}'}`;
            });
    }
</script>
</body>
</html>