document.querySelector(".avatar-random-btn").addEventListener("click", () => {
    const randomNum = Math.floor(Math.random() * 6) + 10; // 임시로 10~15까지
    document.querySelector("#profile").src = `../../img/profile/${randomNum}.png`;
    document.querySelector("#profileNumber").value = randomNum;
});