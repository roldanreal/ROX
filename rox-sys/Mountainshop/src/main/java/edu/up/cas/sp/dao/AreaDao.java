package edu.up.cas.sp.dao;

import java.util.List;

import edu.up.cas.sp.model.Area;

public interface AreaDao {
	List<Area> findAllArea();
	void saveArea(Area area);
	Area findById(Integer areaId);
	void deleteArea(Integer areaId);
}
