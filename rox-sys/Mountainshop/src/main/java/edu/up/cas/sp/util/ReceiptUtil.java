package edu.up.cas.sp.util;

import java.util.ArrayList;
import java.util.List;

import edu.up.cas.sp.dto.ReceiptDto;
import edu.up.cas.sp.model.Payment;
import edu.up.cas.sp.model.Receipt;

public class ReceiptUtil {
	
	//Returns list of receipts with corresponding amounts minus voucher amount as payment
	public static List<ReceiptDto> getReceipts(List<Receipt> receipts) {
		List<ReceiptDto> receiptList = new ArrayList<ReceiptDto>();
		
		for(Receipt receipt: receipts) {
			Double totalSales = receipt.getAmountDue();
			Double voucherPayment = 0.0;
			for (Payment payment: receipt.getPayments()) {
				//Check for voucher payment
				if(payment.getPaymentType().getPaymentTypeId()==4) {
					voucherPayment += payment.getAmount();
				}
			}
			totalSales -= voucherPayment;
			ReceiptDto dto = new ReceiptDto();
			dto.setAmountDue(totalSales);
			dto.setTimestamp(receipt.getTimestamp().getTime());
			receiptList.add(dto);
		}
		return receiptList;
	}
}
