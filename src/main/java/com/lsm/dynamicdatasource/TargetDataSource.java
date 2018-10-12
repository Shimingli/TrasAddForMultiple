package com.lsm.dynamicdatasource;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TargetDataSource {
    String name();
//    String name() default TargetDataSource.DATA_SOURCE_DEFAULT;
    
    public static final String DATA_SOURCE_FIRST = "first";
    
    public static final String DATA_SOURCE_SENCOND = "sencond";
    
    public static final String DATA_SOURCE_USER = "userDB";
    
    public static final String DATA_SOURCE_DEFAULT = "default";
    
	public static final String DATA_SOURCE_VIDEO = "videoDB";
	
	public static final String DATA_SOURCE_CACHE = "cacheDB";
}