package com.lsm.service;

import java.util.List;
import java.util.Map;
import com.lsm.entity.ActionRecordEntity;

public interface ActionRecordService {
	
	ActionRecordEntity queryObject(Integer id);
	
	List<ActionRecordEntity> queryList(Map<String, Object> map);
	
	int queryTotal(Map<String, Object> map);
	
	void save(ActionRecordEntity actionRecord);
	
	void update(ActionRecordEntity actionRecord);
	
	void delete(Integer id);

	void saveBatch(List<ActionRecordEntity> list);

	ActionRecordEntity queryExist(Map<String, Object> map);}
