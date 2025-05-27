<%@ page contentType="text/html; charset=UTF-8" language="java" import="java.util.*"%>
<%@ page import="org.sinhan.omokproject.domain.UserVO" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    UserVO userInfo = (UserVO) session.getAttribute("loginInfo");
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
<div id="logout-btn">
    <img src="../../img/logout_icon.png" alt="로그아웃" />
</div>
<div id="full_box">
    <div id="section1">
        <!-- 랭킹 -->
        <img src="../../img/rank_background.png" id="rank_background" alt="랭킹박스">
        <div id="ranking">
            <div id="ranking_section">
                <div class="rank_item">
                    <div class="rank_item_background">
                        <div class="rank_num">1</div>
                        <div class="rank_user_image_wrapper">
                            <img src="../../img/profile/1.png" class="rank_user_image" alt="유저 프로필 이미지">
                        </div>
                        <div class="rank_user_id">sukong</div>
                        <div class="rank_user_rate">
                            <img src="../../img/win_icon.png" class="win_icon" alt="승리아이콘">
                            <span class="win_rate">100%</span>
                        </div>
                    </div>
                </div>
                <div class="rank_item">
                    <div class="rank_item_background">
                        <div class="rank_num">1</div>
                        <div class="rank_user_image_wrapper">
                            <img src="../../img/profile/1.png" class="rank_user_image" alt="유저 프로필 이미지">
                        </div>
                        <div class="rank_user_id">sukong</div>
                        <div class="rank_user_rate">
                            <img src="../../img/win_icon.png" class="win_icon" alt="승리아이콘">
                            <span class="win_rate">100%</span>
                        </div>
                    </div>
                </div>
                <div class="rank_item">
                    <div class="rank_item_background"></div>
                </div>
                <div class="rank_item">
                    <div class="rank_item_background"></div>
                </div>
                <div class="rank_item">
                    <div class="rank_item_background"></div>
                </div>
                <div class="rank_item">
                    <div class="rank_item_background"></div>
                </div>
            </div>
            <div id="my_rank">
                <div class="rank_num">1</div>
                <div class="rank_user_image_wrapper">
                    <img src="../../img/profile/1.png" class="rank_user_image" alt="유저 프로필 이미지">
                </div>
                <div class="rank_user_id">sukong</div>
                <div class="rank_user_rate">
                    <img src="../../img/win_icon.png" class="win_icon" alt="승리아이콘">
                    <span class="win_rate">100%</span>
                </div>
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
            <!--
            <button id="start_btn">START</button>-->
            <img src="../../img/start_btn.png" id="start_btn" alt="시작버튼">
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

    setProfile(userId, userBio, winNum, loseNum, imageNum);
    setBar(winRate);
</script>
</body>
</html>