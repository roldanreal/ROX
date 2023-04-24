package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.Transaction;

public interface TransactionService {
	void saveTransaction(Transaction transaction);
	void saveTransaction(List<Transaction> transactions);
	List<Transaction> getAllTransactions();
	List<Transaction> getTransactionsByArea(Integer areaId);
	List<Transaction> getTransactionsByStore(Integer storeId);
	List<Transaction> getTransactionsByReceipt(Integer receiptId);
}
