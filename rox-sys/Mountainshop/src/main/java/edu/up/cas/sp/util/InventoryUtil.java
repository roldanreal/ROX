package edu.up.cas.sp.util;

import java.util.ArrayList;
import java.util.List;

import edu.up.cas.sp.dto.InventoryDto;
import edu.up.cas.sp.model.Inventory;

public class InventoryUtil {
	public static List<InventoryDto> getInventories(List<Inventory> inventories) {
		List<InventoryDto> inventoryList = new ArrayList<InventoryDto>();
		for(Inventory inventory: inventories) {
			InventoryDto dto = new InventoryDto();
			dto.setStoreId(inventory.getStore().getStoreId());
			dto.setItemQuantity(inventory.getItemCount());
			dto.setItemPrice(inventory.getItem().getPrice());
			dto.setItemName(inventory.getItem().getItemname());
			dto.setItemDescription(inventory.getItem().getItemdesc());
			dto.setInventoryId(inventory.getInventoryId());
			dto.setItemId(inventory.getItem().getItemId());
			dto.setBarCode(inventory.getItem().getBarCode());
			dto.setAreaId(inventory.getStore().getArea().getAreaId());
			inventoryList.add(dto);
		}
		return inventoryList;
	}
}
