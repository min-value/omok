$(window).ready(function(){
    const pencilSrc = "../../img/pencil_icon.png";
    const checkSrc = "../../img/check_icon.png";

    let editing = false;
    //DB 연결 후 AJAX로 처리
    setProfile("bread0930", "일이삼사오륙칠팔구십일이삼사오륙칠팔구십", 10, 3, 1);
    setBar(55);

    $('#edit_icon').on('click', function() {
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
    })

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

    $('#logout-btn img').hover(
        function() {
            $('#avatar')
                .css('background-image', 'url("../../img/profile/2_sad.png")')
        },
        function() {
            $('#avatar')
                .css('background-image', 'url("../../img/profile/2.png")');
        }
    );

});

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
        .css('background-image', 'url(../../img/profile/' + image_num + '.png');
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
}