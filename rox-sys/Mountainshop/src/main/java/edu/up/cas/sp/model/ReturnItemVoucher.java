package edu.up.cas.sp.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="RETURN_ITEM_VOUCHER")
public class ReturnItemVoucher {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer returnItemVoucherId;
	
	@OneToOne
    @JoinColumn(name="storeId")
	private Store store;
	

	@NotNull
	@Column(name = "receiptId", nullable = false)
	private Integer receiptId;
	
	@NotNull
	@Column(name = "amount", nullable = false)
	private Double amount;
	
	@NotNull
	@Column(name = "status", nullable = false)
	private String status;
	
	@NotNull
	@Column(name = "timestamp", nullable = false)
	private Date timestamp;

	public int getReturnItemVoucherId() {
		return returnItemVoucherId;
	}

	public void setReturnItemVoucherId(int returnItemId) {
		this.returnItemVoucherId = returnItemId;
	}
	
	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}

	public Integer getReceiptId() {
		return receiptId;
	}

	public void setReceiptId(Integer receiptId) {
		this.receiptId = receiptId;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	
	
}
