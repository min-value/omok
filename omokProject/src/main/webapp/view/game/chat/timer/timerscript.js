function restarttimer() { /* 타이머 리셋 */
    const bar = document.querySelector('.timer-bar');
    bar.classList.remove('decrease');
    void bar.offsetWidth;  // 강제 리플로우
    bar.classList.add('decrease');
}

// 페이지 로드 시 자동 시작
window.onload = restarttimer;