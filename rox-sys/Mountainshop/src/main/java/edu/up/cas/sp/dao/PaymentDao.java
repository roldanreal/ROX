package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.Payment;

public interface PaymentDao {
	void savePayments(List<Payment> paymentList);
	List<Payment> getPaymentsByStoreToday(Integer storeId);
	List<Payment> getPaymentsByAreaToday(Integer areaId);
	List<Payment> getAllPaymentsToday();
	List<Payment> getPaymentsByStoreByDate(Integer storeId, String dateFrom, String dateTo);
	List<Payment> getPaymentsByAreaByDate(Integer areaId, String dateFrom, String dateTo);
	List<Payment> getAllPaymentsByDate(String dateFrom, String dateTo);
}
