package edu.up.cas.sp.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import edu.up.cas.sp.model.Area;
import edu.up.cas.sp.service.AreaService;

@Controller
public class AreaController {

	@Autowired
    AreaService service;
    
    /*
     * This method will return all areas to the Areas page.
     */
    @RequestMapping(value = { "/get-areas" }, method = RequestMethod.GET)
    @ResponseBody
    public String getAreas() {
        List<Area> areas = service.findAllArea();
        Gson gson = new Gson();
        String json = gson.toJson(areas);
        return json;
    }
    
    /*
     * This method will add new item to DB.
     */
    @RequestMapping(value = { "/add-area" }, method = RequestMethod.GET)
    @ResponseBody
    public String saveItem(HttpServletRequest request) {
    	String areaName = request.getParameter("areaName");
    	
    	Area area = new Area();
    	area.setAreaName(areaName);
    	
    	//Save area
    	service.saveArea(area);
    	
        Gson gson = new Gson();
        return gson.toJson(area);
       
    }
    
    /*
     * This method will update area in the DB.
     */
    @RequestMapping(value = { "/update-area" }, method = RequestMethod.GET)
    @ResponseBody
    public void UpdateArea(HttpServletRequest request) {
    	String areaId = request.getParameter("areaId");
    	String areaName = request.getParameter("areaName");
    	
    	System.out.println("area id: " + areaId + "\narea name: " + areaName);
    	
    	Area area = new Area();
    	area.setAreaId(Integer.parseInt(areaId));
    	area.setAreaName(areaName);
    	
    	service.updateArea(area);
    }
    
    /*
     * This method will delete an area by its Area Id.
     */
    @RequestMapping(value = { "/delete-{areaId}-area" })
    @ResponseBody
    public void deleteItem(@PathVariable Integer areaId) {
        service.deleteArea(areaId);
    }
}
