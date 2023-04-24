package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.User;

public interface UserDao {
	User findById(Integer userId);
	User findByName(String username);
	User findByNameAndPassword(String username, String password);
	List<User> findAllUsers();
	List<User> findByStoreId(Integer storeId);
	void SaveUser(User user);
	void deleteUser(Integer userId);
}
