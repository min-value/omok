<%@ page contentType="text/html; charset=UTF-8" language="java" import="java.util.*"%>
<%@ page import="org.sinhan.omokproject.domain.UserVO" %>
<%@ page import="org.sinhan.omokproject.domain.UserStatVO" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    UserVO userInfo = (UserVO) session.getAttribute("loginInfo");
    List<UserStatVO> ranks = (List<UserStatVO>) request.getAttribute("ranks");
    if (ranks == null) {
        ranks = new ArrayList<>();
    }
    int myRank = (int) request.getAttribute("myRank");
%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>home</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/view/home/home_style.css" type="text/css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="${pageContext.request.contextPath}/view/home/home_script.js" type="text/javascript"></script>
</head>
<body>
<div id="logout_btn">
    <form id="logoutForm" action="/logout" method="POST">
        <button type="submit" style="background:none; border:none; padding:0; cursor:pointer;">
            <img src="../../img/logout_icon.png" alt="로그아웃" />
        </button>
    </form>
</div>
<div id="full_box">
    <div id="section1">
        <!-- 랭킹 -->
        <img src="../../img/rank_background.png" id="rank_background" alt="랭킹박스">
        <div id="ranking">
            <div id="ranking_section">
            </div>
            <div id="my_rank">
            </div>
        </div>
    </div>
    <div id="section2">
        <div id="logo_section">
            <div class="logo_wrapper">
                <!-- 로고 -->
                <img src="../../img/logo.png" id="logo" alt="로고">
            </div>
        </div>
        <div id="profile_section">
            <div id="profile_card">
                <div id="profile_info_section">
                    <!-- 개인정보 -->
                    <div class="info_row">
                        <span class="label">아이디</span>
                        <span class="value id"></span>
                    </div>
                    <div class="info_row">
                        <span class="label">한줄소개</span>
                        <span class="value bio">
                                <textarea class="bio_text" maxlength="20" readonly></textarea>
                                <img src="../../img/pencil_icon.png" id="edit_icon" alt="수정 아이콘">
                            </span>
                    </div>
                    <div class="info_row">
                        <div id="winning_box">
                            <span class="label">승률</span>
                            <span class="value-winning"></span>
                        </div>
                        <div class="multi-graph">
                            <div class="bar win" ></div>
                            <div class="bar lose" ></div>
                        </div>
                        <div class="legend">
                            <div class="legend-item">
                                <span class="dot win"></span> <span class="exp_text">승리</span>
                            </div>
                            <div class="legend-item">
                                <span class="dot lose"></span> <span class="exp_text">패배</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="profile_image_section">
                    <!-- 아바타 -->
                    <div id="avatar">
                    </div>
                </div>
            </div>
        </div>
        <div id="button_section">
            <button id="start_btn" class="img-button">
            </button>
        </div>
    </div>
</div>
<script>
    let userId = '<%= userInfo.getUserId() %>';
    let userBio = '<%= userInfo.getBio() %>';
    let winNum = <%= userInfo.getWin() %>;
    let loseNum = <%= userInfo.getLose() %>;
    let imageNum = <%= userInfo.getImage() %>;
    let winRate = <%= userInfo.getRate() %>;
    const ranks = <%= new com.google.gson.Gson().toJson(ranks) %>;
    const myRank = <%= myRank %>;
</script>
</body>
</html>