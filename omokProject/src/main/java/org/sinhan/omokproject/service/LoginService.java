package org.sinhan.omokproject.service;

import lombok.extern.log4j.Log4j2;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.repository.LoginDAO;

@Log4j2
public class LoginService {
    // 사용하는건 미리 빼두기
    private LoginDAO dao;

    public LoginService(){
        dao = LoginDAO.INSTANCE;
    }

    //로그인 결과로 vo를 return 하도록 한다.
    public UserVO login(String userId, String userPw){
        return dao.getUserByIdAndPassword(userId, userPw);
    }

    //아이디 중복 체크를 위함
    public boolean isExistId(String userId){
        return dao.isExistUserById(userId);
    }

}
