package com.lsm.controller;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.lsm.service.ActionRecordService;
import com.lsm.utils.R;

@Controller
@RequestMapping("/")
public class TransactionController {
	
	private static final Logger LOGGER = LogManager.getLogger(TransactionController.class);
	
	@Autowired
	private ActionRecordService actionService;
	//第三方服务地址
	@Value("${client.addr}")
	private String clientUrl;
	
	
	/*
	 * 测试程序部署ok探针
	 */
	@RequestMapping("/conn")
	@ResponseBody
	public R conn() {
		
		LOGGER.info("test ok");
		
		int total = actionService.queryTotal(null);
		
		LOGGER.info(total);
		
	return R.ok("success");
	}
	
	
	/**
	 * 可以封装成工具类调用
	 */
	public void sendTransactionData() {
		
		/*
		 * 构建需要发送的json 数据，这里只是通过hashMap 伪造一个类似的，具体的看业务需求
		 */
		Map<String, Object> map  = new HashMap<>();
		map.put("data1", "v1");
		map.put("data2", "v1");
		Gson gson = new Gson();
		String json = gson.toJson(map);
		
		/*
		 * 通过HttpClient调用第三方地址上报数据（这就是所谓的通讯），可以封装成工具类再调用
		 */
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(clientUrl);
		httpPost.setHeader("Content-type", "application/json; charset=utf-8");
		StringEntity entity = new StringEntity(json, Charset.forName("UTF-8"));
        entity.setContentEncoding("UTF-8");
        // 发送Json格式的数据请求
        entity.setContentType("application/json");
        httpPost.setEntity(entity);
            
         CloseableHttpResponse execute;
		try {
			execute = httpClient.execute(httpPost);
			HttpEntity resp = execute.getEntity();
			String result = EntityUtils.toString(resp, "utf-8");
			LOGGER.info(result);
		} catch (IOException e) {
			e.printStackTrace();
		}
         
	}
}
