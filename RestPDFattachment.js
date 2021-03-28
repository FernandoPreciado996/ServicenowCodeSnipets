//This script transform create the pdf view of a record and attach it to other/same record.
//If the record contains an old copy it will be deleted and recreated.
createCdd(current.sys_id,g_form.getValue('number'));


function createCdd(record,id){
	var grAttachments = GlideRecord('sys_attachment')
		grAttachments.addQuery('file_name','CONTAINS',id);
		grAttachments.query();
		while(grAttachments.next()){
			grAttachments.deleteRecord();	
		}
	var request = new sn_ws.RESTMessageV2();
   request.setEndpoint("https://"+gs.getProperty("instance_name")+".service-now.com/change_request.do?sys_id="+record+"&PDF&sysparm_view=ccd_report");
   request.setBasicAuth(gs.getProperty("glide.user_name"),gs.getProperty("glide.user_password"));
   request.setRequestHeader('Accept', 'application/json');
   request.setHttpMethod("get");
   request.saveResponseBodyAsAttachment('change_request',record,'CCD-REPORT -'+id);
   request.execute();
}