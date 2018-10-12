package com.lsm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import com.lsm.dynamicdatasource.DynamicDataSourceRegister;

@SpringBootApplication
@EnableTransactionManagement
@Import(DynamicDataSourceRegister.class)
public class MainApplication extends SpringBootServletInitializer {
	public static void main(String[] args) {
		SpringApplication.run(MainApplication.class, args);
	}
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return super.configure(builder).sources(MainApplication.class);
	}
}
