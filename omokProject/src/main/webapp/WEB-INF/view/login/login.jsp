<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/view/login/style.css">
</head>
<body>
<div class="login-container">
    <div class="title">
        <img src="${pageContext.request.contextPath}/img/logo.png" alt="오목게임 로고">
    </div>
    <form action="/login" method="post">
        <input class="input-field" type="text" name="userId" placeholder="ID 입력해라" required>
        <input class="input-field" type="password" name="userPw" placeholder="PW 입력해라" required>
        <button type="submit" class="submit-button">로그인</button>
    </form>
    <a class="register" href="/sign-up">회원가입</a>
</div>
<%
    String error = (String) session.getAttribute("error");
    if (error != null) {
        session.removeAttribute("error"); // ✅ 한번 쓰고 제거
%>
<script>
    alert("<%= error %>");
</script>
<%
    }
%>
</body>
</html>

