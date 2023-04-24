package edu.up.cas.sp.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import edu.up.cas.sp.model.Store;
import edu.up.cas.sp.model.User;
import edu.up.cas.sp.model.Usertype;
import edu.up.cas.sp.service.UserService;
import edu.up.cas.sp.service.UsertypeService;

@Controller
public class UserController {
	@Autowired
    UserService userService;
	
	@Autowired
    UsertypeService usertypeService;
	
	/*
     * This method will redirect the page to the Users page.
     */
    @RequestMapping(value = { "/users" }, method = RequestMethod.GET)
    public String goToItemsPage() {     
        return "users";
    }
    /*
     * This method will return all users depending on the usertype and storeId
     */
    @RequestMapping(value = { "/get-users" }, method = RequestMethod.GET)
    @ResponseBody
    public String getUsersByStoreId(HttpServletRequest request) {
    	String storeIdString = request.getParameter("storeId");
    	String usertypeIdString = request.getParameter("usertypeId");
    	Integer storeId = Integer.parseInt(storeIdString);
    	Integer usertypeId = Integer.parseInt(usertypeIdString);
    	
    	List<User> users = null;
    	
    	//if usertype is Proprietor
    	if(usertypeId==1)
    		users = userService.findAllUsers();
    	//if usertype is Store Manager
    	else if (usertypeId==2)
    		users = userService.findByStoreId(storeId);
    	
        Gson gson = new Gson();
        String json = gson.toJson(users);
        return json;
    }
    
    /*
     * This method will return all user types to the Users page.
     */
    @RequestMapping(value = { "/get-usertypes" }, method = RequestMethod.GET)
    @ResponseBody
    public String getUsertypes() {
        List<Usertype> usertypes = usertypeService.findAllUsertypes();
        Gson gson = new Gson();
        String json = gson.toJson(usertypes);
        return json;
    }
    /*
     * This method will add new user to DB.
     */
    @RequestMapping(value = { "/enable-disable-user" }, method = RequestMethod.GET)
    @ResponseBody
    public String enableDisableUser(HttpServletRequest request) {
    	String userId = request.getParameter("userId");
    	String isActive = request.getParameter("isActive");
    	
    	Integer userIdInt = (Integer.parseInt(userId));
    	int isActiveInt = (Integer.parseInt(isActive));
    	
    	User user = new User();
    	user.setUserID(userIdInt);
    	user.setActive(isActiveInt==0?1:0);
    	
    	//Save user
    	userService.enableDisableUser(user);
    	
    	//return the new user
        Gson gson = new Gson();
        String json = gson.toJson(user);
       
        return json;
    }
    /*
     * This method will add new user to DB.
     */
    @RequestMapping(value = { "/add-user" }, method = RequestMethod.GET)
    @ResponseBody
    public String saveItem(HttpServletRequest request) {
    	String userName = request.getParameter("userName");
    	String userPassword = request.getParameter("userPassword");
    	String usertype = request.getParameter("usertype");
    	String storeId = request.getParameter("storeId");
    	String email = request.getParameter("email");
    	String contactNo = request.getParameter("contactNo");
    	
    	
    	Integer usertypeInt = (Integer.parseInt(usertype));
    	Integer storeIdInt = (Integer.parseInt(storeId));
    	
    	Usertype userType = new Usertype();
    	userType.setUsertypeId(usertypeInt);
    	
    	Store store = new Store();
    	store.setStoreId(storeIdInt);
    	
    	User user = new User();
    	user.setUserName(userName);
    	//encrypt password
    	user.setUserPassword(BCrypt.hashpw(userPassword, BCrypt.gensalt()));
    	user.setEmail(email);
    	user.setContactNo(contactNo);
    	user.setStore(store);
    	user.setUsertype(userType);
    	user.setActive(1); //Default: Active user
    	
    	//Save user
    	userService.saveUser(user);
    	
    	//return the new user
        Gson gson = new Gson();
        String json = gson.toJson(user);
       
        return json;
    }
    /*
     * This method will update item in the DB.
     */
    @RequestMapping(value = { "/update-user" }, method = RequestMethod.GET)
    @ResponseBody
    public void updateUser(HttpServletRequest request) {
    	String userId = request.getParameter("userId");
    	String userName = request.getParameter("userName");
    	String usertype = request.getParameter("usertype");
    	String storeId = request.getParameter("storeId");
    	String email = request.getParameter("email");
    	String contactNo = request.getParameter("contactNo");
    	String isActive = request.getParameter("isActive");
    	
    	
    	Integer userIdInt = Integer.parseInt(userId);
    	Integer usertypeInt = Integer.parseInt(usertype);
    	Integer storeIdInt = Integer.parseInt(storeId);
    	Integer isActiveInt = Integer.parseInt(isActive);
    	
    	Usertype userType = new Usertype();
    	userType.setUsertypeId(usertypeInt);
    	
    	Store store = new Store();
    	store.setStoreId(storeIdInt);
    	
    	User user = new User();
    	user.setUserID(userIdInt);
    	user.setUserName(userName);
    	user.setEmail(email);
    	user.setContactNo(contactNo);
    	user.setStore(store);
    	user.setUsertype(userType);
    	user.setActive(isActiveInt);
    	
    	//update user
    	userService.updateUser(user);
    }
    
    /*
     * This method will update item in the DB.
     */
    @RequestMapping(value = { "/change-password" }, method = RequestMethod.GET)
    @ResponseBody
    public void changeUserPassword(HttpServletRequest request) {
    	String userId = request.getParameter("userId");
    	String userPassword = request.getParameter("userPassword");
    	
    	Integer userIdInt = Integer.parseInt(userId);
    	
    	User user = new User();
    	user.setUserID(userIdInt);
    	user.setUserPassword(BCrypt.hashpw(userPassword, BCrypt.gensalt()));
    	
    	//change user password
    	userService.changePassword(user);
    }
    
    /*
     * This method will get a user by its userId.
     */
    @RequestMapping(value = { "/get-{userId}-user" })
    @ResponseBody
    public String getUser(@PathVariable Integer userId) {
    	User user = userService.findById(userId);
    	
    	//return the user
        Gson gson = new Gson();
        String json = gson.toJson(user);
       
        return json;
    }
    
    /*
     * This method will delete a user by its userId.
     */
    @RequestMapping(value = { "/delete-{userId}-user" })
    @ResponseBody
    public void deleteUser(@PathVariable Integer userId) {
    	userService.deleteUser(userId);
    }
    
}
