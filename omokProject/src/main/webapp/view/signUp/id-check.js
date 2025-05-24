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
        isIdChecked = false;
    });
});