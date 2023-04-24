package edu.up.cas.sp.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Order;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.Area;

@Repository("areaDao")
public class AreaDaoImpl extends AbstractDao<Integer, Area> implements AreaDao{

	@SuppressWarnings("unchecked")
	public List<Area> findAllArea() {
		Criteria criteria = createEntityCriteria();
		criteria.addOrder(Order.asc("areaId"));
        return (List<Area>) criteria.list();
	}

	public void saveArea(Area area) {
		persist(area);
	}

	public void deleteArea(Integer areaId) {
		Query query = getSession().createSQLQuery("delete from area where areaId = :areaId");
        query.setLong("areaId", areaId);
        query.executeUpdate();
	}

	public Area findById(Integer areaId) {
		return getByKey(areaId);
	}

}
