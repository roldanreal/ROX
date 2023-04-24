package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.Item;

public interface ItemService {
	Item findById(Integer itemId);
	void saveItem(Item item);
	void updateItem(Item item);
	void deleteItem(Integer itemId);
	List<Item> findAllItems();
}
