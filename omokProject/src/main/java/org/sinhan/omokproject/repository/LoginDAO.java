package org.sinhan.omokproject.repository;

import lombok.Cleanup;
import lombok.extern.log4j.Log4j2;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.util.ConnectionUtil;
import org.sinhan.omokproject.util.StatUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/*
원래는 UserDAO로 가는게 맞으나...
나중에 merge할 때 분명 충돌 날 것 같아서 일단 파일 분리해서 작성
차후 마지막 리팩토링때 합칠 예정...시간이 허락 한다면
 */
@Log4j2
public enum LoginDAO {
    INSTANCE;
    public UserVO getUserByIdAndPassword(String userId, String userPw){
        String sql = "SELECT * \n" +
                "FROM USER AS u \n" +
                "JOIN STAT AS st ON u.user_id = st.user_id \n" +
                "WHERE u.user_id = ? \n" +
                "AND u.user_password = ?";

        UserVO vo = null;
        try{
            @Cleanup Connection conn = ConnectionUtil.INSTANCE.getConnection();
            @Cleanup PreparedStatement pstmt = conn.prepareStatement(sql); //sql 쿼리 날리기
            pstmt.setString(1, userId);
            pstmt.setString(2, userPw);

            @Cleanup ResultSet rs = pstmt.executeQuery();

            if(rs.next()){
                int win = rs.getInt("win");
                int lose = rs.getInt("lose");
                //static이라 인스턴스 생성하지 않아도 호출 가능
                int rate = StatUtil.calculateWinRate(win,lose);

                vo = UserVO.builder()
                        .userId(rs.getString("user_id"))
                        .userPW(rs.getString("user_password"))
                        .bio(rs.getString("bio"))
                        .image(rs.getInt("image"))
                        .win(win)
                        .lose(lose)
                        .rate(rate)
                        .build();
            }
        }catch (Exception e){
            log.error("에러 발생 : {}",e.getMessage());
            e.printStackTrace();
        }
        return vo;
    }

    public boolean isExistUserById(String userId){
        String sql = "SELECT * FROM USER WHERE user_id = ?";
        boolean exists = false;

        try{
            @Cleanup Connection conn = ConnectionUtil.INSTANCE.getConnection();
            @Cleanup PreparedStatement pstmt = conn.prepareStatement(sql); //sql 쿼리 날리기
            pstmt.setString(1, userId);

            @Cleanup ResultSet rs = pstmt.executeQuery();

            if(rs.next()){
                exists = true;
            }
        }catch (Exception e){
            log.error("에러 발생 : {}",e.getMessage());
            e.printStackTrace();
        }
        return exists;
    }
}
