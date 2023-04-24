package edu.up.cas.sp.controller;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.Gson;

import edu.up.cas.sp.dto.TransactionDto;
import edu.up.cas.sp.model.Inventory;
import edu.up.cas.sp.model.Item;
import edu.up.cas.sp.model.Payment;
import edu.up.cas.sp.model.PaymentType;
import edu.up.cas.sp.model.Receipt;
import edu.up.cas.sp.model.ReturnItemVoucher;
import edu.up.cas.sp.model.Store;
import edu.up.cas.sp.model.Transaction;
import edu.up.cas.sp.model.User;
import edu.up.cas.sp.service.InventoryService;
import edu.up.cas.sp.service.ItemService;
import edu.up.cas.sp.service.PaymentService;
import edu.up.cas.sp.service.PaymentTypeService;
import edu.up.cas.sp.service.ReceiptService;
import edu.up.cas.sp.service.ReturnItemVoucherService;
import edu.up.cas.sp.service.TransactionService;
import edu.up.cas.sp.util.PDFUtil;
import edu.up.cas.sp.util.TransactionUtil;

@Controller
public class CheckoutController {
	
	@Autowired
    TransactionService transactionService;
	
	@Autowired
    ReceiptService receiptService;
	
	@Autowired
    ItemService itemService;
	
	@Autowired
    InventoryService inventoryService;
	
	@Autowired
    ReturnItemVoucherService returnItemVoucherService;
	
	@Autowired
    PaymentTypeService paymentTypeService;
	
	@Autowired
    PaymentService paymentService;
	
	/*
     * This method will redirect to the Checkout page.
     */
    @RequestMapping(value = { "/checkout" }, method = RequestMethod.GET)
    public String goToCheckoutPage() {     
        return "checkout";
    }
    
    /*
     * This method will get transactions based on receipt Id
     */
	@RequestMapping(value = { "/getTransactionsByReceipt" }, method = RequestMethod.GET)
    @ResponseBody
    public String getTransactionsByReceipt(HttpServletRequest request) {
		
		Integer receiptId = Integer.parseInt(request.getParameter("receiptId"));
		List<Transaction> items;
		List<TransactionDto> transactions = new ArrayList<TransactionDto>();
		String json = null;
		Gson gson = new Gson();
		try {
			items = receiptService.getTransactionsByReceiptIdToday(receiptId);
			transactions = TransactionUtil.getTransactions(items);
			json = gson.toJson(transactions);
		}catch (Exception e) {
			e.printStackTrace();
		}
		return json;
    }
	
	/*
     * This method will get payment types
     */
	@RequestMapping(value = { "/getPaymentTypes" }, method = RequestMethod.GET)
    @ResponseBody
    public String getPaymentTypes() {
		List<PaymentType> paymentTypes;
		Gson gson = new Gson();
		String json = null;
		try {
			paymentTypes = paymentTypeService.findAllPAymentTypes();
			json = gson.toJson(paymentTypes);
		}catch(Exception e) {
			e.printStackTrace();
		}
        return json;
    }
    
