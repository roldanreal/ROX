package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.ReturnedItemDao;
import edu.up.cas.sp.model.ReturnedItem;

@Service("returnedItemService")
@Transactional
public class ReturnedItemServiceImpl implements ReturnedItemService{
	
	@Autowired
    private ReturnedItemDao dao;

	public void saveReturnedItems(List<ReturnedItem> returnedItems) {
		dao.saveReturnedItems(returnedItems);
	}

}
