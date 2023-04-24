package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.ReturnedItem;

public interface ReturnedItemDao {
	void saveReturnedItems(List<ReturnedItem> returnedItems);
}
