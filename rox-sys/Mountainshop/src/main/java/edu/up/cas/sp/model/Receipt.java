package edu.up.cas.sp.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

@Entity
@Table(name="RECEIPT")
public class Receipt {
	
	private List<Transaction> transactions = new ArrayList<Transaction>();
	private List<Payment> payments = new ArrayList<Payment>();
	private Integer receiptId;
	private Store store;
	private User user;
	private Double amountDue;
	private Double amountPaid;
	private Double amountChange;
	private Timestamp timestamp = new Timestamp(Calendar.getInstance().getTimeInMillis());

	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "receipt", orphanRemoval = true)
	public List<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(List<Transaction> transactions) {
		this.transactions = transactions;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getReceiptId() {
		return receiptId;
	}

	public void setReceiptId(Integer receiptId) {
		this.receiptId = receiptId;
	}

	@OneToOne
    @JoinColumn(name="storeId")
	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}

	@OneToOne
    @JoinColumn(name="userId")
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@NotNull
	@Column(name = "amountDue")
	public Double getAmountDue() {
		return amountDue;
	}

	public void setAmountDue(Double amountDue) {
		this.amountDue = amountDue;
	}

	//@NotNull
	@Column(name = "amountPaid")
	public Double getAmountPaid() {
		return amountPaid;
	}

	public void setAmountPaid(Double amountPaid) {
		this.amountPaid = amountPaid;
	}

	//@NotNull
	@Column(name = "amountChange")
	public Double getAmountChange() {
		return amountChange;
	}

	public void setAmountChange(Double amountChange) {
		this.amountChange = amountChange;
	}
	
	
	public void addTransaction(Transaction transaction) {
		transactions.add(transaction);
		transaction.setReceipt(this);
    }
	
    public void removeTransaction(Transaction transaction) {
    	transaction.setReceipt(null);
    	this.transactions.remove(transaction);
    }

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "receipt", orphanRemoval = true)
	public List<Payment> getPayments() {
		return payments;
	}

	public void setPayments(List<Payment> payments) {
		this.payments = payments;
	}
	
	public void addPayment(Payment payment) {
		payments.add(payment);
		payment.setReceipt(this);
    }
	
    public void removePayment(Payment payment) {
    	payment.setReceipt(null);
    	this.payments.remove(payment);
    }
    
    @NotNull
  	@Column(name = "timestamp", nullable = false)
  	public Timestamp getTimestamp() {
  		return timestamp;
  	}

  	public void setTimestamp(Timestamp timestamp) {
  		this.timestamp = timestamp;
  	}

	
}
