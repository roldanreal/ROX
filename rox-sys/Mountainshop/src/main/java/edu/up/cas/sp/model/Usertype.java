package edu.up.cas.sp.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="USERTYPE")
public class Usertype {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int usertypeId;
	 
	@NotNull
	@Column(name = "usertypeName", nullable = false)
	private String usertypeName;

	public int getUsertypeId() {
		return usertypeId;
	}

	public void setUsertypeId(int usertypeId) {
		this.usertypeId = usertypeId;
	}

	public String getUsertypeName() {
		return usertypeName;
	}

	public void setUsertypeName(String usertypeName) {
		this.usertypeName = usertypeName;
	}
}