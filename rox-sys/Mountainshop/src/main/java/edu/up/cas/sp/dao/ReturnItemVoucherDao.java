package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.ReturnItemVoucher;

public interface ReturnItemVoucherDao {
	ReturnItemVoucher findByKey(Integer returnedItemVoucherId);
	void saveReturnItemVoucher(ReturnItemVoucher returnItemVoucher);
	List<ReturnItemVoucher> getReturnItemVoucherById(Integer returnItemVoucherId);
	List<ReturnItemVoucher> getReturnItemVoucher(ReturnItemVoucher returnItemVoucher);
	List<ReturnItemVoucher> getReturnItemVoucherByReceiptId(Integer receiptId);
}
