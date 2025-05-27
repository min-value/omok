const pencilSrc = `/img/pencil_icon.png`;
const checkSrc = `/img/check_icon.png`;
let editing = false; //bio 수정 상태 flag

$(window).ready(function(){
    let normalImgUrl = "/img/profile/" + imageNum + ".png";
    let sadImgUrl = "/img/profile/" + imageNum + "_sad.png";

    /* 한줄 소개 변경 클릭 리스너*/
    $('#edit_icon').on('click', function() {
        updateBio();
    })

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
    $('#logout-btn img').hover(
        function() {
            $('#avatar')
                .css('background-image', 'url(' + sadImgUrl + ')');
        },
        function() {
            $('#avatar')
                .css('background-image', 'url(' + normalImgUrl + ')');
        }
    );

});

/* 한줄 소개 변경 함수 */
function updateBio() {
    let bio_text = $('.bio_text');
    if(!editing) {
        editing = true;
        bio_text.focus();
        bio_text
            .prop('readonly', false);
        setBioBorder(editing);
        $(this)
            .attr('src', checkSrc);
    } else {
        editing = false;
        bio_text
            .prop('readonly', true);
        setBioBorder(editing);
        $(this)
            .attr('src', pencilSrc);
        let newBio = bio_text
            .val();

        alert('변경 완료하였습니다.');
        console.log(newBio);

        //db에 반영
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
function setMyRanking(rank, id, winRate) {
    let my_rank = $('#my_rank');

    //등수 업데이트


}