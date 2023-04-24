package edu.up.cas.sp.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import edu.up.cas.sp.dto.InventoryDto;
import edu.up.cas.sp.model.Area;
import edu.up.cas.sp.model.Inventory;
import edu.up.cas.sp.model.Item;
import edu.up.cas.sp.model.Store;
import edu.up.cas.sp.service.InventoryService;
import edu.up.cas.sp.service.ItemService;
import edu.up.cas.sp.util.InventoryUtil;

@Controller
public class InventoryController {
	
	@Autowired
    InventoryService service;
	
	@Autowired
    ItemService itemService;
	
	/*
     * This method will redirect the page to the Inventory page.
     */
    @RequestMapping(value = { "/inventory" }, method = RequestMethod.GET)
    public String goToInventoryPage() {     
        return "inventory";
    }
    
    /*
     * This method will return all inventories to the Inventory page.
     */
    @RequestMapping(value = { "/search-inventory" }, method = RequestMethod.GET)
    @ResponseBody
    public String searchInventory(HttpServletRequest request) {
    	String searchItem = request.getParameter("searchItem");
    	String searchBarcode = request.getParameter("searchBarcode");
    	String areaIdString = request.getParameter("areaid2");
    	String storeIdString = request.getParameter("storeid2");
    	
    	Integer areaIdInt = null;
    	if(areaIdString!=null) {
    		areaIdInt = Integer.parseInt(areaIdString);
    	}
    	
    	Integer storeIdInt = null;
    	if(storeIdString!=null) {
    		storeIdInt = Integer.parseInt(storeIdString);
    	}
    			
    	
    	Item item = new Item();
    	item.setItemname(searchItem);
    	
    	if(searchBarcode!=null) {
    		item.setBarCode(searchBarcode);
    	}
    	
    	Store store = new Store();

    	if(storeIdInt!=null) {
    		store.setStoreId(storeIdInt);
    	}
    	
    	
    	Area area = new Area();
    	
    	if(areaIdInt!=null) {
    		area.setAreaId(areaIdInt);
    		store.setArea(area);
    	}
    	
    	Inventory inventory = new Inventory();
    	inventory.setItem(item);
    	inventory.setStore(store);
    	
    	List<Inventory> inventoryList = service.findInventory(inventory);
    	
        Gson gson = new Gson();
        String json = gson.toJson(inventoryList);
        return json;
    }
    /*
     * This method will return all inventories to the Inventory page.
     */
    @RequestMapping(value = { "/get-inventory" }, method = RequestMethod.GET)
    @ResponseBody
    public String getInventory(HttpServletRequest request) {
//    	String usertype = request.getParameter("usertype");
    	String storeId = request.getParameter("storeId");
    	
//    	Integer usertypeInt = Integer.parseInt(usertype);
    	Integer storeIdInt = Integer.parseInt(storeId);
    	
    	List<Inventory> inventory = new ArrayList<Inventory>();
    	List<InventoryDto> inventoryList = new ArrayList<InventoryDto>();
    	
    	try {
    		inventory = service.findInventoryByStoreId(storeIdInt);
    		inventoryList = InventoryUtil.getInventories(inventory);
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
    	
        Gson gson = new Gson();
        String json = gson.toJson(inventoryList);
        return json;
    }
    
    /*
     * This method will return all inventories to the Inventory page.
     */
    @RequestMapping(value = { "/add-inventory" }, method = RequestMethod.GET)
    @ResponseBody
    public String addInventory(HttpServletRequest request) {
    	String storeId = request.getParameter("storeId");
    	String itemId = request.getParameter("itemId");
    	
    	Integer storeIdInt = Integer.parseInt(storeId);
    	Integer itemIdInt = Integer.parseInt(itemId);
    	
    	Item item = itemService.findById(itemIdInt);
    	
    	Store store = new Store();
    	store.setStoreId(storeIdInt);
    	
    	Inventory inventory = new Inventory();
    	inventory.setItem(item);
    	inventory.setStore(store);
    	inventory.setItemCount(0);
    	
    	//save inventory
    	service.saveInventory(inventory);
    	
    	//return newly-added inventory
        Gson gson = new Gson();
        String json = gson.toJson(inventory);
        return json;
    }
    
    /*
     * This method will update inventory item in the DB.
     */
    @RequestMapping(value = { "/update-inventory" }, method = RequestMethod.GET)
    @ResponseBody
    public void UpdateItem(HttpServletRequest request) {
    	String inventoryId = request.getParameter("inventoryId");
    	String itemCount = request.getParameter("itemCount");
    	
    	Integer inventoryIdInteger = Integer.parseInt(inventoryId);
    	Integer itemCountInteger = Integer.parseInt(itemCount);
    	
    	Inventory inventory = new Inventory();
    	inventory.setInventoryId(inventoryIdInteger);
    	inventory.setItemCount(itemCountInteger);
    	
    	service.updateInventory(inventory);
    }
    
    /*
     * This method will delete an inventory item by its Inventory Id.
     */
    @RequestMapping(value = { "/delete-{inventoryId}-inventory" })
    @ResponseBody
    public void deleteInventory(@PathVariable Integer inventoryId) {
        service.deleteInventory(inventoryId);
    }
}
