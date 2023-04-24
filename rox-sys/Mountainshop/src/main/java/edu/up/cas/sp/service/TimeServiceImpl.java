package edu.up.cas.sp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.TimeDao;
import edu.up.cas.sp.model.Time;

@Service("timeService")
@Transactional
public class TimeServiceImpl implements TimeService{

	@Autowired
    private TimeDao dao;
	
	public void saveTimeInTimeOut(Time time) {
		dao.saveTimeInTimeOut(time);
	}

	public Time getTimeInToday(Integer userId) {
		return dao.getTimeInToday(userId);
	}

	public Time getTimeOutToday(Integer userId) {
		return dao.getTimeOutToday(userId);
	}

}
