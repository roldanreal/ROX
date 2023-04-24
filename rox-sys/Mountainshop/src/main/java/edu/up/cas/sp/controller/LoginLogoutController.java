package edu.up.cas.sp.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import edu.up.cas.sp.model.User;
import edu.up.cas.sp.service.UserService;

@Controller
@RequestMapping("/")
public class LoginLogoutController {
	
	@Autowired
    UserService service;
	
	/*
     * This method will redirect browser to login page.
     */
    @RequestMapping(value = { "/login" })
    public String goToLogin() {
        return "login";
    }
    /*
     * This method will log out the user.
     */
    @RequestMapping(value = { "/logout" })
    public String logoutUser() {
        return "login";
    }
    
    
    /*
     * This method will be called on form submission, handling POST request for
     * user login.
     */
    @RequestMapping(value = { "/login-user"}, method = RequestMethod.GET)
    @ResponseBody
    public String login(HttpServletRequest request) {
    	
    	String userName = request.getParameter("userName");
    	String userPassword = request.getParameter("userPassword");
        
    	System.out.println("login user; username: " + userName + "\npassword: " + userPassword);
    	User user = service.findByNameAndPassword(userName, userPassword);

    	if (user!=null) {
    		//return the item
            Gson gson = new Gson();
            String json = gson.toJson(user);
           
            return json;
    	} else {
    		return "";
    	}
        
    }
 
    
    
    
    
}
