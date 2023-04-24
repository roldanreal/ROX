package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.ReturnItemVoucher;

public interface ReturnItemVoucherService {
	void saveReturnItemVoucher(ReturnItemVoucher returnItem);
	void updateReturnItemVoucher(ReturnItemVoucher returnItem);
	List<ReturnItemVoucher> getReturnItemVoucherById(Integer returnItemVoucherId);
	List<ReturnItemVoucher> getReturnItemVoucher(ReturnItemVoucher returnItemVoucher);
	List<ReturnItemVoucher> getReturnItemVoucherByReceiptId(Integer receiptId);
}
