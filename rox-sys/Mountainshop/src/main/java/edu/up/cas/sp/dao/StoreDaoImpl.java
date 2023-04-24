package edu.up.cas.sp.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.Store;

@Repository("storeDao")
public class StoreDaoImpl extends AbstractDao<Integer, Store> implements StoreDao{

	@SuppressWarnings("unchecked")
	public List<Store> findAllStores() {
		Criteria criteria = createEntityCriteria();
        return (List<Store>) criteria.list();
	}

	public void saveStore(Store store) {
		persist(store);
	}

	public void deleteStore(Integer storeId) {
		Query query = getSession().createSQLQuery("delete from store where storeId = :storeId");
        query.setLong("storeId", storeId);
        query.executeUpdate();
	}

	public Store findById(Integer storeId) {
		return getByKey(storeId);
	}

}
