package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.PaymentDao;
import edu.up.cas.sp.model.Payment;

@Service("paymentService")
@Transactional
public class PaymentServiceImpl implements PaymentService{

	@Autowired
    private PaymentDao dao;
	
	public void savePayments(List<Payment> paymentList) {
		dao.savePayments(paymentList);
	}

	public List<Payment> getPaymentsByStoreToday(Integer storeId) {
		return dao.getPaymentsByStoreToday(storeId);
	}

	public List<Payment> getPaymentsByAreaToday(Integer areaId) {
		return dao.getPaymentsByAreaToday(areaId);
	}

	public List<Payment> getAllPaymentsToday() {
		return dao.getAllPaymentsToday();
	}

	public List<Payment> getPaymentsByStoreByDate(Integer storeId,
			String dateFrom, String dateTo) {
		return dao.getPaymentsByStoreByDate(storeId, dateFrom, dateTo);
	}

	public List<Payment> getPaymentsByAreaByDate(Integer areaId,
			String dateFrom, String dateTo) {
		return dao.getPaymentsByAreaByDate(areaId, dateFrom, dateTo);
	}

	public List<Payment> getAllPaymentsByDate(String dateFrom, String dateTo) {
		return dao.getAllPaymentsByDate(dateFrom, dateTo);
	}

}
