package com.lsm.dto;

import java.util.Date;

/**
 * 此实体主要是用于在删表维护表时封装信息
 * @author SDT14325
 *
 */
public class TableHandlerEntity {
	private String tableName;	//表名
	private Date date;
	private String action;
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	@Override
	public String toString() {
		return "TableHandlerEntity [tableName=" + tableName + ", date=" + date + ", action=" + action + "]";
	}
	
}
