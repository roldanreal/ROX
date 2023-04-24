package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.RMCDao;
import edu.up.cas.sp.model.Transaction;

@Service("rmcService")
@Transactional
public class RMCServiceImpl implements RMCService{

	@Autowired
    private RMCDao dao;

	public List<Transaction> findAllTransactions() {
		return dao.getAllTransactions();
	}

}
