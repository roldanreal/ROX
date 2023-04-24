package edu.up.cas.sp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class AppController {
    @Autowired
    MessageSource messageSource;
 
    /*
     * This method will redirect the page to the home page.
     */
    @RequestMapping(value = { "/" , "home"}, method = RequestMethod.GET)
    public String goToHomePage() {
        return "home";
        
    }
}