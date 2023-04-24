package edu.up.cas.sp.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.Inventory;

@Repository("inventoryDao")
public class InventoryDaoImpl extends AbstractDao<Integer, Inventory> implements InventoryDao{

	@SuppressWarnings("unchecked")
	public List<Inventory> findAllInventory() {
		Criteria criteria = createEntityCriteria();
        return (List<Inventory>) criteria.list();
	}

	@SuppressWarnings("unchecked")
	public List<Inventory> findInventoryByStoreId(Integer storeId) {
		Query query = getSession().createQuery("from Inventory as inv where inv.store.storeId="+storeId);
		return (List<Inventory>) query.list();
	}

	public void saveInventory(Inventory inventory) {
		persist(inventory);
	}

	public void deleteInventory(Integer inventoryId) {
		Query query = getSession().createSQLQuery("delete from inventory where inventoryId = :inventoryId");
        query.setInteger("inventoryId", inventoryId);
        query.executeUpdate();
	}

	public Inventory findById(Integer inventoryId) {
		return getByKey(inventoryId);
	}

	@SuppressWarnings("unchecked")
	public List<Inventory> findInventory(Inventory inventory) {
		System.out.println("inside dao");
		String barcode = (inventory.getItem().getBarCode()==null || inventory.getItem().getBarCode().equals(""))?null:inventory.getItem().getBarCode();
		Integer areaId = (inventory.getStore()==null)?null:(inventory.getStore().getArea()==null?null:inventory.getStore().getArea().getAreaId());
				
				
				//((Integer)inventory.getStore().getArea().getAreaId()==null)?null:inventory.getStore().getArea().getAreaId();
		Integer storeId = (inventory.getStore()==null)?null:inventory.getStore().getStoreId();
				//((Integer)inventory.getStore().getStoreId()==null)?null:inventory.getStore().getStoreId();
		String item = inventory.getItem().getItemname();
		System.out.println("barcode: " + barcode + "\nareaId: " + areaId + "\nstoreId: " + storeId + "\nitem: " + item);
		String stringQuery = "from Inventory as inv where inv.item.itemname LIKE '%" + item + "%' ";
		if(areaId!=null) {
			stringQuery += "AND inv.store.area.areaId='" + areaId + "' ";
		}
		if(storeId!=null) {
			stringQuery += "AND inv.store.storeId='" + storeId + "' ";
		}
		if(barcode!=null) {
			stringQuery += "AND inv.item.barCode='" + barcode + "' ";
		}
		//add quantity > 0
		stringQuery += "AND inv.itemCount > 0";
		
		System.out.println(stringQuery);
		
		Query query = getSession().createQuery(stringQuery);
		
		System.out.println("Length: " + (List<Inventory>) query.list()==null?null:((List<Inventory>) query.list()).size());
		return (List<Inventory>) query.list();
	}
}
