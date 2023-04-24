package edu.up.cas.sp.dao;

import edu.up.cas.sp.model.Time;

public interface TimeDao {
	void saveTimeInTimeOut(Time time);
	Time getTimeInToday(Integer userId);
	Time getTimeOutToday(Integer userId);
}
