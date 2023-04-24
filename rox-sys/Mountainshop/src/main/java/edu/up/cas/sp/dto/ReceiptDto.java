package edu.up.cas.sp.dto;

public class ReceiptDto {
	private Double amountDue;
	private long timestamp;
	
	public Double getAmountDue() {
		return amountDue;
	}
	public void setAmountDue(Double amountDue) {
		this.amountDue = amountDue;
	}
	public long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}
	
}
