package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.StoreDao;
import edu.up.cas.sp.model.Store;

@Service("storeService")
@Transactional
public class StoreServiceImpl implements StoreService{

	@Autowired
    private StoreDao dao;
	
	public List<Store> findAllStores() {
		return dao.findAllStores();
	}

	public void saveStore(Store store) {
		dao.saveStore(store);
	}

	public void deleteStore(Integer storeId) {
		dao.deleteStore(storeId);
	}

	public void updateStore(Store store) {
		Store entity = dao.findById(store.getStoreId());
		if(entity != null) {
			entity.setArea(store.getArea());
			entity.setBranchName(store.getBranchName());
			entity.setTin(store.getTin());
			entity.setAddress(store.getAddress());
			entity.setCoordinates(store.getCoordinates());
		}
	}

	public Store findById(Integer storeId) {
		return dao.findById(storeId);
	}

}
