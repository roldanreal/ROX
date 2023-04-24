package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.Receipt;
import edu.up.cas.sp.model.Transaction;

public interface ReceiptService {
	Receipt findByKey(Integer receiptId);
	void saveReceipt(Receipt receipt);
	void updateReceipt(Receipt receipt);
	List<Receipt> getAllReceiptsToday();
	List<Receipt> getAllReceiptsByDate(String dateFrom, String dateTo);
	List<Receipt> getReceiptsByAreaByDate(Integer areaId, String dateFrom, String dateTo);
	List<Receipt> getReceiptsByStoreByDate(Integer storeId, String dateFrom, String dateTo);
	List<Receipt> getReceiptsByAreaToday(Integer areaId);
	List<Receipt> getReceiptsByStoreToday(Integer storeId);
	List<Transaction> getTransactionsByReceiptIdToday(Integer receiptId);
}
