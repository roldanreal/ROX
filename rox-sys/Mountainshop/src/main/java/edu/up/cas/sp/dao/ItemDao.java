package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.Item;

public interface ItemDao {
	Item findById(Integer itemId);
	void saveItem(Item item);
	void deleteItem(Integer itemId);
	List<Item> findAllItems();
}
