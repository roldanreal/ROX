package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.ReturnItemVoucherDao;
import edu.up.cas.sp.model.ReturnItemVoucher;

@Service("returnItemService")
@Transactional
public class ReturnItemVoucherServiceImpl  implements ReturnItemVoucherService{

	@Autowired
    private ReturnItemVoucherDao dao;
	
	public void saveReturnItemVoucher(ReturnItemVoucher returnItem) {
		dao.saveReturnItemVoucher(returnItem);
	}

	public List<ReturnItemVoucher> getReturnItemVoucherById(
			Integer returnItemVoucherId) {
		return dao.getReturnItemVoucherById(returnItemVoucherId);
	}

	public void updateReturnItemVoucher(ReturnItemVoucher returnItem) {
		ReturnItemVoucher entity = dao.findByKey(returnItem.getReturnItemVoucherId());
		if(entity != null) {
			//update status
			entity.setStatus("claimed");
		} else {
			System.out.println("entity is null");
		}
	}

	public List<ReturnItemVoucher> getReturnItemVoucher(
			ReturnItemVoucher returnItemVoucher) {
		return dao.getReturnItemVoucher(returnItemVoucher);
	}

	public List<ReturnItemVoucher> getReturnItemVoucherByReceiptId(
			Integer receiptId) {
		return dao.getReturnItemVoucherByReceiptId(receiptId);
	}

}
