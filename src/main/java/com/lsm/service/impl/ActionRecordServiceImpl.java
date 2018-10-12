package com.lsm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.lsm.dao.ActionRecordDao;
import com.lsm.entity.ActionRecordEntity;
import com.lsm.service.ActionRecordService;
import java.util.List;
import java.util.Map;

@Service("actionRecordService")
public class ActionRecordServiceImpl implements ActionRecordService {
	@Autowired
	private ActionRecordDao actionRecordDao;
	
	@Override
	public ActionRecordEntity queryObject(Integer id){
		return actionRecordDao.queryObject(id);
	}
	
	@Override
	public List<ActionRecordEntity> queryList(Map<String, Object> map){
		return actionRecordDao.queryList(map);
	}
	
	@Override
	public int queryTotal(Map<String, Object> map){
		return actionRecordDao.queryTotal(map);
	}
	
	@Override
	public void save(ActionRecordEntity actionRecord){
		actionRecordDao.save(actionRecord);
	}
	
	@Override
	public void update(ActionRecordEntity actionRecord){
		actionRecordDao.update(actionRecord);
	}
	
	@Override
	public void delete(Integer id){
		actionRecordDao.delete(id);
	}

	@Override
	public void saveBatch(List<ActionRecordEntity> list) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public ActionRecordEntity queryExist(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
