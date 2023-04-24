package edu.up.cas.sp.dao;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.Time;

@Repository("timeDao")
public class TimeDaoImpl extends AbstractDao<Integer, Time> implements TimeDao{

	public void saveTimeInTimeOut(Time time) {
		Date today = new Date();
		Timestamp timestamp = new Timestamp(today.getTime());
			String saveTimeSql = "insert into time(timeId, userId, action, timestamp)"
					+ "values('0" + "', '" + time.getUser().getUserID() + "','" + time.getAction() + "','"
					+ timestamp+"')";
			Query query = getSession().createSQLQuery(saveTimeSql);
			
			query.executeUpdate();
	}

	public Time getTimeInToday(Integer userId) {
		Query query = getSession().createQuery("Select new Time(time.timeId, time.timestamp) from Time time where time.action = 'timein'"
				+ " AND time.timestamp LIKE '" + new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'"
						+ " AND time.user.userID = '" + userId + "'");
		@SuppressWarnings("unchecked")
		List<Time> times = query.list();
		
		if (times.size() > 0)
			return (Time) times.get(0);
		else
			return null;
	}

	public Time getTimeOutToday(Integer userId) {
		Query query = getSession().createQuery("Select new Time(time.timeId, time.timestamp) from Time time where time.action = 'timeout'"
				+ " AND time.timestamp LIKE '" + new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'"
						+ " AND time.user.userID = '" + userId + "'");
		@SuppressWarnings("unchecked")
		List<Time> times = query.list();
		
		if (times.size() > 0)
			return (Time) times.get(0);
		else
			return null;
	}

}
