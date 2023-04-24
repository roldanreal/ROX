package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.Inventory;

public interface InventoryService {
	Inventory findById(Integer inventoryId);
	List<Inventory> findAllInventory();
	List<Inventory> findInventoryByStoreId(Integer storeId);
	List<Inventory> findInventory(Inventory inventory);
	void saveInventory(Inventory inventory);
	void updateInventory(Inventory inventory);
	void deleteInventory(Integer inventoryId);
	void updateInventoryQuantity(Inventory inventory);
}
