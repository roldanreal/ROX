package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.Inventory;

public interface InventoryDao {
	Inventory findById(Integer inventoryId);
	List<Inventory> findAllInventory();
	List<Inventory> findInventoryByStoreId(Integer storeId);
	List<Inventory> findInventory(Inventory inventory);
	void saveInventory(Inventory inventory);
	void deleteInventory(Integer inventoryId);
}
