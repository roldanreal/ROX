package edu.up.cas.sp.model;

import java.util.Date;

import edu.up.cas.sp.model.Inventory;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;



//This is not yet done
@Entity
@Table(name="RETURNED_ITEM")
public class ReturnedItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int returnedItemId;
	
	@NotNull
	@Column(name = "storeId", nullable = false)
	private Integer storeId;
	
	public Integer getStoreId() {
		return storeId;
	}


	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}	
	
	@OneToOne
    @JoinColumn(name = "inventoryId")
	private Inventory inventory;
	
	@OneToOne
    @JoinColumn(name = "receiptId")
	private Transaction transaction;
	
	@NotNull
	@Column(name = "quantity", nullable = false)
	private Integer quantity;
	
	@NotNull
	@Column(name = "price", nullable = false)
	private Double price;
	
	@NotNull
	@Column(name = "discount", nullable = false)
	private Integer discount;
	
	@NotNull
	@Column(name = "status", nullable = false)
	private String status;
	
	
	@NotNull
	@Column(name = "timestamp", nullable = false)
	private Date timestamp;


	public int getReturnedItemId() {
		return returnedItemId;
	}


	public void setReturnedItemId(int returnedItemId) {
		this.returnedItemId = returnedItemId;
	}

	public Inventory getInventory() {
		return inventory;
	}


	public void setInventory(Inventory inventory) {
		this.inventory = inventory;
	}


	public Transaction getTransaction() {
		return transaction;
	}


	public void setTransaction(Transaction transaction) {
		this.transaction = transaction;
	}


	public Integer getQuantity() {
		return quantity;
	}


	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}


	public Double getPrice() {
		return price;
	}


	public void setPrice(Double price) {
		this.price = price;
	}


	public Integer getDiscount() {
		return discount;
	}


	public void setDiscount(Integer discount) {
		this.discount = discount;
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
