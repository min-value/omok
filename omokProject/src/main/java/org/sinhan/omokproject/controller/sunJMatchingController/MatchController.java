package org.sinhan.omokproject.controller.sunJMatchingController;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.sinhan.omokproject.domain.GameVO;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.repository.sunJMatchingDAO.GameDAO;
import org.sinhan.omokproject.repository.sunJMatchingDAO.UserDAO;
import org.sinhan.omokproject.util.JsonBuilderUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.stream.Collectors;

/*
/omok/* 으로 잡아서 로그인에 걸릴 수 있도록 한다.
 */
@WebServlet(displayName = "matchController", urlPatterns = "/omok/match")
public class MatchController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        String jsonBody = reader.lines().collect(Collectors.joining());
        //다음과 같이 JSON으로 파싱해준다.
        JsonObject json = JsonParser.parseString(jsonBody).getAsJsonObject();

        GameDAO gameDAO = GameDAO.INSTANCE;
        UserDAO userDAO = UserDAO.INSTANCE;

        HttpSession session = req.getSession();
        //세션에서 userId를 가져온다.
        UserVO user = (UserVO) session.getAttribute("loginInfo");

        //gameId를 갖고 있을 경우에 json 메세지를 보내도록 한다.
        if(!json.has("gameId")){
            //user2가 비어 있는 방이 있는지를 먼저 찾는다.
            int gameId = gameDAO.findWaitingRoom();

            if(gameId == -1){ //방이 없다.
                //새로운 방을 생성한다.
                GameVO game = new GameVO();
                game.setPlayer1(user.getUserId());
                game.setStatus(GameVO.GameStatus.WAITING);

                //새로운 방을 생성한다.
                GameVO newGame = gameDAO.makeGame(game);

                JsonObject gameJson = JsonBuilderUtil.getGameInfo(newGame);
                JsonObject youJson = JsonBuilderUtil.getUserInfo(user);

                sendJsonResponse(resp, gameJson, youJson, null);
            } else { //방이 있다면
                //해당 방에 user2로 추가한다.
                GameVO newGame = gameDAO.getGameById(gameId);
                newGame.setPlayer2(user.getUserId());
                newGame.setStatus(GameVO.GameStatus.PLAYING);

                //방 정보 업데이트 하기
                gameDAO.updateGame(newGame);

                JsonObject gameJson = JsonBuilderUtil.getGameInfo(newGame);
                JsonObject youJson = JsonBuilderUtil.getUserInfo(user);
                //상대방 정보 아이디로 가져오기
                //지금 들어온 사람은 player2이므로 player1의 정보를 가져온다.
                JsonObject opponentJson = JsonBuilderUtil.getUserInfo(userDAO.findUserById(newGame.getPlayer1()));
                sendJsonResponse(resp, gameJson, youJson, opponentJson);
            }
        }else{
            int gameId = json.get("gameId").getAsInt();
            GameVO game = gameDAO.getGameById(gameId);

            JsonObject gameJson = JsonBuilderUtil.getGameInfo(game);
            JsonObject youJson = JsonBuilderUtil.getUserInfo(user);

            JsonObject opponentJson = null;
            if (game.getPlayer1() != null && !game.getPlayer1().equals(user.getUserId())) {
                opponentJson = JsonBuilderUtil.getUserInfo(userDAO.findUserById(game.getPlayer1()));
            } else if (game.getPlayer2() != null && !game.getPlayer2().equals(user.getUserId())) {
                opponentJson = JsonBuilderUtil.getUserInfo(userDAO.findUserById(game.getPlayer2()));
            }

            sendJsonResponse(resp, gameJson, youJson, opponentJson);
        }
    }

    private void sendJsonResponse(HttpServletResponse resp, JsonObject gameJson, JsonObject youJson, JsonObject opponentJson) throws IOException {
        JsonObject responseJson = new JsonObject();
        responseJson.add("game", gameJson);
        responseJson.add("you", youJson);

        //상대방까지 있을 경우 더한다.
        if(opponentJson != null) {
            responseJson.add("opponent", opponentJson);
        }

        Gson gson = new Gson();
        resp.setContentType("application/json; charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.print(gson.toJson(responseJson));
        out.flush();
    }
}
