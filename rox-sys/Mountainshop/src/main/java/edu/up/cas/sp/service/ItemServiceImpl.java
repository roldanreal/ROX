package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.ItemDao;
import edu.up.cas.sp.model.Item;

@Service("itemService")
@Transactional
public class ItemServiceImpl implements ItemService{

	@Autowired
    private ItemDao dao;
	
	public Item findById(Integer itemId) {
		return dao.findById(itemId);
	}

	public List<Item> findAllItems() {
		return dao.findAllItems();
	}

	public void saveItem(Item item) {
		dao.saveItem(item);
	}

	public void deleteItem(Integer itemId) {
		dao.deleteItem(itemId);
	}
	

	public void updateItem(Item item) {
		Item entity = dao.findById(item.getItemId());
		if(entity != null) {
			entity.setItemname(item.getItemname());
			entity.setBarCode(item.getBarCode());
			entity.setItemdesc(item.getItemdesc());
			entity.setPrice(item.getPrice());
		}
	}

}
