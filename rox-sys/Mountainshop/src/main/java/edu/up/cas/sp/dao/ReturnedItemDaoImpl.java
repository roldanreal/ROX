package edu.up.cas.sp.dao;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.ReturnedItem;

@Repository("returnedItemDao")
public class ReturnedItemDaoImpl extends AbstractDao<Integer, ReturnedItem> implements ReturnedItemDao{
	public void saveReturnedItems(List<ReturnedItem> returnedItems) {
		Date today = new Date();
		Timestamp timestamp = new Timestamp(today.getTime());
		
		String savetransactionSql = "insert into returned_item(storeId, inventoryId, receiptId, quantity, price, discount, status, timestamp)"
				+ "values";
        int returnedItemSize = returnedItems.size();

        //build the values
        //note this is not good pa
		for(int i = 0; i < returnedItemSize; i++) {
			ReturnedItem rItem = returnedItems.get(i);
					
			savetransactionSql += "('"+rItem.getStoreId()+"','" + rItem.getInventory().getInventoryId()+"','"+rItem.getTransaction().getReceipt().getReceiptId()+"','"
			+rItem.getQuantity()+"','"+rItem.getPrice()+"','"
			+rItem.getDiscount()+"','"+rItem.getStatus()+"','" + timestamp+"'";
			
			if(i<returnedItemSize-1)
				savetransactionSql += "), ";
			else
				savetransactionSql += ")";
		}
		Query query = getSession().createSQLQuery(savetransactionSql);
		
		query.executeUpdate();
	}

}
