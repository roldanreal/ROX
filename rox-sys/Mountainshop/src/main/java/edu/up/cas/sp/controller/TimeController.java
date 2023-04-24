package edu.up.cas.sp.controller;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import edu.up.cas.sp.model.Time;
import edu.up.cas.sp.model.User;
import edu.up.cas.sp.service.TimeService;

@Controller
public class TimeController {
	
	@Autowired
    TimeService service;

	/*
     * This method will redirect the page to the Time and attendance page.
     */
    @RequestMapping(value = { "/time" }, method = RequestMethod.GET)
    public String goToItemsPage() {     
        return "time";
    }
    
    /*
     * This method will add time-in/time-out to DB.
     */
    @RequestMapping(value = { "/save-timeInTimeOut" }, method = RequestMethod.GET)
    @ResponseBody
    public String saveTimeInTimeOut(HttpServletRequest request) {
    	String userIdString = request.getParameter("userId");
    	String action = request.getParameter("action");
    	
    	Integer userId = Integer.parseInt(userIdString);
    	
    	User user = new User();
    	user.setUserID(userId);
    	
    	Time time = new Time();
    	time.setTimeId(0);
    	time.setUser(user);
    	time.setAction(action);
    	time.setTimestamp(new Date());
    	
    	//Save item
    	service.saveTimeInTimeOut(time);
    	
    	//return the item
        Gson gson = new Gson();
        String json = gson.toJson(time);
       
        return json;
    }
    /*
     * This method will get time in from DB.
     */
    @RequestMapping(value = { "/getTimeInToday" }, method = RequestMethod.GET)
    @ResponseBody
    public String getTimeInToday(HttpServletRequest request) {
    	String userIdString = request.getParameter("userId");
    	
    	Integer userId = Integer.parseInt(userIdString);
    	
    	User user = new User();
    	user.setUserID(userId);
    	
    	Time time = service.getTimeInToday(userId);
    	
    	//return the item
        Gson gson = new Gson();
        String json = gson.toJson(time);
       
        return json;
    }
    
    /*
     * This method will get time in from DB.
     */
    @RequestMapping(value = { "/getTimeOutToday" }, method = RequestMethod.GET)
    @ResponseBody
    public String getTimeOutToday(HttpServletRequest request) {
    	String userIdString = request.getParameter("userId");
    	
    	Integer userId = Integer.parseInt(userIdString);
    	
    	User user = new User();
    	user.setUserID(userId);
    	
    	Time time = service.getTimeOutToday(userId);
    	
    	//return the item
        Gson gson = new Gson();
        String json = gson.toJson(time);
       
        return json;
    }
}
