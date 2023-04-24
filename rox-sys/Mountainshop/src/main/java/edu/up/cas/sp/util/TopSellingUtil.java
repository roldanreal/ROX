package edu.up.cas.sp.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import edu.up.cas.sp.dto.TopSellingDto;
import edu.up.cas.sp.model.Receipt;
import edu.up.cas.sp.model.Transaction;

public class TopSellingUtil {
	public static TreeMap<String, Integer> getTopSellingByQuantity(List<Receipt> receiptList) {
		List<TopSellingDto> topSellingDto = new ArrayList<TopSellingDto>();
		
		for(Receipt receipt: receiptList) {
			List<Transaction> transactionList = receipt.getTransactions();
			for(Transaction transaction: transactionList) {
				TopSellingDto dto = new TopSellingDto();
				dto.setItemName(transaction.getInventory().getItem().getItemname());
				dto.setItemCount(transaction.getQuantity());
				dto.setAmount((transaction.getPrice() * transaction.getQuantity())*(1.0D-((transaction.getDiscount().doubleValue()/100))));
				topSellingDto.add(dto);
			}
		}
		Map<String, Integer> map = new HashMap<String, Integer>();
		
		for(TopSellingDto dto: topSellingDto) {
			if (map.containsKey(dto.getItemName())) {
				map.put(dto.getItemName(), map.get(dto.getItemName()) + dto.getItemCount());
			} else {
				map.put(dto.getItemName(), dto.getItemCount());
			}
		}
		MyIntComparator comp = new MyIntComparator(map);
		TreeMap<String, Integer> treeMap = new TreeMap<String, Integer>(comp);
		treeMap.putAll(map);
		
		Map<String, Integer> topSelling = new HashMap<String, Integer>();
		
	    // we only get the top 3
		for(Map.Entry<String,Integer> entry : treeMap.entrySet()) {
				String key = entry.getKey();
				Integer value = entry.getValue();
				topSelling.put(key, value);
				if (topSelling.size()>=3) {
					break;
				}
		}
		comp = new MyIntComparator(topSelling);
		treeMap = new TreeMap<String, Integer>(comp);
		treeMap.putAll(topSelling);
		
		return treeMap;
	}
	
	public static TreeMap<String, Double> getTopSellingByAmount(List<Receipt> receiptList) {
		List<TopSellingDto> topSellingDto = new ArrayList<TopSellingDto>();
		
		for(Receipt receipt: receiptList) {
			List<Transaction> transactionList = receipt.getTransactions();
			for(Transaction transaction: transactionList) {
				TopSellingDto dto = new TopSellingDto();
				dto.setItemName(transaction.getInventory().getItem().getItemname());
				dto.setItemCount(transaction.getQuantity());
				dto.setAmount((transaction.getPrice() * transaction.getQuantity())*(1.0D-((transaction.getDiscount().doubleValue()/100))));
				topSellingDto.add(dto);
			}
		}
		Map<String, Double> map = new HashMap<String, Double>();
		
		for(TopSellingDto dto: topSellingDto) {
			if (map.containsKey(dto.getItemName())) {
				map.put(dto.getItemName(), map.get(dto.getItemName()) + dto.getAmount());
			} else {
				map.put(dto.getItemName(), dto.getAmount());
			}
		}
		
		MyDoubleComparator comp = new MyDoubleComparator(map);
		TreeMap<String, Double> treeMap = new TreeMap<String, Double>(comp);
		treeMap.putAll(map);
		
		Map<String, Double> topSelling = new HashMap<String, Double>();
	    
	    // we only get the top 3
		for(Map.Entry<String,Double> entry : treeMap.entrySet()) {
				String key = entry.getKey();
				Double value = entry.getValue();
				topSelling.put(key, value);
				if (topSelling.size()>=3) {
					break;
				}
		}
	    
		comp = new MyDoubleComparator(topSelling);
		treeMap = new TreeMap<String, Double>(comp);
		treeMap.putAll(topSelling);
		
		return treeMap;
	}
	
}
