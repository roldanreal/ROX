package edu.up.cas.sp.dao;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.User;

@Repository("userDao")
public class UserDaoImpl extends AbstractDao<Integer, User> implements UserDao{

	public User findById(Integer userId) {
		return getByKey(userId);
	}

	@SuppressWarnings("unchecked")
	public User findByName(String username) {
		Query query = getSession().createQuery("Select new User(user.userID, user.userName, user.userPassword, user.store, user.email, user.contactNo, user.usertype, user.active) from User user where user.userName='" +
				username + "'");
		List<User> users = query.list();
		return users.get(0);
	}
	
	@SuppressWarnings("unchecked")
	public User findByNameAndPassword(String username, String password) {
		Query query = getSession().createQuery("Select new User(user.userID, user.userName, user.store, user.email, user.contactNo, user.usertype, user.active) from User user where user.userName='" +
				username + "' AND user.userPassword='" + password + "'");
		List<User> users = query.list();
		return users.get(0);
	}

	@SuppressWarnings("unchecked")
	public List<User> findAllUsers() {
		Query query = getSession().createQuery("Select new User(user.userID, user.userName, user.store, user.email, user.contactNo, user.usertype, user.active) from User user");
		List<User> users = query.list();
		return users;
	}

	public void SaveUser(User user) {
		persist(user);
	}

	public void deleteUser(Integer userId) {
		Query query = getSession().createSQLQuery("delete from user where userId = :userId");
        query.setLong("userId", userId);
        query.executeUpdate();
	}

	@SuppressWarnings("unchecked")
	public List<User> findByStoreId(Integer storeId) {
		Query query = getSession().createQuery("Select new User(user.userID, user.userName, user.store, user.email, user.contactNo, user.usertype, user.active) from User user where user.usertype.usertypeId != 1 AND user.store.storeId=" + storeId);
		List<User> users = query.list();
		return users;
	}
	
}
