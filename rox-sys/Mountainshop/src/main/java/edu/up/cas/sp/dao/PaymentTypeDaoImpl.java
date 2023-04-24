package edu.up.cas.sp.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.PaymentType;

@Repository("paymentTypeDao")
public class PaymentTypeDaoImpl extends AbstractDao<Integer, PaymentType> implements PaymentTypeDao {

	@SuppressWarnings("unchecked")
	public List<PaymentType> findAllPAymentTypes() {
		Criteria criteria = createEntityCriteria();
		criteria.addOrder(Order.asc("paymentTypeId"));
        return (List<PaymentType>) criteria.list();
	}

}
