package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.UsertypeDao;
import edu.up.cas.sp.model.Usertype;

@Service("usertypeService")
@Transactional
public class UsertypeServiceImpl implements UsertypeService{

	@Autowired
    private UsertypeDao dao;
	
	public List<Usertype> findAllUsertypes() {
		return dao.findAllUsertypes();
	}

}
