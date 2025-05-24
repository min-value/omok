package org.sinhan.omokproject.domain;

import lombok.*;

/*
GameVO.GameStatus status = GameVO.GameStatus.PLAYING; 라고 ENUM TYPE 사용하면 된다.

1. DB -> JAVA 문자열 변환시
GameVO.GameStatus status = GameVO.GameStatus.valueOf(rs.getString("status"));

2. JAVA -> DB 문자열 변환시
pstmt.setString(1, gameVO.getStatus().name());
 */

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameVO {
    private int gameId;
    private GameStatus status;  // enum 타입으로 정의
    private String winnerId;
    private String player1;
    private String player2;

    // enum 정의
    public enum GameStatus {
        PLAYING,   // 대기중
        WAITING,   // 진행중
        FINISHED   // 종료됨
    }
}
