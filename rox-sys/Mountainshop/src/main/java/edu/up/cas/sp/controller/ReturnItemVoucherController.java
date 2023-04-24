package edu.up.cas.sp.controller;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import edu.up.cas.sp.model.Inventory;
import edu.up.cas.sp.model.Receipt;
import edu.up.cas.sp.model.ReturnItemVoucher;
import edu.up.cas.sp.model.ReturnedItem;
import edu.up.cas.sp.model.Store;
import edu.up.cas.sp.model.Transaction;
import edu.up.cas.sp.service.ReturnItemVoucherService;
import edu.up.cas.sp.service.ReturnedItemService;

@Controller
public class ReturnItemVoucherController {
	@Autowired
    ReturnedItemService returnedItemService;
	
	@Autowired
    ReturnItemVoucherService returnItemVoucherService;
	
	/*
     * This method will redirect to the Return items page.
     */
    @RequestMapping(value = { "/return" }, method = RequestMethod.GET)
    public String goToReturnItemsPage() {     
        return "return";
    }
    /*
     * This method will add voucher as payment
     */
    @RequestMapping(value = { "/add-voucher" }, method = RequestMethod.GET)
    @ResponseBody
    public String addVoucher(HttpServletRequest request) {
    	String voucherNumberString = request.getParameter("voucherNumber");
    	String storeIdString = request.getParameter("storeId");
    	
    	Integer voucherNumber = Integer.parseInt(voucherNumberString);
    	Integer storeId = Integer.parseInt(storeIdString);
    	
    	Store store = new Store();
    	store.setStoreId(storeId);
    	
    	ReturnItemVoucher returnItemVoucher = new ReturnItemVoucher();
    	returnItemVoucher.setReturnItemVoucherId(voucherNumber);
    	returnItemVoucher.setStore(store);
    	
    	List<ReturnItemVoucher> vouchers = returnItemVoucherService.getReturnItemVoucher(returnItemVoucher);
    	
    	Gson gson = new Gson();
        String json = gson.toJson(vouchers);
        return json;
    }
    /*
     * This method will add voucher as payment
     */
    @RequestMapping(value = { "/getVoucherByReceiptId" }, method = RequestMethod.GET)
    @ResponseBody
    public String getVoucherByReceiptId(HttpServletRequest request) {
    	String receiptIdString = request.getParameter("receiptId");
    	
    	Integer receiptId = Integer.parseInt(receiptIdString);
    	
    	List<ReturnItemVoucher> vouchers = returnItemVoucherService.getReturnItemVoucherByReceiptId(receiptId);
    	
    	if(vouchers!=null && vouchers.size() > 0) {
    		return "success";
    	} else {
    		return "failed";
    	}
    }
    /*
     * This method will add purchased items to DB.
     */
    @RequestMapping(value = { "/return-items" }, method = RequestMethod.GET)
    @ResponseBody
    public String saveReturnedItem(HttpServletRequest request) {
    	String returnedItems = request.getParameter("returnedItems");
    	String storeIdString = request.getParameter("storeId");
    	
    	Integer storeId = Integer.parseInt(storeIdString);
    	
    	//process the string, convert into json format
    	returnedItems = "{returnedItems: " + returnedItems + "}";
    	
    	System.out.println("returnedItems: " + returnedItems);
    	
    	final JSONObject jsonObj = new JSONObject(returnedItems);
    	final JSONArray returnedItemData = jsonObj.getJSONArray("returnedItems");
    	
    	List<ReturnedItem> itemsToReturn = new ArrayList<ReturnedItem>();
    	
    	//Used to add in returnItem table
    	Double amountReturned = 0.0;
    	Integer receiptId = 0;
    	ReturnItemVoucher returnItem = new ReturnItemVoucher();
    	
    	try {
    		for (int i = 0; i < returnedItemData.length(); ++i) {
    			ReturnedItem returnedItem = new ReturnedItem();
    			
    			Transaction transaction = new Transaction();
        		Inventory inventory = new Inventory();
        		
        		final JSONObject returnedItemJson = returnedItemData.getJSONObject(i);
        		receiptId = returnedItemJson.getInt("receiptId");
        		
        		Receipt receipt = new Receipt();
        		receipt.setReceiptId(receiptId);
        		
        		transaction.setReceipt(receipt);
        		
        		inventory.setInventoryId(returnedItemJson.getInt("inventoryId"));
//        		transaction.setReceiptId(receiptId);
        		
        		//dummy values
        		returnedItem.setStoreId(storeId);
        		
        		//values from JSON
        		returnedItem.setInventory(inventory);
        		returnedItem.setTransaction(transaction);
        		returnedItem.setQuantity(returnedItemJson.getInt("itemQuantityToReturn"));
        		returnedItem.setPrice(returnedItemJson.getDouble("itemPrice"));
        		returnedItem.setDiscount(returnedItemJson.getInt("itemDiscount"));
        		returnedItem.setStatus("returned");
        		
        		amountReturned += ((returnedItemJson.getInt("itemQuantityToReturn") * returnedItemJson.getDouble("itemPrice")) * ((double)(1-(returnedItemJson.getDouble("itemDiscount")/100))));
        		
        		System.out.println("amount returned: " + amountReturned);
        				
        		itemsToReturn.add(returnedItem);
        		
    		}
    		
    		Date today = new Date();
    		Timestamp timestamp = new Timestamp(today.getTime());
    		
    		Store store = new Store();
    		store.setStoreId(storeId);
    		
    		
    		returnItem.setStore(store);
    		returnItem.setReceiptId(receiptId);
    		returnItem.setStatus("unclaimed");
    		returnItem.setTimestamp(timestamp);
    		
    		returnItem.setAmount(amountReturned);
    		
    		//save amount back to customer
    		returnItemVoucherService.saveReturnItemVoucher(returnItem);
    		
    		//save items to return
    		returnedItemService.saveReturnedItems(itemsToReturn);
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		return "fail";
    	}
    	return Integer.toString(returnItem.getReturnItemVoucherId());
    }
    
}
