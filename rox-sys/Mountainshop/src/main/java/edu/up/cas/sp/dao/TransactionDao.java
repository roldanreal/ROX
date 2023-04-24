package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.Transaction;

public interface TransactionDao {
	void saveTransaction(Transaction transaction);
	void saveTransaction(List<Transaction> transactions);
	List<Transaction> getAllTransactions();
	List<Transaction> getTransactionsByArea(Integer areaId);
	List<Transaction> getTransactionsByStore(Integer storeId);
	List<Transaction> getTransactionsByReceipt(Integer receiptId);
}
