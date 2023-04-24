package edu.up.cas.sp.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import edu.up.cas.sp.model.Item;

@Repository("itemDao")
public class ItemDaoImpl extends AbstractDao<Integer, Item> implements ItemDao {
	  
	public Item findById(Integer itemId) {
		return getByKey(itemId);
	}

	@SuppressWarnings("unchecked")
	public List<Item> findAllItems() {
		Criteria criteria = createEntityCriteria();
        return (List<Item>) criteria.list();
	}

	public void saveItem(Item item) {
		persist(item);
	}

	public void deleteItem(Integer itemId) {
		Query query = getSession().createSQLQuery("delete from item where itemId = :itemId");
        query.setLong("itemId", itemId);
        query.executeUpdate();
	}
}