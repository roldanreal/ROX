package edu.up.cas.sp.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="PAYMENT")
public class Payment {

	private Integer paymentId;
	private Receipt receipt;
	private PaymentType paymentType;
	private String paymentReferenceId;
	private Double amount;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Integer paymentId) {
		this.paymentId = paymentId;
	}

	@ManyToOne
	@JoinColumn(name = "receiptId", nullable = false)
	public Receipt getReceipt() {
		return receipt;
	}

	public void setReceipt(Receipt receipt) {
		this.receipt = receipt;
	}

	@Column(name = "paymentReferenceId")
	public String getPaymentReferenceId() {
		return paymentReferenceId;
	}

	public void setPaymentReferenceId(String paymentReferenceId) {
		this.paymentReferenceId = paymentReferenceId;
	}

	@NotNull
	@Column(name = "amount")
	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	@OneToOne
    @JoinColumn(name="paymentTypeId")
	public PaymentType getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(PaymentType paymentType) {
		this.paymentType = paymentType;
	}
	
	
}
