package edu.up.cas.sp.dao;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.ReturnItemVoucher;

@Repository("returnItemDao")
public class ReturnItemVoucherDaoImpl extends AbstractDao<Integer, ReturnItemVoucher> implements ReturnItemVoucherDao{

	public void saveReturnItemVoucher(ReturnItemVoucher returnItem) {
		persist(returnItem);
	}

	@SuppressWarnings("unchecked")
	public List<ReturnItemVoucher> getReturnItemVoucherById(Integer returnItemVoucherId) {
		Query query = getSession().createQuery("FROM ReturnItemVoucher voucher WHERE voucher.returnItemVoucherId = '"
				+ returnItemVoucherId +"'");
				return (List<ReturnItemVoucher>) query.list();
	}

	public ReturnItemVoucher findByKey(Integer returnedItemVoucherId) {
		return getByKey(returnedItemVoucherId);
	}

	@SuppressWarnings("unchecked")
	public List<ReturnItemVoucher> getReturnItemVoucher(
			ReturnItemVoucher returnItemVoucher) {
		Query query = getSession().createQuery("FROM ReturnItemVoucher voucher WHERE voucher.returnItemVoucherId = '"
				+ returnItemVoucher.getReturnItemVoucherId() +"' AND voucher.store.storeId = '" 
				+ returnItemVoucher.getStore().getStoreId() + "'");
				return (List<ReturnItemVoucher>) query.list();
	}

	@SuppressWarnings("unchecked")
	public List<ReturnItemVoucher> getReturnItemVoucherByReceiptId(
			Integer receiptId) {
		Query query = getSession().createQuery("FROM ReturnItemVoucher voucher WHERE voucher.receiptId = '"
				+ receiptId + "'");
				return (List<ReturnItemVoucher>) query.list();
	}

}
