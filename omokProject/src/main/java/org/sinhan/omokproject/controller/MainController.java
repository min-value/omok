package org.sinhan.omokproject.controller;

import lombok.extern.log4j.Log4j2;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Log4j2
@WebServlet(displayName = "mainController", urlPatterns = "/omok/main")
public class MainController extends HttpServlet {
    /**
     * home.jsp로 매핑
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        Object loginInfo = session.getAttribute("loginInfo");
        request.getRequestDispatcher("/WEB-INF/view/home/home.jsp").forward(request, response);
    }
}
