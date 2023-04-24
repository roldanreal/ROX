package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.Transaction;

public interface RMCDao {
	List<Transaction> getAllTransactions();
	List<Transaction> getTransactionsByAreaId(Integer areaId);
}