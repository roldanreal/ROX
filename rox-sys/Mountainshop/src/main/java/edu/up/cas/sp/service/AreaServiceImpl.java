package edu.up.cas.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.up.cas.sp.dao.AreaDao;
import edu.up.cas.sp.model.Area;

@Service("areaService")
@Transactional
public class AreaServiceImpl implements AreaService {

	@Autowired
    private AreaDao dao;
	
	public List<Area> findAllArea() {
		return dao.findAllArea();
	}

	public void saveArea(Area area) {
		dao.saveArea(area);
	}

	public void deleteArea(Integer areaId) {
		dao.deleteArea(areaId);
	}

	public void updateArea(Area area) {
		Area entity = dao.findById(area.getAreaId());
		if(entity != null) {
			entity.setAreaName(area.getAreaName());
		}
	}

}
