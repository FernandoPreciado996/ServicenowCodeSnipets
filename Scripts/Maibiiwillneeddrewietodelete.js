var record = new GlideRecord('rm_story')
record.get('b47278df13fae30031b855912244b0be')
    var headers = rest('https://dtdev.service-now.com/api/now/attachment/fa82476f1bbe270094d976e1dd4bcb16')
    gs.info(JSON.stringify(headers))
    //gs.info(headers.result.sys_id)
    var content = rest(headers.result.download_link)
    gs.info(JSON.stringify(content))
    var attachment = rest2(headers.result.table_name,record.sys_id,headers.result.file_name,headers.result.content_type,content)
//var test = rest('https://dtdev.service-now.com/api/now/attachment/3233e81f1bf6e30094d976e1dd4bcb03/file')
    //saveAttachment(headers.result.table_name,record.sys_id,headers.result.file_name,content,headers.result.content_type)
//headers.result.file_name
function saveAttachment(table,record,documentName,documentData,mime){
var test  =""
    var StringUtil = new GlideStringUtil();
    //var value = StringUtil.base64DecodeAsBytes(documentData);
    gs.info(documentData)
    //var value = documentData;
    //var value = StringUtil.base64Decode(documentData); 
    var attachment = new Attachment();
    var value = StringUtil.base64Encode(documentData)
    gs.info(value);
    //var attachment = new GlideSysAttachment();
    
                //attachment.write(record, documentName, mime, value)
              gs.info(attachment.write('rm_story',record, documentName, mime, test))
               //gs.info(value)
      //         gs.info(attachment.writeBase64(record,documentName,mime,value))
            }


function rest(endpoint){
    var request = new sn_ws.RESTMessageV2();
    request.setEndpoint(endpoint);
	request.setAuthenticationProfile('basic','072743f64fe623009eb68deba310c782');
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Accept', "*/*");
    request.setHttpMethod("get");
    //var test = request.saveResponseBodyAsAttachment('rm_story',record.sys_id,'1.txt');
////  attachment.write
                var response = request.execute();
				var responseBody = response.getBody();
                var httpStatus = response.getStatusCode();
               // gs.info(typeof responseBody)
                if(endpoint != 'https://dtdev.service-now.com/api/now/attachment/fa82476f1bbe270094d976e1dd4bcb16/file')return JSON.parse(responseBody)
                else return responseBody;
               // gs.info(responseBody);
               //gs.info(JSON.stringify(response));

}
function rest2(table_name,record_syd,nameRecord,content,data){
    var StringUtil = new GlideSystem();
    var value = StringUtil.base64Encode(data);
    var request = new sn_ws.RESTMessageV2();
    //request.setEndpoint('https://4thsourcedev.service-now.com/api/now/table/ecc_queue');
    request.setEndpoint('https://4thsourcedev.service-now.com/api/now/attachment/file?table_name=rm_story&table_sys_id=b47278df13fae30031b855912244b0be&file_name=test.xlsx');
    request.setAuthenticationProfile('basic','072743f64fe623009eb68deba310c782');
    request.setBasicAuth('4thsource.user','123')
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', content);
    request.setHttpMethod("POST");
    request.setRequestBody(value)
    /*request.setRequestBody(global.JSON.stringify({

        'agent':'AttachmentCreator',
  
        'topic':'AttachmentCreator',
  
        'source':table_name + ":" + record_syd, //table + : + sys_id del record
  
        'name':nameRecord+':'+content, // nombre del archivo
  
        'payload':value //contenido base 64
  
      }));   */
    //var test = request.saveResponseBodyAsAttachment('rm_story',record.sys_id,'1.txt');
////  attachment.write
                var response = request.execute();
				var responseBody = response.getBody();
                var httpStatus = response.getStatusCode();
                gs.info(httpStatus)
                gs.info(responseBody)
}