package edu.up.cas.sp.dao;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.Transaction;

@Repository("transactionDao")
public class TransactionDaoImpl extends AbstractDao<Integer, Transaction> implements TransactionDao {

	public void saveTransaction(Transaction transaction) {
		persist(transaction);
	}

	public void saveTransaction(List<Transaction> transactions) {
		String savetransactionSql = "insert into transaction(receiptId, inventoryId, quantity, price, discount, timestamp)"
				+ "values";
        int transactionSize = transactions.size();

        //build the values
        //note this is not good pa
		for(int i = 0; i < transactionSize; i++) {
			Transaction transaction = transactions.get(i);
			savetransactionSql += "('"+transaction.getReceipt().getReceiptId()+"','"
			+transaction.getInventory().getInventoryId()+"','"
			+transaction.getQuantity()+"','"+transaction.getPrice()+"','"+transaction.getDiscount()+"'";
			
			if(i<transactionSize-1)
				savetransactionSql += "), ";
			else
				savetransactionSql += ")";
		}
		Query query = getSession().createSQLQuery(savetransactionSql);
		
		query.executeUpdate();
	}

	@SuppressWarnings("unchecked")
	public List<Transaction> getAllTransactions() {
		//current date
		Query query = getSession().createQuery("FROM Transaction trans WHERE trans.timestamp LIKE '"
		+ new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'");
		return (List<Transaction>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Transaction> getTransactionsByArea(Integer areaId) {
		//current date and areaId
		Query query = getSession().createQuery("FROM Transaction trans WHERE trans.timestamp LIKE '"
			+ new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'"
			+ "AND areaId='" + areaId + "'");
		return (List<Transaction>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Transaction> getTransactionsByStore(Integer storeId) {
		//current date and areaId
		Query query = getSession().createQuery("FROM Transaction trans WHERE trans.timestamp LIKE '"
			+ new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'"
			+ "AND storeId='" + storeId + "'");
		return (List<Transaction>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Transaction> getTransactionsByReceipt(Integer receiptId) {
		//current date and areaId
				Query query = getSession().createQuery("FROM Transaction trans WHERE trans.receipt.receiptId = '" + receiptId + "'");
				return (List<Transaction>) query.list();
	}
}
