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

import edu.up.cas.sp.model.Item;
import edu.up.cas.sp.service.ItemService;

@Controller
public class ItemController {

	@Autowired
    ItemService service;
	
	/*
     * This method will redirect the page to the Items page.
     */
    @RequestMapping(value = { "/items" }, method = RequestMethod.GET)
    public String goToItemsPage() {     
        return "items";
    }
    
    /*
     * This method will return all items to the Items page.
     */
    @RequestMapping(value = { "/get-items" }, method = RequestMethod.GET)
    @ResponseBody
    public String getItems() {
        List<Item> items = service.findAllItems();
        Gson gson = new Gson();
        String json = gson.toJson(items);
        return json;
    }
    
    /*
     * This method will add new item to DB.
     */
    @RequestMapping(value = { "/add-item" }, method = RequestMethod.GET)
    @ResponseBody
    public String saveItem(HttpServletRequest request) {
    	String itemName = request.getParameter("itemName");
    	String barCode = request.getParameter("barCode");
    	String itemDesc = request.getParameter("itemDesc");
    	String itemPrice = request.getParameter("itemPrice");
    	
    	Double iPrice = (itemPrice.equals("")?new Double(0):Double.parseDouble(itemPrice));
    	
    	Item item = new Item();
    	item.setItemname(itemName);
    	item.setBarCode(barCode);
    	item.setItemdesc(itemDesc);
    	item.setPrice(iPrice);
    	
    	//Save item
    	service.saveItem(item);
    	
    	//return the item
        Gson gson = new Gson();
        String json = gson.toJson(item);
       
        return json;
    }
    
    /*
     * This method will update item in the DB.
     */
    @RequestMapping(value = { "/update-item" }, method = RequestMethod.GET)
    @ResponseBody
    public void UpdateItem(HttpServletRequest request) {
    	String itemId = request.getParameter("itemId");
    	String itemName = request.getParameter("itemName");
    	String barCode = request.getParameter("barCode");
    	String itemDesc = request.getParameter("itemDesc");
    	String itemPrice = request.getParameter("itemPrice");
    	
    	Double iPrice = (itemPrice.equals("")?new Double(0):Double.parseDouble(itemPrice));
    	
    	Item item = new Item();
    	item.setItemId(Integer.parseInt(itemId));
    	item.setItemname(itemName);
    	item.setBarCode(barCode);
    	item.setItemdesc(itemDesc);
    	item.setPrice(iPrice);
    	
    	service.updateItem(item);
    }
    
    /*
     * This method will delete an item by its Item Id.
     */
    @RequestMapping(value = { "/delete-{itemId}-item" })
    @ResponseBody
    public void deleteItem(@PathVariable Integer itemId) {
        service.deleteItem(itemId);
    }
}
