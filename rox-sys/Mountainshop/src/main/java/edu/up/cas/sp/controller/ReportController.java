package edu.up.cas.sp.controller;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import edu.up.cas.sp.dto.PaymentDto;
import edu.up.cas.sp.dto.ReceiptDto;
import edu.up.cas.sp.model.Payment;
import edu.up.cas.sp.model.Receipt;
import edu.up.cas.sp.service.PaymentService;
import edu.up.cas.sp.service.RMCService;
import edu.up.cas.sp.service.ReceiptService;
import edu.up.cas.sp.service.TransactionService;
import edu.up.cas.sp.util.PaymentUtil;
import edu.up.cas.sp.util.ReceiptUtil;
import edu.up.cas.sp.util.TopSellingUtil;

@Controller
public class ReportController {
	
	@Autowired
    RMCService rmcService;
	
	@Autowired
    TransactionService transactionService;
	
	@Autowired
    ReceiptService receiptService;
	
	@Autowired
    PaymentService paymentService;
	
	/*
     * This method will redirect the page to the Items page.
     */
    @RequestMapping(value = { "/rmc" }, method = RequestMethod.GET)
    public String goToRMCPage() {     
        return "rmc";
    }
    
    /*
     * This method will redirect the page to the Items page.
     */
    @RequestMapping(value = { "/reports" }, method = RequestMethod.GET)
    public String goToReportssPage() {     
        return "reports";
    }
    
