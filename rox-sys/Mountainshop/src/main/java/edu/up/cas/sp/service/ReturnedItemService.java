package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.ReturnedItem;

public interface ReturnedItemService {
	void saveReturnedItems(List<ReturnedItem> returnedItems);
}
