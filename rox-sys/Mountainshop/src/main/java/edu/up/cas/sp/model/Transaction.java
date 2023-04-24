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
@Table(name="TRANSACTION")
public class Transaction {
	private Receipt receipt;
	
	@ManyToOne
	@JoinColumn(name = "receiptId", nullable = false)
	public Receipt getReceipt() {
		return receipt;
	}

	
	public void setReceipt(Receipt receipt) {
		this.receipt = receipt;
	}

	
	private Integer transactionId;
	private Inventory inventory;
	private Integer quantity;
	private Double price;
	private Integer discount;
	


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(Integer transactionId) {
		this.transactionId = transactionId;
	}

	/**
	 * @return
	 */
	

	@OneToOne
    @JoinColumn(name="inventoryId")
	public Inventory getInventory() {
		return inventory;
	}

	public void setInventory(Inventory inventory) {
		this.inventory = inventory;
	}


	@NotNull
	@Column(name = "price", nullable = false)
	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	@NotNull
	@Column(name = "discount", nullable = false)
	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	@NotNull
	@Column(name = "quantity", nullable = false)
	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	
}
