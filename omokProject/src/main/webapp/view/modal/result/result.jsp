
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <div id="modal">
        <div id="board">
            <div id="text"></div>
            <div id="info">
                <div id="user_img"></div>
                <div id="explanation">승률어쩌고</div>
            </div>
            <div id="btn">
                <button id="go_main_btn">메인 메뉴</button>
<%--                <div id="blank"></div>--%>
                <button id="re_btn">다시 시작</button>
            </div>
        </div>
    </div>
    <button id="btn-open-modal">모달 열기</button>

    <script>
        const modal = document.querySelector('#modal');
        const btnOpenModal=document.querySelector('#btn-open-modal');
        const closeModal = document.querySelector('#go_main_btn');
        const closeModal2 = document.querySelector('#re_btn');

        btnOpenModal.addEventListener("click", ()=>{
            modal.style.display="flex";
        });
        closeModal.addEventListener("click", ()=>{
            modal.style.display="none";
        });
        closeModal2.addEventListener("click", ()=>{
            modal.style.display="none";
        });
    </script>
</body>
</html>
