package org.sinhan.omokproject.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.sinhan.omokproject.domain.GameVO;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.repository.sunJMatchingDAO.GameDAO;
import org.sinhan.omokproject.repository.sunJMatchingDAO.UserDAO;
import org.sinhan.omokproject.util.GameUtil;
import org.sinhan.omokproject.util.JsonBuilderUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

@WebServlet(displayName = "gameController", urlPatterns = "/omok/play")
public class GameController extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        String jsonBody = reader.lines().collect(Collectors.joining());
        JsonObject json = JsonParser.parseString(jsonBody).getAsJsonObject();

        GameDAO gameDAO = GameDAO.INSTANCE;
        UserDAO userDAO = UserDAO.INSTANCE;

        HttpSession session = req.getSession();
        UserVO user = (UserVO) session.getAttribute("loginInfo");

        int gameId = json.get("gameId").getAsInt();
        int x = json.get("x").getAsInt();
        int y = json.get("y").getAsInt();
        int turn = json.get("turn").getAsInt();
        GameVO game = gameDAO.getGameById(gameId);
        int[][] board = game.getBoard();

        int stone = game.getPlayer1().equals(user.getUserId()) ? 1 : 2;

        JsonObject responseJson = new JsonObject();

        if (!GameUtil.isValidMove(board, x, y)) {
            responseJson.addProperty("result", "invalid");
        } else {
            // 착수
            board[y][x] = stone;
            game.setBoard(board);
            game.setTurn(stone == 1 ? 2 : 1);

            if (GameUtil.checkWin(board, x, y, stone)) {
                game.setStatus(GameVO.GameStatus.FINISHED);
                game.setWinnerId(user.getUserId());
                responseJson.addProperty("result", "win");
                gameDAO.finishGame(game);
            } else {
                responseJson.addProperty("result", "continue");
            }

            gameDAO.updateGame(game);
        }

        responseJson.add("game", JsonBuilderUtil.getGameInfo(game));
        responseJson.add("you", JsonBuilderUtil.getUserInfo(user));

        // 상대방 정보 추가
        String opponentId = stone == 1 ? game.getPlayer2() : game.getPlayer1();
        if (opponentId != null) {
            UserVO opponent = userDAO.findUserById(opponentId);
            responseJson.add("opponent", JsonBuilderUtil.getUserInfo(opponent));
        }

        sendJson(resp, responseJson);
    }

    private void sendJson(HttpServletResponse resp, JsonObject jsonObject) throws IOException {
        resp.setContentType("application/json; charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.print(new Gson().toJson(jsonObject));
        out.flush();
    }
}