    /*
     * This method will get coordinates of Luzon map and return to client.
     */
	@RequestMapping(value = { "/getLuzonJson" }, method = RequestMethod.GET)
    @ResponseBody
    public String getLuzonJson(HttpServletRequest request) {
        HttpSession session = request.getSession();
        ServletContext sc = session.getServletContext();
        String x = sc.getRealPath("/");
        String areaJson = x + "resources/js/plugin/json/luzon.geojson";
        
    	JSONParser parser = new JSONParser();
    	String json = "";
        try {
 
            Object obj = parser.parse(new FileReader(areaJson));
 
            JSONObject jsonObject = (JSONObject) obj;
 
            Gson gson = new Gson();
            json = gson.toJson(jsonObject);
            return json;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
	
	/*
     * This method will get coordinates of Visayas map and return to client.
     */
	@RequestMapping(value = { "/getVisayasJson" }, method = RequestMethod.GET)
    @ResponseBody
    public String getVisayasJson(HttpServletRequest request) {
        HttpSession session = request.getSession();
        ServletContext sc = session.getServletContext();
        String x = sc.getRealPath("/");
        String philJson = x + "resources/js/plugin/json/visayas.geojson";
        
    	JSONParser parser = new JSONParser();
    	String json = "";
        try {
 
            Object obj = parser.parse(new FileReader(philJson));
 
            JSONObject jsonObject = (JSONObject) obj;
 
            Gson gson = new Gson();
            json = gson.toJson(jsonObject);
            return json;
            
 
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        
    }
	/*
     * This method will get payments based on parameters set
     */
	@RequestMapping(value = { "/getPayments" }, method = RequestMethod.GET)
    @ResponseBody
    public String getPayments(HttpServletRequest request) {
		
		String areaIdString = request.getParameter("areaId");
		String storeIdString = request.getParameter("storeId");
		String dateFrom = request.getParameter("dateFrom");
		String dateTo = request.getParameter("dateTo");
		
		Integer areaId = null;
		Integer storeId = null;
			
		if(areaIdString != null) {
			areaId = Integer.parseInt(request.getParameter("areaId"));
		}
		if(storeIdString != null) {
			storeId = Integer.parseInt(request.getParameter("storeId"));
		}
		
		List<Payment> payments = new ArrayList<Payment>();
		List<PaymentDto> paymentList = new ArrayList<PaymentDto>();
    	try {
    		if(storeId != null && storeId > 0) {
    			//get by store Id
    			if(dateFrom==null && dateTo==null) {
    				payments = paymentService.getPaymentsByStoreToday(storeId);
    			} else {
    				payments = paymentService.getPaymentsByStoreByDate(storeId, dateFrom, dateTo);
    			}
    			
    			
    		} else if (areaId != null && areaId > 0) {
    			//get by area Id
    			if(dateFrom==null && dateTo==null) {
    				payments = paymentService.getPaymentsByAreaToday(areaId);
    			} else {
    				payments = paymentService.getPaymentsByAreaByDate(areaId, dateFrom, dateTo);
    			}
    		} else {
    			//get all
    			if(dateFrom==null && dateTo==null) {
    				payments = paymentService.getAllPaymentsToday();
    			} else {
    				payments = paymentService.getAllPaymentsByDate(dateFrom, dateTo);
    			}
    		}
    		paymentList = PaymentUtil.getPayments(payments);
    	} catch(Exception e) {
    		e.printStackTrace();
    	}
        Gson gson = new Gson();
        String json = gson.toJson(paymentList);
        return json;
    }
	/*
     * This method will get receipts based on parameters set
     */
	@RequestMapping(value = { "/getReceipts" }, method = RequestMethod.GET)
    @ResponseBody
    public String getReceipts(HttpServletRequest request) {
		
		String areaIdString = request.getParameter("areaId");
		String storeIdString = request.getParameter("storeId");
		String dateFrom = request.getParameter("dateFrom");
		String dateTo = request.getParameter("dateTo");
		
		Integer areaId = null;
		Integer storeId = null;
			
		if(areaIdString != null) {
			areaId = Integer.parseInt(request.getParameter("areaId"));
		}
		if(storeIdString != null) {
			storeId = Integer.parseInt(request.getParameter("storeId"));
		}
		
		List<Receipt> receipts = new ArrayList<Receipt>();
		List<ReceiptDto> receiptList = new ArrayList<ReceiptDto>();
		
    	try {
    		if(storeId != null && storeId > 0) {
    			//get by store Id
    			if(dateFrom==null && dateTo==null) {
    				receipts = receiptService.getReceiptsByStoreToday(storeId);
    			} else {
    				receipts = receiptService.getReceiptsByStoreByDate(storeId, dateFrom, dateTo);
    			}
    			
    		} else if (areaId != null && areaId > 0) {
    			//get by area Id
    			if(dateFrom==null && dateTo==null) {
    				receipts = receiptService.getReceiptsByAreaToday(areaId);
    			} else {
    				receipts = receiptService.getReceiptsByAreaByDate(areaId, dateFrom, dateTo);
    			}
    		} else {
    			//get all
    			if(dateFrom==null && dateTo==null) {
    				receipts = receiptService.getAllReceiptsToday();
    			} else {
    				receipts = receiptService.getAllReceiptsByDate(dateFrom, dateTo);
    			}
    		}
    		
    		receiptList = ReceiptUtil.getReceipts(receipts);
    		
    	} catch(Exception e) {
    		e.printStackTrace();
    	}
        Gson gson = new Gson();
        String json = gson.toJson(receiptList);
        return json;
    }
	/*
     * This method will get top-selling items based on amount
     */
	@RequestMapping(value = { "/getTopSellingByAmount" }, method = RequestMethod.GET)
    @ResponseBody
    public String getTopSellingByAmount(HttpServletRequest request) {
		
		String areaIdString = request.getParameter("areaId");
		String storeIdString = request.getParameter("storeId");
		String dateFrom = request.getParameter("dateFrom");
		String dateTo = request.getParameter("dateTo");
		
		Integer areaId = null;
		Integer storeId = null;
			
		if(areaIdString != null) {
			areaId = Integer.parseInt(request.getParameter("areaId"));
		}
		if(storeIdString != null) {
			storeId = Integer.parseInt(request.getParameter("storeId"));
		}
		
		List<Receipt> receipts = new ArrayList<Receipt>();
		//List<ReceiptDto> receiptList = new ArrayList<ReceiptDto>();
		Map<String,Double> sortedMap = new TreeMap<String, Double>();
		
    	try {
    		if(storeId != null && storeId > 0) {
    			//get by store Id
    			if(dateFrom==null && dateTo==null) {
    				receipts = receiptService.getReceiptsByStoreToday(storeId);
    			} else {
    				receipts = receiptService.getReceiptsByStoreByDate(storeId, dateFrom, dateTo);
    			}
    			
    		} else if (areaId != null && areaId > 0) {
    			//get by area Id
    			if(dateFrom==null && dateTo==null) {
    				receipts = receiptService.getReceiptsByAreaToday(areaId);
    			} else {
    				receipts = receiptService.getReceiptsByAreaByDate(areaId, dateFrom, dateTo);
    			}
    		} else {
    			//get all
    			if(dateFrom==null && dateTo==null) {
    				receipts = receiptService.getAllReceiptsToday();
    			} else {
    				receipts = receiptService.getAllReceiptsByDate(dateFrom, dateTo);
    			}
    		}
    		//receiptList = ReceiptUtil.getReceipts(receipts);
    		sortedMap = TopSellingUtil.getTopSellingByAmount(receipts);
    		
    	} catch(Exception e) {
    		e.printStackTrace();
    	}
        Gson gson = new Gson();
        String json = gson.toJson(sortedMap);
        return json;
    }
	/*
     * This method will get top-selling items based on quantity
     */
	@RequestMapping(value = { "/getTopSellingByQuantity" }, method = RequestMethod.GET)
    @ResponseBody
    public String getTopSellingByQuantity(HttpServletRequest request) {
		
		String areaIdString = request.getParameter("areaId");
		String storeIdString = request.getParameter("storeId");
		String dateFrom = request.getParameter("dateFrom");
		String dateTo = request.getParameter("dateTo");
		
		Integer areaId = null;
		Integer storeId = null;
			
		if(areaIdString != null) {
			areaId = Integer.parseInt(request.getParameter("areaId"));
		}
		if(storeIdString != null) {
			storeId = Integer.parseInt(request.getParameter("storeId"));
		}
		
		List<Receipt> receipts = new ArrayList<Receipt>();
		//List<ReceiptDto> receiptList = new ArrayList<ReceiptDto>();
		Map<String, Integer> sortedMap = new TreeMap<String, Integer>();
		
    	try {
    		if(storeId != null && storeId > 0) {
    			//get by store Id
    			if(dateFrom==null && dateTo==null) {
    				receipts = receiptService.getReceiptsByStoreToday(storeId);
    			} else {
    				receipts = receiptService.getReceiptsByStoreByDate(storeId, dateFrom, dateTo);
    			}
    			
    		} else if (areaId != null && areaId > 0) {
    			//get by area Id
    			if(dateFrom==null && dateTo==null) {
    				receipts = receiptService.getReceiptsByAreaToday(areaId);
    			} else {
    				receipts = receiptService.getReceiptsByAreaByDate(areaId, dateFrom, dateTo);
    			}
    		} else {
    			//get all
    			if(dateFrom==null && dateTo==null) {
    				receipts = receiptService.getAllReceiptsToday();
    			} else {
    				receipts = receiptService.getAllReceiptsByDate(dateFrom, dateTo);
    			}
    		}
    		sortedMap = TopSellingUtil.getTopSellingByQuantity(receipts);
    		
    	} catch(Exception e) {
    		e.printStackTrace();
    	}
        Gson gson = new Gson();
        String json = gson.toJson(sortedMap);
        return json;
    }
	
	/*
     * This method will get coordinates of Davao map and return to client.
     */
	@RequestMapping(value = { "/getMindanaoJson" }, method = RequestMethod.GET)
    @ResponseBody
    public String getMindanaoJson(HttpServletRequest request) {
        HttpSession session = request.getSession();
        ServletContext sc = session.getServletContext();
        String x = sc.getRealPath("/");
        String philJson = x + "resources/js/plugin/json/mindanao.geojson";
        
    	JSONParser parser = new JSONParser();
    	String json = "";
        try {
 
            Object obj = parser.parse(new FileReader(philJson));
 
            JSONObject jsonObject = (JSONObject) obj;
 
            Gson gson = new Gson();
            json = gson.toJson(jsonObject);
            return json;
            
 
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        
    }
    
    
    
}
