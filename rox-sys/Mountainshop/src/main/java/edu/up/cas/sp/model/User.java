package edu.up.cas.sp.model;

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
@Table(name="USER")
public class User {
	
	 public User(int userId, String userName, Store store,
		String email, String contactNo, Usertype usertype, int active) {
		 this.userID = userId;
		 this.userName = userName;
		 this.store = store;
		 this.email = email;
		 this.contactNo = contactNo;
		 this.usertype = usertype;
		 this.active =active;
	 }
	 
	 public User(int userId, String userName, String userPassword, Store store,
				String email, String contactNo, Usertype usertype, int active) {
				 this.userID = userId;
				 this.userName = userName;
				 this.userPassword = userPassword;
				 this.store = store;
				 this.email = email;
				 this.contactNo = contactNo;
				 this.usertype = usertype;
				 this.active =active;
			 }
	 
	 public User() {
		 //does nothing
	 }

	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private int userID;
	 
	 @NotNull
	 @Column(name = "userName", nullable = false)
	 private String userName;
	 
	 @NotNull
	 @Column(name = "userPassword", nullable = false)
	 private String userPassword;
	 
	 @OneToOne
	 @JoinColumn(name="storeId")
	 private Store store;

	 @NotNull
	 @Column(name = "email", nullable = false)
	 private String email;
	 
	 @NotNull
	 @Column(name = "active", nullable = false)
	 private int active;
	 
	 public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}

	@NotNull
	@Column(name = "contactNo", nullable = false)
	private String contactNo;
	 
	@OneToOne
	@JoinColumn(name="usertype")
	private Usertype usertype;

	public int getUserID() {
		return userID;
	}

	public void setUserID(int userID) {
		this.userID = userID;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserPassword() {
		return userPassword;
	}

	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContactNo() {
		return contactNo;
	}

	public void setContactNo(String contactNo) {
		this.contactNo = contactNo;
	}

	public Usertype getUsertype() {
		return usertype;
	}

	public void setUsertype(Usertype usertype) {
		this.usertype = usertype;
	}

	public int getActive() {
		return active;
	}

	public void setActive(int active) {
		this.active = active;
	}
}
