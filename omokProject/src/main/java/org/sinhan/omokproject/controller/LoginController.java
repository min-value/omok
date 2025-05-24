package org.sinhan.omokproject.controller;

import lombok.extern.log4j.Log4j2;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.service.LoginService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Log4j2
@WebServlet(displayName = "loginController", urlPatterns = "/login")
public class LoginController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //바로 jsp로 전송
        req.getRequestDispatcher("/WEB-INF/view/login/login.jsp").forward(req,resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String userId = req.getParameter("userId");
        String userPw = req.getParameter("userPw");

        LoginService service = new LoginService();
        UserVO user = service.login(userId, userPw);

        //로그인 실패시 대응 만들기
        //세션에 메세지를 잠시 담아둔다.
        if (user == null) {
            HttpSession session = req.getSession();
            session.setAttribute("error", "아이디 또는 비밀번호가 잘못되었습니다.");
            resp.sendRedirect( "/login");
            return;
        }

        log.info("Session에 추가할 user 객체 : {}", user.toString());

        //세션에 저장
        HttpSession session = req.getSession();
        session.setAttribute("loginInfo", user); //세션에 저장
//        resp.sendRedirect("/omok/main");
        //일단 지금은 main화면이 없으니까 이렇게만 구성....
        resp.sendRedirect("/");
    }
}
