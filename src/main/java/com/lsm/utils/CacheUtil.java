package com.lsm.utils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.JedisPoolConfig;

@Component
@ConfigurationProperties(prefix="redis")
public class CacheUtil {

	private static final Logger log = LogManager.getLogger(CacheUtil.class);
	private static JedisCluster jc = null;
	public static final String SCHEDULE_CACHE_KEY = "adSchedule:";
	public static final String DEFAULTMATERIAL_CACHE_KEY = "defaultMaterial:";
	public static final String WHITE_LIST_MAC = "whiteMacList:";
	public static final String WHITE_LIST_MODEL = "whiteModelList:";
	public static final String DOWN_CACHE_KEY = "adDown:";
	public static int expireTime = 10;  // 缓存过期时间
	private static Map<String, Integer> urlMap;
    private static String servers;
	
	public static void setServers(String servers) {
		CacheUtil.servers = servers;
	}

	public static JedisCluster getJedisCluster(){
		if(jc == null){
			synchronized (JedisCluster.class) {
				if (jc == null) {
					try {
			            String serverList[] = servers.split(",");
						Set<HostAndPort> jedisClusterNodes = new HashSet<HostAndPort>();
						for (int i = 0; i < serverList.length; i++) {
							String server[] = serverList[i].split(":");
							jedisClusterNodes.add(new HostAndPort(server[0], Integer.valueOf(server[1])));
						}
						JedisPoolConfig jpc = new JedisPoolConfig();
						jpc.setMaxTotal(500);
						jpc.setMaxWaitMillis(3000);
						jpc.setMinEvictableIdleTimeMillis(60000);
						jpc.setMaxIdle(50);
						jc = new JedisCluster(jedisClusterNodes,jpc);
					} catch (Exception e) {
						e.printStackTrace();
			        	log.error(e.getMessage());
					}
				}
			}
		}
		return jc;
	}

	public static void set(String key, String value) {
		try {
			JedisCluster jc = getJedisCluster();
			jc.set(key, value);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	
	public static void setex(String key,int expire, String value) {
		try {
			JedisCluster jc = getJedisCluster();
			jc.setex(key, expire*60, value);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	
	public static String get(String key) {
		try {
			JedisCluster jc = getJedisCluster();
			return jc.get(key);
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
	}
	
	public static void setObject(String key,Serializable object){
		try {
			JedisCluster jc = getJedisCluster();
			jc.set(key.getBytes(),SerializerUtil.objectToByte(object));
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	
	public static void setexObject(String key,int expire,Serializable object){
		try {
			JedisCluster jc = getJedisCluster();
			jc.setex(key.getBytes(),expire*60, SerializerUtil.objectToByte(object));
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	
	public static Object getObject(String key){
		try {
			JedisCluster jc = getJedisCluster();
			return SerializerUtil.byteToObject(jc.get(key.getBytes()));
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
	}
	
	public static <T> void setList(String key,List<? extends Serializable> list){
		try {
			if(list != null){
				JedisCluster jc = getJedisCluster();
				jc.set(key.getBytes(), SerializerUtil.serializeList(list));
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	
	public static <T> List<T> getList(String key){
		try {
			JedisCluster jc = getJedisCluster();
			byte[] in = jc.get(key.getBytes());
			List<T> list = SerializerUtil.deserializeList(in);
			return list;
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
	}
	
	public static <T> void setexList(String key,int expire,List<? extends Serializable> list){
		try {
			if(list != null){
				JedisCluster jc = getJedisCluster();
				jc.setex(key.getBytes(),expire*60, SerializerUtil.serializeList(list));
			}
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	
	public static void delKey(String key){
		try {
			JedisCluster jc = getJedisCluster();
			jc.del(key);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
	
	public static synchronized Map<String, Integer> getCacheUrl(){
		if(urlMap == null){
			try {
				urlMap = new HashMap<String, Integer>();
				String path = log.getClass().getClassLoader().getResource("/").getPath()+"cacheurl";
				BufferedReader reader = new BufferedReader(new FileReader(path));
				String cacheurl = null;
				while ((cacheurl = reader.readLine()) != null) {
	                String urls[] = cacheurl.split(":");
	                if(urls.length == 2){
						urlMap.put(urls[0], Integer.valueOf(urls[1]));
					}
	            }
				reader.close();
			} catch (Exception e) {
				log.error("read url txt error,{}",e.getMessage());
			}
		}
		return urlMap;
	}
}
