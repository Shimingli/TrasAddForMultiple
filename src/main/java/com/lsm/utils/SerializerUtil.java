package com.lsm.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * object对象序列化
 * @author SDT13843
 *
 */
public class SerializerUtil implements Serializable {

	private static final Logger log = LogManager.getLogger(SerializerUtil.class);
	private static final long serialVersionUID = 1887903823461742529L;

	public static byte[] objectToByte(java.lang.Object obj) {
		byte[] bytes = new byte[1024];
		try {
			// object to bytearray
			ByteArrayOutputStream bo = new ByteArrayOutputStream();
			ObjectOutputStream oo = new ObjectOutputStream(bo);
			oo.writeObject(obj);

			bytes = bo.toByteArray();

			bo.close();
			oo.close();
		} catch (Exception e) {
			log.error("translation:", e);
		}
		return (bytes);
	}

	public static Object byteToObject(byte[] bytes) {
		java.lang.Object obj = new java.lang.Object();
		ByteArrayInputStream bi = null;
		ObjectInputStream oi = null;
		try {
			// bytearray to object
			if(bytes == null)
				return null;
			bi = new ByteArrayInputStream(bytes);
			oi = new ObjectInputStream(bi);

			obj = oi.readObject();
		} catch (Exception e) {
			log.error("translation:", e);
		} finally {
        	try {
        		if(bi != null)
        			bi.close();
        		if(oi != null)
        			oi.close();
			} catch (IOException e) {
			}  
        }  
		
		return obj;
	}
	
	public static <T> byte[] serializeList(List<T> value) {  
        byte[] rv=null;  
        ByteArrayOutputStream bos = null;  
        ObjectOutputStream os = null;  
        try {  
            bos = new ByteArrayOutputStream();  
            os = new ObjectOutputStream(bos);  
            for(T object : value){  
                os.writeObject(object);  
            }  
            os.writeObject(null);  
            rv = bos.toByteArray();  
        } catch (IOException e) {  
            throw new IllegalArgumentException("Non-serializable object", e);  
        } finally {  
        	try {
        		if(os!=null)
        			os.close();
        		if(bos != null)
        			bos.close();
			} catch (IOException e) {
			}  
        }  
        return rv;  
    }  

    @SuppressWarnings("unchecked")
	public static <T> List<T> deserializeList(byte[] in) {  
        List<T> list = new ArrayList<T>();  
        ByteArrayInputStream bis = null;  
        ObjectInputStream is = null;  
        try {  
            if(in != null) {
                bis=new ByteArrayInputStream(in);  
                is=new ObjectInputStream(bis);  
                while (true) {  
                	Object object = is.readObject();  
                    if(object == null){  
                        break;  
                    }else{  
                        list.add((T)object);  
                    }  
                }  
            }  
        } catch (IOException e) {
        	e.printStackTrace();
        } catch (ClassNotFoundException e) {
        	e.printStackTrace();
        } finally {
        	try {
        		if(is != null)
        			is.close();
        		if(bis != null)
        			bis.close();
			} catch (IOException e) {
			}  
        }  
        return list;  
    }  
}