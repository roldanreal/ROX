package edu.up.cas.sp.model;

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
@Table(name="STORE")
public class Store {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer storeId;
	
	@NotNull
	@Column(name = "branchName", nullable = false)
	private String branchName;
	
	@NotNull
	@Column(name = "tin", nullable = false)
	private String tin;
	
	@NotNull
	@Column(name = "address", nullable = false)
	private String address;
	
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@NotNull
	@Column(name = "coordinates", nullable = false)
	private String coordinates;
	
	@OneToOne
    @JoinColumn(name="areaId")
	private Area area;

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		this.storeId = storeId;
	}

	public String getBranchName() {
		return branchName;
	}

	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}

	public String getTin() {
		return tin;
	}

	public void setTin(String tin) {
		this.tin = tin;
	}

	public String getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(String coordinates) {
		this.coordinates = coordinates;
	}

	public Area getArea() {
		return area;
	}

	public void setArea(Area area) {
		this.area = area;
	}
	
	
}
