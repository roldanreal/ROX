package edu.up.cas.sp.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="TIME")
public class Time {
	
	public Time(int timeId, Date timestamp) {
		this.timeId = timeId;
		this.timestamp = timestamp;
	}
	
	public Time() {
		//do nothing
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int timeId;
	
	@OneToOne
	@JoinColumn(name="userId")
	private User user;
	
	@NotNull
	@Column(name = "action", nullable = false)
	private String action;
	
	@NotNull
	@Column(name = "timestamp", nullable = false)
	private Date timestamp;

	public int getTimeId() {
		return timeId;
	}

	public void setTimeId(int timeId) {
		this.timeId = timeId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
}
