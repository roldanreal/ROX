package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.Transaction;

public interface RMCService {
	List<Transaction> findAllTransactions();
}
