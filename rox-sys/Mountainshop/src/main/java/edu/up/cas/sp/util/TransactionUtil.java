package edu.up.cas.sp.util;

import java.util.ArrayList;
import java.util.List;

import edu.up.cas.sp.dto.TransactionDto;
import edu.up.cas.sp.model.Transaction;

public class TransactionUtil {
	public static List<TransactionDto> getTransactions(List<Transaction> transactionList) {
		List<TransactionDto> transactionListDto = new ArrayList<TransactionDto>();
		for(Transaction transaction: transactionList) {
			TransactionDto dto = new TransactionDto();
			dto.setTransactionId(transaction.getTransactionId());
			dto.setDescription(transaction.getInventory().getItem().getItemdesc());
			dto.setReceiptId(transaction.getReceipt().getReceiptId());
			dto.setQuantity(transaction.getQuantity());
			dto.setPrice(transaction.getPrice());
			dto.setInventoryId(transaction.getInventory().getInventoryId());
			dto.setDiscount(transaction.getDiscount());
			transactionListDto.add(dto);
		}
		
		return transactionListDto;
	}
	
}
