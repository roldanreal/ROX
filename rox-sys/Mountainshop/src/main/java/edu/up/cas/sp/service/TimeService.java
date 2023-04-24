package edu.up.cas.sp.service;

import edu.up.cas.sp.model.Time;

public interface TimeService {
	void saveTimeInTimeOut(Time time);
	Time getTimeInToday(Integer userId);
	Time getTimeOutToday(Integer userId);
}
