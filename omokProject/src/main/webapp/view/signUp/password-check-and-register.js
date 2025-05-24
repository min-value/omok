const pwd = document.getElementById('password');
const rePwd = document.getElementById('re_password');
const notice = document.getElementById('pwd_notice');
const form = document.querySelector('form'); // 또는 document.getElementById('폼의 id')

function checkPasswordMatch() {
    const pwdVal = pwd.value;
    const rePwdVal = rePwd.value;

    if (pwdVal === '' && rePwdVal === '') {
        notice.textContent = '';
        notice.className = 'form-notice';
        return false;  // ✅ 명확히 false 반환
    } else if (pwdVal === rePwdVal) {
        notice.textContent = '비밀번호가 같습니다.';
        notice.className = 'form-notice match';
        return true;   // ✅ 일치할 때 true 반환
    } else {
        notice.textContent = '비밀번호가 일치하지 않습니다.';
        notice.className = 'form-notice no-match';
        return false;
    }
}

pwd.addEventListener('input', checkPasswordMatch);
rePwd.addEventListener('input', checkPasswordMatch);

form.addEventListener('submit', function (e) {
    const passwordsMatch = checkPasswordMatch();

    if (!passwordsMatch) {
        e.preventDefault();
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    if (!isIdChecked) {
        e.preventDefault();
        alert('아이디 중복 확인을 먼저 해주세요.');
        return;
    }
});