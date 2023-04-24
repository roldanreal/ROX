package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.User;

public interface UserService {
	User findById(Integer userId);
	User findByName(String username);
	User findByNameAndPassword(String username, String password);
	List<User> findAllUsers();
	List<User> findByStoreId(Integer storeId);
	void saveUser(User user);
	void updateUser(User user);
	void changePassword(User user);
	void enableDisableUser(User user);
	void deleteUser(Integer userId);
}
