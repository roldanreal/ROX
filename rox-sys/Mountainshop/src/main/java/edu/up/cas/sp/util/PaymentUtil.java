package edu.up.cas.sp.util;

import java.util.ArrayList;
import java.util.List;

import edu.up.cas.sp.dto.PaymentDto;
import edu.up.cas.sp.model.Payment;

public class PaymentUtil {
	public static List<PaymentDto> getPayments(List<Payment> payments) {
		List<PaymentDto> paymentList = new ArrayList<PaymentDto>();
		for(Payment payment: payments) {
			PaymentDto dto = new PaymentDto();
			dto.setAmount(payment.getAmount());
			dto.setPaymentType(payment.getPaymentType().getPaymentType());
			paymentList.add(dto);
		}
		return paymentList;
	}
}
