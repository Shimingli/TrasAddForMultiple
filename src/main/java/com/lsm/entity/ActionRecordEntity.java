package com.lsm.entity;

import java.io.Serializable;
import java.util.Date;


public class ActionRecordEntity implements Serializable {
	private static final long serialVersionUID = 1L;
	
	//
	private Integer id;
	//
	private String actions;
	//
	private Date actionTime;

	/**
	 * 设置：
	 */
	public void setId(Integer id) {
		this.id = id;
	}
	/**
	 * 获取：
	 */
	public Integer getId() {
		return id;
	}
	/**
	 * 设置：
	 */
	public void setActions(String actions) {
		this.actions = actions;
	}
	/**
	 * 获取：
	 */
	public String getActions() {
		return actions;
	}
	/**
	 * 设置：
	 */
	public void setActionTime(Date actionTime) {
		this.actionTime = actionTime;
	}
	/**
	 * 获取：
	 */
	public Date getActionTime() {
		return actionTime;
	}
}
