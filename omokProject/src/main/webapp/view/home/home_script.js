const pencilSrc = `/img/pencil_icon.png`;
const checkSrc = `/img/check_icon.png`;
let editing = false; //bio 수정 상태 flag

$(window).ready(function(){
    console.log('hello');
    let normalImgUrl = "/img/profile/" + imageNum + ".png";
    let sadImgUrl = "/img/profile/" + imageNum + "_sad.png";

    /* 한줄 소개 변경 클릭 리스너*/
    $('#edit_icon').on('click', function() {
        updateBio(this); // 클릭한 DOM 요소를 인자로 전달
    });
    
    /* 한줄 소개 박스 포커스 리스너*/
    $('textarea.bio_text').on({
        focus: function () {
            setBioBorder(editing);
        },
        blur: function() {
            setBioBorder(!editing);
        },
        mousedown: function(e) {
            if($(this).prop('readonly')) {
                e.preventDefault();
            }
        }
    });

    /* 로그아웃 버튼 호버 리스너*/
    $('#logout_btn img').hover(
        function() {
            $('#avatar')
                .css('background-image', 'url(' + sadImgUrl + ')');
        },
        function() {
            $('#avatar')
                .css('background-image', 'url(' + normalImgUrl + ')');
        }
    );

    /* 시작 버튼 리스너 */
    $('#start_btn').on('click', function() {
        location.assign("/omok/game");
    })

    /* 랭킹(1-10위) 업데이트 */
    setRankingList(ranks);

    /* 내 랭킹 업데이트 */
    setMyRank(myRank, normalImgUrl, userId, winRate);
    
    /* 내 프로필 업데이트 */
    setProfile(userId, userBio, winNum, loseNum, imageNum);

    /* 그래프 업데이트 */
    setBar(winRate);
});

/* 한줄 소개 변경 함수 */
function updateBio(buttonEl) {
    let bio_text = $('.bio_text');

    if (!editing) {
        editing = true;
        bio_text.prop('readonly', false).focus();
        setBioBorder(editing);
        $(buttonEl).attr('src', checkSrc); // 체크 아이콘으로 변경
    } else {
        editing = false;
        bio_text.prop('readonly', true);
        setBioBorder(editing);
        $(buttonEl).attr('src', pencilSrc); // 다시 연필 아이콘으로 변경

        let newBio = bio_text.val().replace(/\n/g, "");
        bio_text.val(newBio);

        $.ajax({
            url: '/omok/updateBio',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                userId: userId,
                bio: newBio
            }),
            success: function(response) {
                alert("한줄 소개 변경이 완료되었습니다.");
            },
            error: function(xhr, status, error) {
                console.error("한줄 소개 변경 실패:", error);
            }
        });
    }
}

/* 한줄 소개 박스 focus에 따른 보더 설정 함수 */
function setBioBorder(editing) {
    if(editing) {
        $('.value.bio').css('border', '2px solid #207600');
    } else {
        $('.value.bio').css('border', 'none');
    }
}

/* 개인정보 업데이트 함수 */
function setProfile(id, bio, win, lose, image_num) {
    $('.value.id')
        .text(id);
    $('.bio_text')
        .val(bio);
    $('.value-winning')
        .text((win + lose) + '전 ' + win + '승 ' + lose + '패');
    $('#avatar')
        .css('background-image', 'url(/img/profile/' + image_num + '.png');
}

/* 그래프 업데이트 함수 */
function setBar(winRate) {
    //승롤 바 업데이트
    $('.bar.win')
        .css('width', winRate + '%')
        .text(winRate + '%');
    //패배 바 업데이트
    $('.bar.lose')
        .css('width', (100 - winRate) + '%')
        .text((100 - winRate) + '%');
}

/* 마이 랭킹 업데이트 함수 */
function setMyRank(rank, imgUrl, userId, winRate) {
    const $myRank = $('#my_rank');

    $myRank.empty();

    const myRankHtml = `
        <div class="rank_num">${myRank}</div>
            <div class="rank_user_image_wrapper">
                    <img src="${imgUrl}" class="rank_user_image" alt="유저 프로필 이미지">
            </div>
            <div class="rank_user_id">${userId}</div>
            <div class="rank_user_rate">
                <img src="../../img/win_icon.png" class="win_icon" alt="승리아이콘">
                <span class="win_rate">${winRate}</span>
            </div>`;

    $myRank.html(myRankHtml);
}

/* 랭킹 (1-10위) 업데이트 */
function setRankingList(ranks) {
    const $rankingSection = $('#ranking_section');

    $rankingSection.empty();

    ranks.forEach(rankItem => {
        const isMyself = rankItem.userId === userId;

        let rankHtml = `
            <div class="rank_item">
                <div class="rank_item_background ${isMyself ? 'highlight' : ''}">
                    <div class="rank_num">${rankItem.rank}</div>
                    <div class="rank_user_image_wrapper">
                        <img src="/img/profile/${rankItem.imageNum}.png" class="rank_user_image" alt="유저 프로필 이미지">
                    </div>
                    <div class="rank_user_id">${rankItem.userId}</div>
                    <div class="rank_user_rate">
                        <img src="/img/win_icon.png" class="win_icon" alt="승리아이콘">
                        <span class="win_rate">${rankItem.rate}%</span>
                    </div>
                </div>
            </div>
        `;
        $rankingSection.append(rankHtml);
    })
}