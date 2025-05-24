let isIdChecked = false;

document.addEventListener('DOMContentLoaded', function () {
    const checkButton = document.getElementById('id_check_button');
    const userIdInput = document.getElementById('userId');
    const idNotice = document.getElementById('id_notice');

    checkButton.addEventListener('click', function () {
        const userId = userIdInput.value;

        fetch(`/check-id?userId=${encodeURIComponent(userId)}`)
            .then(res => res.json())
            .then(data => {
                if (data.exists) {
                    idNotice.textContent = '이미 사용 중인 아이디입니다.';
                    idNotice.className = 'form-notice no-match';
                    isIdChecked = false;
                } else {
                    idNotice.textContent = '사용 가능한 아이디입니다!';
                    idNotice.className = 'form-notice match';
                    isIdChecked = true;
                }
            });
    });
    userIdInput.addEventListener('input', function () {
        idNotice.textContent = "영문자, 숫자 조합 12자 이내";
        idNotice.classList.remove("match", "no-match");
        idNotice.classList.add("guide");

        // ✅ 중복확인 결과를 무효화
        isIdChecked = false;  // 전역 변수로 관리
    });
});