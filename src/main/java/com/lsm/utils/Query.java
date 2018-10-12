package com.lsm.utils;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.commons.lang.StringUtils;

/**
 * 查询参数
 * @author SDT13843
 *
 */
public class Query extends LinkedHashMap<String, Object> {
	private static final long serialVersionUID = 1L;
	//当前页码
    private int page;
    //每页条数
    private int limit;

    public Query(Map<String, Object> params){
        this.putAll(params);

        //分页参数
        this.page = Integer.parseInt(params.get("page").toString());
        this.limit = Integer.parseInt(params.get("limit").toString());
        this.put("offset", (page - 1) * limit);
        this.put("page", page);
        this.put("limit", limit);

        //防止SQL注入（因为sidx、order是通过拼接SQL实现排序的，会有SQL注入风险）
        String sidx = (String)params.get("sidx");
        String order = (String)params.get("order");
        if(StringUtils.isNotBlank(sidx)){
            this.put("sidx", SQLFilter.sqlInject(sidx));
        }
        if(StringUtils.isNotBlank(order)){
            this.put("order", SQLFilter.sqlInject(order));
        }

    }

    public static Map<String, Object> objectToMap(Object obj){
    	Map<String, Object> map = new HashMap<String, Object>();
    	try {
    		Class<? extends Object> cls = obj.getClass();
            Field[] fields = cls.getDeclaredFields();
            for(int i=0; i<fields.length; i++){
                Field f = fields[i];
                f.setAccessible(true);
                String key = f.getName();
                Object value = f.get(obj);
                if(StringUtils.isEmpty(key)||"serialVersionUID".equals(key))
                	continue;
                if(value == null)
                	continue;
                map.put(f.getName(), f.get(obj));
            }
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return map;
    }
    
    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }
    
}
