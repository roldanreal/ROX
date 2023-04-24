package edu.up.cas.sp.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.springframework.stereotype.Repository;

import edu.up.cas.sp.model.Usertype;

@Repository("usertypeDao")
public class UsertypeDaoImpl extends AbstractDao<Integer, Usertype> implements UsertypeDao{

	@SuppressWarnings("unchecked")
	public List<Usertype> findAllUsertypes() {
		Criteria criteria = createEntityCriteria();
        return (List<Usertype>) criteria.list();
	}

}
