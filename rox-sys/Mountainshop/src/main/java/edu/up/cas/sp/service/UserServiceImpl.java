package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.UserDao;
import edu.up.cas.sp.model.User;

@Service("userService")
@Transactional
public class UserServiceImpl implements UserService{

	@Autowired
    private UserDao dao;
	
	public User findById(Integer userId) {
		return dao.findById(userId);
	}

	public User findByName(String username) {
		return dao.findByName(username);
	}

	public List<User> findAllUsers() {
		return dao.findAllUsers();
	}

	public User findByNameAndPassword(String username, String password) {
		User user = dao.findByName(username);
		if(user!=null) {
			if(BCrypt.checkpw(password, user.getUserPassword())) {
				//match
				return user;
			}
			return null;
		} else {
			return null;
		}
	}

	public void saveUser(User user) {
		dao.SaveUser(user);
	}

	public void deleteUser(Integer userId) {
		dao.deleteUser(userId);
	}

	public void updateUser(User user) {
		User entity = dao.findById(user.getUserID());
		if(entity != null) {
			entity.setUserName(user.getUserName());
			entity.setUsertype(user.getUsertype());
			entity.setStore(user.getStore());
			entity.setEmail(user.getEmail());
			entity.setContactNo(user.getContactNo());
		}
	}

	public void changePassword(User user) {
		User entity = dao.findById(user.getUserID());
		if(entity != null) {
			entity.setUserPassword(user.getUserPassword());
		}
	}

	public List<User> findByStoreId(Integer storeId) {
		return dao.findByStoreId(storeId);
	}

	public void enableDisableUser(User user) {
		User entity = dao.findById(user.getUserID());
		if(entity != null) {
			entity.setActive(user.getActive());
		}
	}

}
