package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.Store;

public interface StoreDao {
	Store findById(Integer storeId);
	List<Store> findAllStores();
	void deleteStore(Integer storeId);
	void saveStore(Store store);
}