package org.sinhan.omokproject.socket.sunJsocket;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.sinhan.omokproject.domain.GameVO;
import org.sinhan.omokproject.domain.UserVO;
import org.sinhan.omokproject.repository.sunJMatchingDAO.GameDAO;
import org.sinhan.omokproject.repository.sunJMatchingDAO.UserDAO;
import org.sinhan.omokproject.util.JsonBuilderUtil;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint(value = "/match")
public class MatchWebSocket {
    // gameId → 세션들
    // Set<Session>가 해당 게임방에 들어온 유저들이다.
    private static final Map<Integer, Set<Session>> gameRoomMap = new ConcurrentHashMap<>();
    // 세션 → gameId
    private static final Map<Session, Integer> sessionRoomMap = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session) throws IOException {
        // 쿼리 스트링에서 gameId 파싱 (예: ?gameId=3)
        String query = session.getQueryString(); // gameId=3
        int gameId = Integer.parseInt(query.split("=")[1]);

        // 방에 세션 추가
        gameRoomMap.computeIfAbsent(gameId, k -> ConcurrentHashMap.newKeySet()).add(session);
        sessionRoomMap.put(session, gameId);

        Set<Session> sessions = gameRoomMap.get(gameId);
        System.out.println("[WebSocket] 연결됨 - gameId: " + gameId + ", 현재 인원: " + sessions.size());

        if (sessions.size() == 1) {
            JsonObject response = new JsonObject();
            response.addProperty("status", "WAITING");
            session.getBasicRemote().sendText(response.toString());
        } else if (sessions.size() == 2) {
            // 바로 MATCHED 브로드캐스트
            sendMatchedMessageToBoth(gameId, sessions);
        }
    }

    //이 부분 약간 의심스럽기는 한데...일단 해보기
    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        Integer gameId = sessionRoomMap.get(session);
        if (gameId == null) return;

        Set<Session> sessions = gameRoomMap.get(gameId);
        if (sessions == null) return;

        // 메시지 파싱
        JsonObject receivedJson = JsonParser.parseString(message).getAsJsonObject();
        String type = receivedJson.get("type").getAsString();

        if ("match".equals(type)) {
            GameDAO gameDAO = GameDAO.INSTANCE;
            UserDAO userDAO = UserDAO.INSTANCE;

            GameVO game = gameDAO.getGameById(gameId); //게임 가져와서 정보 변경해야 한다.
            game.setStatus(GameVO.GameStatus.PLAYING);

            String player2Id = receivedJson.get("you").getAsJsonObject().get("id").getAsString();
            game.setPlayer2(player2Id);
            gameDAO.updateGame(game);

            System.out.println("[WebSocket] DB 상태 업데이트 완료: gameId = " + gameId);

            // player1, player2 정보 미리 가져오기
            UserVO player1 = userDAO.findUserById(game.getPlayer1());
            UserVO player2 = userDAO.findUserById(game.getPlayer2());

            // 각 세션에게 적절한 you/opponent 구성해서 보내기
            for (Session s : sessions) {
                if (!s.isOpen()) continue;

                String targetId = session == s ? player2.getUserId() : player1.getUserId();
                UserVO you = targetId.equals(player1.getUserId()) ? player1 : player2;
                UserVO opponent = targetId.equals(player1.getUserId()) ? player2 : player1;

                JsonObject youJson = JsonBuilderUtil.getUserInfo(you);
                JsonObject opponentJson = JsonBuilderUtil.getUserInfo(opponent);

                JsonObject response = new JsonObject();
                //일단 이건 주석처리,,,나중에 chat이랑 game연결 되면 구분할 예정
//                response.addProperty("type", "match");
                response.addProperty("status", "MATCHED");
                response.add("you", youJson);
                response.add("opponent", opponentJson);

                //추가 (선공 정하기 위함이다.)
                response.addProperty("player1", game.getPlayer1());

                s.getBasicRemote().sendText(response.toString());
            }
        }
    }

    private void sendMatchedMessageToBoth(int gameId, Set<Session> sessions) throws IOException {
        GameDAO gameDAO = GameDAO.INSTANCE;
        UserDAO userDAO = UserDAO.INSTANCE;

        GameVO game = gameDAO.getGameById(gameId);
        game.setStatus(GameVO.GameStatus.PLAYING);
        gameDAO.updateGame(game);

        UserVO player1 = userDAO.findUserById(game.getPlayer1());
        UserVO player2 = userDAO.findUserById(game.getPlayer2());

        for (Session s : sessions) {
            if (!s.isOpen()) continue;

            String userId = (sessionRoomMap.get(s) == gameId && s == sessions.toArray()[0])
                    ? player1.getUserId() : player2.getUserId();

            UserVO you = userId.equals(player1.getUserId()) ? player1 : player2;
            UserVO opponent = userId.equals(player1.getUserId()) ? player2 : player1;

            JsonObject youJson = JsonBuilderUtil.getUserInfo(you);
            JsonObject opponentJson = JsonBuilderUtil.getUserInfo(opponent);

            JsonObject response = new JsonObject();
            response.addProperty("status", "MATCHED");
            response.add("you", youJson);
            response.add("opponent", opponentJson);

            //양쪽에 보낼때 이 정보를 보낸다.
            response.addProperty("player1", game.getPlayer1()); // ✅ 이 줄 추가!

            s.getBasicRemote().sendText(response.toString());
        }
    }

    @OnClose
    public void onClose(Session session) {
        Integer gameId = sessionRoomMap.remove(session);
        if (gameId != null) {
            Set<Session> sessions = gameRoomMap.get(gameId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    gameRoomMap.remove(gameId);
                }
            }
        }
        System.out.println("[WebSocket] 연결 종료 - gameId: " + gameId);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("[WebSocket] 에러 발생:");
        throwable.printStackTrace();
    }
}

