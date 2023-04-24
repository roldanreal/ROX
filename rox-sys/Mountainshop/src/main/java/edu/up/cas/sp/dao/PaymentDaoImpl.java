package edu.up.cas.sp.dao;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.Payment;

@Repository("paymentDao")
public class PaymentDaoImpl extends AbstractDao<Integer, Payment> implements PaymentDao{

	public void savePayments(List<Payment> paymentList) {
		
		String savePaymentSql = "insert into payment(receiptId, paymentTypeId, paymentReferenceId, amount)"
				+ "values";
        int paymentListSize = paymentList.size();

        //build the values
        //note this is not good pa
		for(int i = 0; i < paymentListSize; i++) {
			//Transaction transaction = transactions.get(i);
			Payment payment = paymentList.get(i);
			
			savePaymentSql += "('"+payment.getReceipt().getReceiptId()+"','" + payment.getPaymentType().getPaymentTypeId()+"','"+payment.getPaymentReferenceId()+"','"
			+payment.getAmount()+"'";
			
			if(i<paymentListSize-1)
				savePaymentSql += "), ";
			else
				savePaymentSql += ")";
		}
		Query query = getSession().createSQLQuery(savePaymentSql);
		
		query.executeUpdate();
	}

	@SuppressWarnings("unchecked")
	public List<Payment> getPaymentsByStoreToday(Integer storeId) {
		//current date and areaId
		Query query = getSession().createQuery("FROM Payment payment WHERE payment.receipt.store.storeId = '" + storeId + "' AND payment.receipt.timestamp LIKE '"
			+ new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'");
		return (List<Payment>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Payment> getPaymentsByAreaToday(Integer areaId) {
		//current date and areaId
		Query query = getSession().createQuery("FROM Payment payment WHERE payment.receipt.store.area.areaId = '" + areaId + "' AND payment.receipt.timestamp LIKE '"
			+ new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'");
		return (List<Payment>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Payment> getAllPaymentsToday() {
		//current date
		Query query = getSession().createQuery("FROM Payment payment WHERE payment.receipt.timestamp LIKE '"
			+ new SimpleDateFormat("yyyy-MM-dd").format(new Date().getTime()) +"%'");
		return (List<Payment>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<Payment> getPaymentsByStoreByDate(Integer storeId,
			String dateFrom, String dateTo) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//add time
		dateFrom += " 00:00:00";
		dateTo += " 23:59:59";
		
		Date fromDate;
		Date toDate;
		
		List<Payment> list = null;
		
		try {
			fromDate = df.parse(dateFrom);
			toDate = df.parse(dateTo);
			Criteria criteria = getSession().createCriteria(Payment.class)
					.createCriteria("receipt")
					.add(Restrictions.between("timestamp", fromDate, toDate))
					.createCriteria("store")
					.add(Restrictions.eq("storeId", storeId));
			list = criteria.list();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return list;
	}

	@SuppressWarnings("unchecked")
	public List<Payment> getPaymentsByAreaByDate(Integer areaId,
			String dateFrom, String dateTo) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//add time
		dateFrom += " 00:00:00";
		dateTo += " 23:59:59";
		
		Date fromDate;
		Date toDate;
		
		List<Payment> list = null;
		
		try {
			fromDate = df.parse(dateFrom);
			toDate = df.parse(dateTo);
			Criteria criteria = getSession().createCriteria(Payment.class)
					.createCriteria("receipt")
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
	public List<Payment> getAllPaymentsByDate(String dateFrom, String dateTo) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//add time
		dateFrom += " 00:00:00";
		dateTo += " 23:59:59";
		
		Date fromDate;
		Date toDate;
		
		List<Payment> list = null;
		
		try {
			fromDate = df.parse(dateFrom);
			toDate = df.parse(dateTo);
			Criteria criteria = getSession().createCriteria(Payment.class)
					.createCriteria("receipt")
					.add(Restrictions.between("timestamp", fromDate, toDate));
			list = criteria.list();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return list;
	}

}
