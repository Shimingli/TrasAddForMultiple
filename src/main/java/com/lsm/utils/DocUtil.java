package com.lsm.utils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
@Component
public class DocUtil {
	@Autowired
	private Configuration configure;
    /**
     * 根据Doc模板生成word文件
     * @param dataMap 需要填入模板的数据
     * @param downloadType 文件名称
     * @param savePath 保存路径
     */
    public void createDoc(Map<String,Object> dataMap,String downloadType,String savePath){
        try {
        	configure.setIncompatibleImprovements(Configuration.VERSION_2_3_0);
            //加载需要装填的模板
            Template template=null;
            configure.setDirectoryForTemplateLoading(new File("d:/"));
            configure.setTemplateExceptionHandler(TemplateExceptionHandler.IGNORE_HANDLER);
            template=configure.getTemplate(downloadType+".ftl");
            File outFile=new File(savePath);
            Writer out=null;
            out=new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outFile), "utf-8"));
            template.process(dataMap, out);
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (TemplateException e) {
            e.printStackTrace();
        }
    }
}