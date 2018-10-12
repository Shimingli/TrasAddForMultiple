package com.lsm.dynamicdatasource;

import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.PropertyValues;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.GenericBeanDefinition;
import org.springframework.boot.bind.RelaxedDataBinder;
import org.springframework.boot.bind.RelaxedPropertyResolver;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotationMetadata;
import org.springframework.util.StringUtils;
import com.alibaba.druid.pool.DruidDataSource;

public class DynamicDataSourceRegister implements ImportBeanDefinitionRegistrar, EnvironmentAware {

	private static final Logger logger = LogManager.getLogger(DynamicDataSourceRegister.class);

	private ConversionService conversionService = new DefaultConversionService();
	private PropertyValues dataSourcePropertyValues;

	// 数据源
	private DataSource defaultDataSource;
	private Map<String, DataSource> customDataSources = new HashMap<>();

	@Override
	public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata,BeanDefinitionRegistry registry) {
		Map<Object, Object> targetDataSources = new HashMap<Object, Object>();
		// 将主数据源添加到更多数据源中
		targetDataSources.put("dataSource", defaultDataSource);
		DynamicDataSourceContextHolder.dataSourceIds.add("dataSource");
		// 添加更多数据源
		targetDataSources.putAll(customDataSources);
		for (String key : customDataSources.keySet()) {
			DynamicDataSourceContextHolder.dataSourceIds.add(key);
		}
		// 创建DynamicDataSource
		GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
		beanDefinition.setBeanClass(DynamicDataSource.class);
		beanDefinition.setSynthetic(true);
		MutablePropertyValues mpv = beanDefinition.getPropertyValues();
		mpv.addPropertyValue("defaultTargetDataSource", defaultDataSource);
		mpv.addPropertyValue("targetDataSources", targetDataSources);
		registry.registerBeanDefinition("dataSource", beanDefinition);
		logger.info("regist DataSource");
	}

	/**
	 * 创建DataSource
	 * @param dsMap
	 * @return
	 */
	public DataSource buildDataSource(Map<String, Object> dsMap) {
		String driverClassName = dsMap.get("driverClassName").toString();
		String url = dsMap.get("url").toString();
		String username = dsMap.get("username").toString();
		String password = dsMap.get("password").toString();
		DruidDataSource dataSource = new DruidDataSource();  
		dataSource.setUrl(url);  
		dataSource.setUsername(username);  
		dataSource.setPassword(password);  
		dataSource.setDriverClassName(driverClassName);  
		return dataSource;
	}

	/**
	 * 加载多数据源配置
	 */
	@Override
	public void setEnvironment(Environment env) {
		initDefaultDataSource(env);
		initCustomDataSources(env);
	}

	/**
	 * 初始化主数据源
	 * @param env
	 */
	private void initDefaultDataSource(Environment env) {
		defaultDataSource = buildDataSource(initBindMap(env, "default"));
		dataBinder(defaultDataSource, env);
	}

	/**
	 * 绑定DataSource
	 * @param dataSource
	 * @param env
	 */
	private void dataBinder(DataSource dataSource, Environment env) {
		RelaxedDataBinder dataBinder = new RelaxedDataBinder(dataSource);
		dataBinder.setConversionService(conversionService);
		dataBinder.setIgnoreNestedProperties(false);// false
		dataBinder.setIgnoreInvalidFields(false);// false
		dataBinder.setIgnoreUnknownFields(true);// true
		if (dataSourcePropertyValues == null) {
			Map<String, Object> rpr = new RelaxedPropertyResolver(env,"spring.datasource.druid").getSubProperties(".");
			Map<String, Object> values = new HashMap<>(rpr);
			// 排除已经设置的属性
			values.remove("driverClassName");
			values.remove("default.url");
			values.remove("default.username");
			values.remove("default.password");
			dataSourcePropertyValues = new MutablePropertyValues(values);
		}
		dataBinder.bind(dataSourcePropertyValues);
	}

	/**
	 * 初始化其他数据源
	 * @param env
	 */
	private void initCustomDataSources(Environment env) {
		// 读取配置文件获取更多数据源，也可以通过defaultDataSource读取数据库获取更多数据源
		RelaxedPropertyResolver propertyResolver = new RelaxedPropertyResolver(env, "spring.datasource.druid.");
		String dsPrefixs = propertyResolver.getProperty("names");
		if(!StringUtils.isEmpty(dsPrefixs)){
			for (String dsPrefix : dsPrefixs.split(",")) {// 多个数据源
				DataSource ds = buildDataSource(initBindMap(env, dsPrefix));
				customDataSources.put(dsPrefix, ds);
				dataBinder(ds, env);
			}
		}
	}

	/**
	 * 读取配置文件
	 * @param env
	 * @param dbName
	 * @return
	 */
	private Map<String, Object> initBindMap(Environment env,String dbName){
		RelaxedPropertyResolver propertyResolver = new RelaxedPropertyResolver(env, "spring.datasource.druid.");
		Map<String, Object> dsMap = new HashMap<>();
		dsMap.put("driverClassName",propertyResolver.getProperty("driverClassName"));
		dsMap.put("url", propertyResolver.getProperty(dbName+".url"));
		dsMap.put("username", propertyResolver.getProperty(dbName+".username"));
		dsMap.put("password", propertyResolver.getProperty(dbName+".password"));
		return dsMap;
	}
}