    /*
     * This method will add purchased items to DB.
     */
    @RequestMapping(value = { "/checkout-items" }, method = RequestMethod.GET)
    @ResponseBody
    public String checkoutItems(HttpServletRequest request) {
    	String userName = request.getParameter("userName");
    	String transactionItems = request.getParameter("transactionItems");
    	String userIdString = request.getParameter("userId");
    	String storeDetails = request.getParameter("storeDetails");
    	String totalItems = request.getParameter("totalItems");
    	String vatableSale = request.getParameter("vatableSale");
    	String vat = request.getParameter("vat");
    	String paymentTypes = request.getParameter("paymentTypes");
    	
    	//vouchers
    	String returnedItemVouchers = request.getParameter("returnedItemVouchers");
    	//payment methods
    	String paymentMethods = request.getParameter("paymentMethods");
    	
    	String netAmountDueString = request.getParameter("netAmountDue");
    	String amountPaidString = request.getParameter("amountPaid");
    	String amountChangeString = request.getParameter("amountChange");
    	
    	Double netAmountDue = Double.parseDouble(netAmountDueString);
    	Double amountPaid = Double.parseDouble(amountPaidString);
    	Double amountChange = Double.parseDouble(amountChangeString);
    	
    	Integer userId = Integer.parseInt(userIdString);
    	
    	JSONArray voucherData = null;
    	JSONArray paymentMethodsData = null;
    	
    	//process the string, convert into json format
    	transactionItems = "{transaction: " + transactionItems + "}";
    	paymentTypes = "{paymentType: " + paymentTypes + "}";
    	
    	
    	if(returnedItemVouchers != null) {
    		returnedItemVouchers = "{returnedItemVouchers: " + returnedItemVouchers + "}";
    		final JSONObject jsonObjVouchers = new JSONObject(returnedItemVouchers);
        	voucherData = jsonObjVouchers.getJSONArray("returnedItemVouchers");
    	}
    	
    	if(paymentMethods != null) {
    		paymentMethods = "{paymentMethods: " + paymentMethods + "}";
    		final JSONObject jsonObjPaymentMethods = new JSONObject(paymentMethods);
    		paymentMethodsData = jsonObjPaymentMethods.getJSONArray("paymentMethods");
    	}
    	
    	//for transaction items
    	final JSONObject jsonObj = new JSONObject(transactionItems);
    	final JSONArray transactionData = jsonObj.getJSONArray("transaction");
    	
    	//for Payment types
    	final JSONObject jsonObjpType = new JSONObject(paymentTypes);
    	final JSONArray paymentTypeData = jsonObjpType.getJSONArray("paymentType");
    	
    	//Transfer payment Type data to a list
    	List<PaymentType> pTypeList = new ArrayList<PaymentType>();
    	if(paymentTypes != null) {
    		for(int i = 0; i < paymentTypeData.length(); i++) {
    			final JSONObject paymentJson = paymentTypeData.getJSONObject(i);
        		
    			PaymentType paymentType = new PaymentType();
    			paymentType.setPaymentTypeId(paymentJson.getInt("paymentTypeId"));
    			paymentType.setPaymentType(paymentJson.getString("paymentType"));
    			
    			pTypeList.add(paymentType);
    		}
    	}
    	
    	Receipt receipt = new Receipt();

    	try {
    		Store store = new Store();
    		store.setStoreId(Integer.parseInt(request.getParameter("storeId")));
    		receipt.setStore(store);
    		User user = new User();
    		user.setUserID(userId);
    		receipt.setUser(user);
    		receipt.setAmountDue(netAmountDue);
    		receipt.setAmountPaid(amountPaid);
    		receipt.setAmountChange(amountChange);
    		receipt.setTimestamp(new Timestamp(Calendar.getInstance(TimeZone.getTimeZone("Asia/Manila")).getTimeInMillis()));
   		
    		for (int i = 0; i < transactionData.length(); ++i) {
        		
    			Transaction transaction = new Transaction();
        		
        		Inventory inventory = new Inventory();
        		
        		final JSONObject transactionJson = transactionData.getJSONObject(i);
        		
        		Item item = new Item();
        		item.setItemdesc(transactionJson.getString("itemName"));
        		inventory.setItem(item);
        		inventory.setInventoryId(transactionJson.getInt("inventoryId"));
        		
        		//values from JSON
        		transaction.setDiscount(transactionJson.getInt("itemDiscount"));
        		transaction.setInventory(inventory);
        		transaction.setPrice(transactionJson.getDouble("itemPrice"));
        		transaction.setQuantity(transactionJson.getInt("itemQuantity"));
        		
        		receipt.addTransaction(transaction);
        		
        		//update inventory
        		Inventory inventoryToUpdate = inventoryService.findById(transactionJson.getInt("inventoryId"));
        		Integer currentQuantity = inventoryToUpdate.getItemCount();
        		System.out.println("Current count: " + currentQuantity);
        		Integer newQuantity = currentQuantity - transactionJson.getInt("itemQuantity");
        		
        		Inventory newInventory = new Inventory();
        		newInventory.setInventoryId(transactionJson.getInt("inventoryId"));
        		newInventory.setItemCount(newQuantity);
        		
        		inventoryService.updateInventory(newInventory);
        		
        	}
    		
    		//for payment methods
    		if (paymentMethods != null) {
    			for (int i = 0; i < paymentMethodsData.length(); ++i) {
    				Payment payment = new Payment();
    				PaymentType paymentType = new PaymentType();
            		final JSONObject paymentMethodsJson = paymentMethodsData.getJSONObject(i);
            		
            		paymentType.setPaymentTypeId(paymentMethodsJson.getInt("pmTypeOptionsId"));
            		payment.setReceipt(receipt);
            		payment.setPaymentType(paymentType);
            		payment.setPaymentReferenceId(paymentMethodsJson.getString("pmPaymentReferenceId"));
            		payment.setAmount(paymentMethodsJson.getDouble("pmAmountPaid"));
            				
            		receipt.addPayment(payment);
        		}
    		}
    		
    		//for vouchers
    		if (returnedItemVouchers != null) {
    			for (int i = 0; i < voucherData.length(); ++i) {
    				Payment payment = new Payment();
    				PaymentType paymentType = new PaymentType();
    				
    				ReturnItemVoucher returnItemVoucher = new ReturnItemVoucher();
            		final JSONObject voucherJson = voucherData.getJSONObject(i);
            		returnItemVoucher.setReturnItemVoucherId(voucherJson.getInt("returnedItemVoucherNumber"));
            		
            		paymentType.setPaymentTypeId(4); //4 for voucher
            		payment.setReceipt(receipt);
            		payment.setPaymentType(paymentType);
            		payment.setPaymentReferenceId(Integer.toString(voucherJson.getInt("returnedItemVoucherNumber")));
            		payment.setAmount(voucherJson.getDouble("returnedItemVoucherAmount"));
            				
            		receipt.addPayment(payment);
            		
            		returnItemVoucherService.updateReturnItemVoucher(returnItemVoucher);	
            		
        		}
    		}
    		
    		//save receipt
    		receiptService.saveReceipt(receipt);
    		
    		//print pdf
    		PDFUtil.createPDF(request, storeDetails, receipt, userName, totalItems, vatableSale, vat, pTypeList);
    		
    	}
    	catch(Exception e) {
    		e.printStackTrace();
    		return "fail";
    	}
    	return "success";	
    }
    
}
