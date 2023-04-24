package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.ReceiptDao;
import edu.up.cas.sp.model.Receipt;
import edu.up.cas.sp.model.Transaction;

@Service("receiptService")
@Transactional
public class ReceiptServiceImpl implements ReceiptService{

	@Autowired
    private ReceiptDao dao;
	
	public void saveReceipt(Receipt receipt) {
		dao.saveReceipt(receipt);
	}

	public void updateReceipt(Receipt receipt) {
		Receipt entity = dao.findByKey(receipt.getReceiptId());
		if(entity != null) {
			entity.setAmountDue(receipt.getAmountDue());
			entity.setAmountPaid(receipt.getAmountDue());
			entity.setAmountChange(receipt.getAmountChange());
		}
	}

	public List<Receipt> getAllReceiptsToday() {
		return dao.getAllReceiptsToday();
	}

	public List<Receipt> getReceiptsByAreaToday(Integer areaId) {
		return dao.getReceiptsByAreaToday(areaId);
	}

	public List<Receipt> getReceiptsByStoreToday(Integer storeId) {
		return dao.getReceiptsByStoreToday(storeId);
	}

	public List<Transaction> getTransactionsByReceiptIdToday(Integer receiptId) {
		return dao.getTransactionsByReceiptIdToday(receiptId);
	}

	public Receipt findByKey(Integer receiptId) {
		return dao.findByKey(receiptId);
	}

	public List<Receipt> getAllReceiptsByDate(String dateFrom, String dateTo) {
		return dao.getAllReceiptsByDate(dateFrom, dateTo);
	}

	public List<Receipt> getReceiptsByAreaByDate(Integer areaId,
			String dateFrom, String dateTo) {
		return dao.getReceiptsByAreaByDate(areaId, dateFrom, dateTo);
	}

	public List<Receipt> getReceiptsByStoreByDate(Integer storeId,
			String dateFrom, String dateTo) {
		return dao.getReceiptsByStoreByDate(storeId, dateFrom, dateTo);
	}

}
