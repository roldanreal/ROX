package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.PaymentType;

public interface PaymentTypeDao {
	List<PaymentType> findAllPAymentTypes();
}
