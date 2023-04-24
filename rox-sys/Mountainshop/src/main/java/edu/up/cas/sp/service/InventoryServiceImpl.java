package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.InventoryDao;
import edu.up.cas.sp.model.Inventory;

@Service("inventoryService")
@Transactional
public class InventoryServiceImpl implements InventoryService{

	@Autowired
    private InventoryDao dao;
	
	public List<Inventory> findAllInventory() {
		return dao.findAllInventory();
	}

	public List<Inventory> findInventoryByStoreId(Integer storeId) {
		return dao.findInventoryByStoreId(storeId);
	}

	public void saveInventory(Inventory inventory) {
		dao.saveInventory(inventory);
	}

	public void deleteInventory(Integer inventoryId) {
		dao.deleteInventory(inventoryId);
	}

	public void updateInventory(Inventory inventory) {
		Inventory entity = dao.findById(inventory.getInventoryId());
		if(entity != null) {
			entity.setItemCount(inventory.getItemCount());
		}
	}

	public void updateInventoryQuantity(Inventory inventory) {
		Inventory entity = dao.findById(inventory.getInventoryId());
		if(entity != null) {
			//update quantity
			entity.setItemCount(entity.getItemCount()-inventory.getItemCount());
		}
	}

	public Inventory findById(Integer inventoryId) {
		return dao.findById(inventoryId);
	}

	public List<Inventory> findInventory(Inventory inventory) {
		return dao.findInventory(inventory);
	}

}
