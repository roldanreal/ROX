package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.PaymentTypeDao;
import edu.up.cas.sp.model.PaymentType;

@Service("paymentTypeService")
@Transactional
public class PaymentTypeServiceImpl implements PaymentTypeService{

	@Autowired
    private PaymentTypeDao dao;
	
	public List<PaymentType> findAllPAymentTypes() {
		return dao.findAllPAymentTypes();
	}

}
