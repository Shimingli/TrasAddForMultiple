package com.lsm.task;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.lsm.utils.R;


@Component
public class ScheduledTask {
	
	private static final Logger LOGGER = LogManager.getLogger(ScheduledTask.class);
	
	/**
	 * 每天凌晨2点爬取交易数据
	 * @return 
	 */
	@Scheduled(cron = "0 0 2 * * ?")
	public R obtainTransactionData() {
		
		//执行爬取交易记录的业务逻辑
		LOGGER.info("执行爬取数据业务...");
		
		
		
		return R.ok("success");
	}
}
