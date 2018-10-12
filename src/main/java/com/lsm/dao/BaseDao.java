package com.lsm.dao;

import java.util.List;
import java.util.Map;

/**
 * 
 */
public interface BaseDao<T> {
	
	void save(T t);
	
	void save(Map<String, Object> map);
	
	void saveBatch(List<T> list);
	
	int update(T t);
	
	int update(Map<String, Object> map);
	
	int delete(Object id);
	
	int delete(Map<String, Object> map);
	
	int deleteBatch(Object[] id);

	T queryObject(Object id);
	
	List<T> queryList(Object obj);
	
	int queryTotal(Map<String, Object> map);

	int queryTotal();
}
