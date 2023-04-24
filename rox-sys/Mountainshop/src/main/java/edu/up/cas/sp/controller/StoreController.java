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
import edu.up.cas.sp.model.Store;
import edu.up.cas.sp.service.StoreService;

@Controller
public class StoreController {

	@Autowired
    StoreService service;
	
	/*
     * This method will redirect the page to the Stores page.
     */
    @RequestMapping(value = { "/stores" }, method = RequestMethod.GET)
    public String goToItemsPage() {     
        return "stores";
    }
    
    /*
     * This method will return all stores to the Stores page.
     */
    @RequestMapping(value = { "/get-stores" }, method = RequestMethod.GET)
    @ResponseBody
    public String getStores() {
        List<Store> stores = service.findAllStores();
        Gson gson = new Gson();
        String json = gson.toJson(stores);
        return json;
        
    }
    
    /*
     * This method will add new store to DB.
     */
    @RequestMapping(value = { "/add-store" }, method = RequestMethod.GET)
    @ResponseBody
    public String saveStore(HttpServletRequest request) {
    	String areaId = request.getParameter("areaId");
    	String branchName = request.getParameter("branchName");
    	String tin = request.getParameter("tin");
    	String branchaddress = request.getParameter("branchaddress");
    	String coordinates = request.getParameter("coordinates");
    	
    	Area area = new Area();
    	area.setAreaId(Integer.parseInt(areaId));
    	
    	Store store = new Store();
    	store.setArea(area);
    	store.setBranchName(branchName);
    	store.setTin(tin);
    	store.setAddress(branchaddress);
    	store.setCoordinates(coordinates);
    	
    	//Save store
    	service.saveStore(store);
    	
    	//return the newly saved store
        Gson gson = new Gson();
        return gson.toJson(store);
    }
    /*
     * This method will update store in the DB.
     */
    @RequestMapping(value = { "/update-store" }, method = RequestMethod.GET)
    @ResponseBody
    public void UpdateItem(HttpServletRequest request) {
    	String storeId = request.getParameter("storeId");
    	String areaId = request.getParameter("areaId");
    	String branchName = request.getParameter("branchName");
    	String tin = request.getParameter("tin");
    	String branchaddress = request.getParameter("branchaddress");
    	String coordinates = request.getParameter("coordinates");
    	
    	Area area = new Area();
    	area.setAreaId(Integer.parseInt(areaId));
    	
    	Store store = new Store();
    	store.setStoreId(Integer.parseInt(storeId));;
    	store.setArea(area);
    	store.setBranchName(branchName);
    	store.setTin(tin);
    	store.setAddress(branchaddress);
    	store.setCoordinates(coordinates);
    	
    	service.updateStore(store);
    }
    /*
     * This method will delete a store by its store Id.
     */
    @RequestMapping(value = { "/delete-{storeId}-store" })
    @ResponseBody
    public void deleteStore(@PathVariable Integer storeId) {
        service.deleteStore(storeId);
    }
    /*
     * This method will retrieve a store by its store Id.
     */
    @RequestMapping(value = { "/get-{storeId}-store" })
    @ResponseBody
    public String getStoreById(@PathVariable Integer storeId) {
        Store store = service.findById(storeId);
        
        //return the store
        Gson gson = new Gson();
        return gson.toJson(store);
    }
    
}
