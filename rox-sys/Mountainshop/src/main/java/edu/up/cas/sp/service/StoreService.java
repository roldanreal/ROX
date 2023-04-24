package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.Store;

public interface StoreService {
	List<Store> findAllStores();
	Store findById(Integer storeId);
	void updateStore(Store store);
	void deleteStore(Integer storeId);
	void saveStore(Store store);
}
