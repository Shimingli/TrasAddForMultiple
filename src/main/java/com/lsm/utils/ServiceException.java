package com.lsm.utils;

public class ServiceException extends RuntimeException {

	private static final long serialVersionUID = -4810076833215030459L;

	public static final int CODE_SERVER_EXCEPTION = 1000;

	public static final int CODE_DATA_INSERT_EXCEPTION = 1001;
	public static final int CODE_DATA_QUERY_EXCEPTION = 1002;
	public static final int CODE_DATA_UPDATE_EXCEPTION = 1003;
	public static final int CODE_DATA_DELETE_EXCEPITON = 1004;

	public static final int CODE_DATA_ALREADY_EXISTED = 1101;

	public static final int CODE_REQUEST_PARAM_EXCEPTION = 1201;

	public static final String MESSAGE_SERVER_EXCEPTION = "服务器异常，请联系管理员";
	public static final String MESSAGE_DATA_INSERT_EXCEPTION = "添加数据失败";
	public static final String MESSAGE_DATA_QUERY_EXCEPTION = "查询数据失败";
	public static final String MESSAGE_DATA_UPDATE_EXCEPTION = "更新数据失败";
	public static final String MESSAGE_DATA_DELETE_EXCEPTION = "删除数据失败";
	public static final String MESSAGE_DATA_ALREADY_EXISTED = "数据已经存在，请勿重复添加";
	public static final String MESSAGE_REQUEST_PARAM_EXCEPTION = "请求参数异常";

	public ServiceException(String msg) {
		super(msg);
		this.msg = msg;
	}

	public ServiceException(Integer status, String msg) {
		super(msg);
		this.msg = msg;
		this.status = status;
	}

	public ServiceException(String msg, Throwable t) {
		super(msg, t);
		this.msg = msg;
	}

	public ServiceException(Throwable t) {
		super(t);
	}

	public ServiceException(Throwable t, Integer status) {
		super(t);
		this.status = status;
	}

	public ServiceException(Integer status, String msg, Throwable t) {
		super(msg, t);
		this.msg = msg;
		this.status = status;
	}

	private Integer status;

	private String msg = "";

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	@Override
	public String toString() {
		return super.toString() + "=>[status: " + status + "]";
	}
}
