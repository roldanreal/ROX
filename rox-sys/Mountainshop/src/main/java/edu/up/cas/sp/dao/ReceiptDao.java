package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.Receipt;
import edu.up.cas.sp.model.Transaction;

public interface ReceiptDao {
	void saveReceipt(Receipt receipt);
	Receipt findByKey(Integer receiptId);
	List<Receipt> getAllReceiptsToday();
	List<Receipt> getAllReceiptsByDate(String dateFrom, String dateTo);
	List<Receipt> getReceiptsByAreaByDate(Integer areaId, String dateFrom, String dateTo);
	List<Receipt> getReceiptsByStoreByDate(Integer storeId, String dateFrom, String dateTo);
	List<Receipt> getReceiptsByAreaToday(Integer areaId);
	List<Receipt> getReceiptsByStoreToday(Integer storeId);
	List<Transaction> getTransactionsByReceiptIdToday(Integer receiptId);
}
