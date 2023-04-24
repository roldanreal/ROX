package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.TransactionDao;
import edu.up.cas.sp.model.Transaction;

@Service("transactionService")
@Transactional
public class TransactionServiceImpl implements TransactionService{

	@Autowired
    private TransactionDao dao;
	
	public void saveTransaction(Transaction transaction) {
		dao.saveTransaction(transaction);
	}

	public void saveTransaction(List<Transaction> transactions) {
		dao.saveTransaction(transactions);
	}

	public List<Transaction> getAllTransactions() {
		return dao.getAllTransactions();
	}

	public List<Transaction> getTransactionsByArea(Integer areaId) {
		return dao.getTransactionsByArea(areaId);
	}

	public List<Transaction> getTransactionsByStore(Integer storeId) {
		return dao.getTransactionsByStore(storeId);
	}

	public List<Transaction> getTransactionsByReceipt(Integer receiptId) {
		return dao.getTransactionsByReceipt(receiptId);
	}
}
