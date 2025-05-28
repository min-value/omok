package org.sinhan.omokproject.service;

import lombok.extern.log4j.Log4j2;
import org.sinhan.omokproject.domain.UserStatVO;
import org.sinhan.omokproject.repository.MainDAO;

import java.util.List;

@Log4j2
public enum MainService {
    INSTANCE;
    private final MainDAO mainDao = MainDAO.INSTANCE;
    
    /* 상위 10명 불러오는 함수 */
    public List<UserStatVO> getRanks() {
        return mainDao.getRanks();
    }

    /* 내 랭킹 불러오는 함수 */
    public int getMyRank(String userId) {
        return mainDao.getMyRank(userId);
    }
}
