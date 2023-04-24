package edu.up.cas.sp.dao;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.Receipt;
import edu.up.cas.sp.model.Transaction;

@Repository("receiptDao")
public class ReceiptDaoImpl extends AbstractDao<Integer, Receipt> implements ReceiptDao{

	public void saveReceipt(Receipt receipt) {
		persist(receipt);
	}

	public Receipt findByKey(Integer receiptId) {
		return getByKey(receiptId);
	}

	@SuppressWarnings("unchecked")
	public List<Receipt> getAllReceiptsToday() {
		//current date
		Query query = getSession().createQuery("FROM Receipt receipt WHERE receipt.timestamp LIKE '"
				+ new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'");
		return (List<Receipt>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Receipt> getReceiptsByAreaToday(Integer areaId) {
		//current date and areaId
		Query query = getSession().createQuery("FROM Receipt receipt WHERE receipt.timestamp LIKE '"
			+ new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'"
			+ "AND receipt.store.area.areaId='" + areaId + "'");
		return (List<Receipt>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Receipt> getReceiptsByStoreToday(Integer storeId) {
		//current date and storeId
		Query query = getSession().createQuery("FROM Receipt receipt WHERE receipt.timestamp LIKE '"
			+ new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'"
			+ "AND receipt.store.storeId='" + storeId + "'");
		return (List<Receipt>) query.list();
	}

	public List<Transaction> getTransactionsByReceiptIdToday(Integer receiptId) {
		return getByKey(receiptId).getTransactions();
	}

	@SuppressWarnings("unchecked")
	public List<Receipt> getAllReceiptsByDate(String dateFrom, String dateTo) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//add time
		dateFrom += " 00:00:00";
		dateTo += " 23:59:59";
		
		Date fromDate;
		Date toDate;
		
		List<Receipt> list = null;
		
		try {
			fromDate = df.parse(dateFrom);
			toDate = df.parse(dateTo);
			Criteria criteria = getSession().createCriteria(Receipt.class)
					   .add(Restrictions.between("timestamp", fromDate, toDate));
			list = criteria.list();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return list;
	}

	@SuppressWarnings("unchecked")
	public List<Receipt> getReceiptsByAreaByDate(Integer areaId,
			String dateFrom, String dateTo) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//add time
		dateFrom += " 00:00:00";
		dateTo += " 23:59:59";
		
		Date fromDate;
		Date toDate;
		
		List<Receipt> list = null;
		
		try {
			fromDate = df.parse(dateFrom);
			toDate = df.parse(dateTo);
			Criteria criteria = getSession().createCriteria(Receipt.class)
					.add(Restrictions.between("timestamp", fromDate, toDate))
					.createCriteria("store")
					.createCriteria("area")
					.add(Restrictions.eq("areaId", areaId));
			list = criteria.list();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return list;
	}

	@SuppressWarnings("unchecked")
	public List<Receipt> getReceiptsByStoreByDate(Integer storeId,
			String dateFrom, String dateTo) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//add time
		dateFrom += " 00:00:00";
		dateTo += " 23:59:59";
		
		Date fromDate;
		Date toDate;
		
		List<Receipt> list = null;
		
		try {
			fromDate = df.parse(dateFrom);
			toDate = df.parse(dateTo);
			Criteria criteria = getSession().createCriteria(Receipt.class)
					.add(Restrictions.eq("store.storeId", storeId))
					.add(Restrictions.between("timestamp",fromDate,toDate));
			list = criteria.list();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return list;
	}

}
