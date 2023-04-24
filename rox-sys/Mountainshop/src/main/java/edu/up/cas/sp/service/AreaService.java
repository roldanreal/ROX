package edu.up.cas.sp.service;

import java.util.List;

import edu.up.cas.sp.model.Area;

public interface AreaService {
	List<Area> findAllArea();
	void saveArea(Area area);
	//List<Area> findByName(String areaName);
	void deleteArea(Integer areaId);
	void updateArea(Area area);
}
