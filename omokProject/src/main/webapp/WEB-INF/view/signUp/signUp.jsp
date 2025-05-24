<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Sign Up</title>
  <!-- CSS 경로 수정 -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/view/signUp/body-style.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/view/signUp/id-input-group.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/view/signUp/password-input-group.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/view/signUp/bio-input-group.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/view/signUp/profile.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/view/signUp/title-animation.css">
</head>
<body>
<div class="sign-up">
  <div class="sign-up__title">
    <span>S</span><span>i</span><span>g</span><span>n</span><span>U</span><span>p</span>
  </div>
  <div class="sign-up__form">
    <form action="${pageContext.request.contextPath}/sign-up" method="post">
      <div class="sign-up__form-input">
        <div id="id_input_group">
          <div id="id_input">
            <label for="userId">아이디:</label>
            <input type="text" id="userId" name="userId"
                   maxlength="12"
                   pattern="[a-zA-Z0-9]+"
                   title="영문자와 숫자만 입력하세요"
                   oninput="this.value = this.value.replace(/[^a-zA-Z0-9]/g, '')"
                   required>
            <button id="id_check_button" type="button">중복 확인</button>
          </div>
          <div id="id_notice" class="form-notice">
            영문자, 숫자 조합 12자 이내
          </div>
        </div>
        <div id="password_group">
          <div id="pwd_input">
            <label for="password">비밀번호:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div id="re_pwd_input">
            <label for="re_password">재입력:</label>
            <input type="password" id="re_password" name="re_password" required>
          </div>
          <div id="pwd_notice" class="form-notice"></div>
        </div>
        <div id="bio_group">
          <div id="bio_input">
            <label for="bio">한줄소개:</label>
            <textarea id="bio" name="bio" rows="2" maxlength="60"></textarea>
          </div>
          <div id="bio_counter" class="form-counter">0 / 60</div>
        </div>
      </div>
      <div class="sign-up__form-profile">
        <div id="profile_input">
          <div class="profile-wrapper">
            <img id="profile" src="${pageContext.request.contextPath}/img/profile/10.png">
            <button type="button" class="avatar-random-btn">🎲</button>
          </div>
          <input type="hidden" name="profileNumber" id="profileNumber" value="10">
          <button id="submit_button" type="submit">회원가입</button>
        </div>
      </div>
    </form>
  </div>
  <div class="sign-up__footer"></div>
</div>

<!-- JS 경로도 JSP에 맞게 절대 경로로 수정 -->
<script src="${pageContext.request.contextPath}/view/signUp/bio-text-counter.js"></script>
<script src="${pageContext.request.contextPath}/view/signUp/profile-random.js"></script>
<script src="${pageContext.request.contextPath}/view/signUp/id-check.js"></script>
<script src="${pageContext.request.contextPath}/view/signUp/password-check-and-register.js"></script>
</body>
</html>

