package edu.up.cas.sp.dao;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.Transaction;

@Repository("rmcDao")
public class RMCDaoImpl extends AbstractDao<Integer, Transaction> implements RMCDao{

	@SuppressWarnings("unchecked")
	public List<Transaction> getAllTransactions() {
		Query query = getSession().createQuery("from Transaction trans group by trans.receiptId");
		return (List<Transaction>) query.list();
	}

	public List<Transaction> getTransactionsByAreaId(Integer areaId) {
		
		return null;
	}

}