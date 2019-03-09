var endpointRecord = '';
var endpointAttachment = '';
var restUser = '';


//Create record logic
var informationBody ={};

var response = sendRest(endpointRecord,restUser); //retrieve 
if (response.result){
	for (var i in response.result){
		if(CreateRecordREST(response.result[i])){
			gs.info('The record '+ response.result.number +' Has been successfully Created');
		}else{
			gs.info('Error creating the record');
		}
	}
}
//Create Attachments Logic
var reg = new RegExp('(.*api\/)','gm'); // get base instance endpoint and create the OOB attachment endpoint api
var attachmentEndpoint = reg.exec(endpointRecord);
if(attachmentEndpoint[0]){
    var baseEndpoint = attachmentEndpoint[0]+'now/attachment/';// OOB attachment  API 
    var attachments = sendRest(endpointAttachment,restUser);
    var AttachmentsPopulate = populateAttachments(attachments.result,restUser,baseEndpoint);

}else{
    gs.info(log+'Invalid attachment Endpoint');

}


//Functions
function populateAttachments(attachmentsID,authprofile,endpoint){
    for(var i in attachmentsID){
        if(attachmentsID[i].attachments.length > 0){
            for(var x in attachmentsID[i].attachments){
                var enpointBinary =endpoint+attachmentsID[i].attachments[x]+'/file';
                var enpointHeaders =endpoint+attachmentsID[i].attachments[x];
                var headers = _getHeaders(enpointHeaders,'get',authprofile);
                this._createAttachments(enpointBinary,'get',headers.result.table_name,headers.result.file_name,attachmentsID[i].record,authprofile,attachmentsID[i].attachments[x]);
            }
        }
    }
}
function _getHeaders(endpoint,method,authprofile){
    var request = new sn_ws.RESTMessageV2();
    request.setEndpoint(endpoint);
    request.setAuthenticationProfile('basic',authprofile);
    request.setRequestHeader('Accept', "*/*");
    request.setHttpMethod(method);
    var response = request.execute();
    var responseBody = response.getBody();
    var httpStatus = response.getStatusCode();
    return JSON.parse(responseBody);

}
function _createAttachments(endpoint,method,table,fileName,targetID,authprofile,originID){
    var request = new sn_ws.RESTMessageV2();
    request.setEndpoint(endpoint);
    request.setAuthenticationProfile('basic',authprofile);
    request.setRequestHeader('Accept', "*/*");
    request.saveResponseBodyAsAttachment(table,targetID,fileName);
    request.setHttpMethod(method);
    var response = request.execute();
    var httpStatus = response.getStatusCode();
   
}
function sendRest(targetEndpoint,userAUTH){// business rules
  
    if(targetEndpoint && userAUTH){
        try { 
            var r = new sn_ws.RESTMessageV2();
            r.setEndpoint(endpoint);
            r.setHttpMethod('GET');
            r.setAuthenticationProfile('basic',userAUTH);
            r.setRequestHeader('Accept', "*/*");
            if(data != null)
                r.setRequestBody(JSON.stringify(data));
            var response = r.execute();
            var responseBody = response.getBody();
            var httpStatus = response.getStatusCode();
            if(httpStatus == 200){
                return JSON.parse(responseBody);
            }else{
                return false;
            }
        }
        catch(ex) {
            var message = ex.message;
            gs.info(message)
        }
    }
}
function CreateRecordREST(data){//update/create logic for STORIES
    var grRecord = new GlideRecord(data.sys_class_name);
    var aux = false;//Flag to match if the record will be updated or created.
    if(grRecord.get(data.sys_id))
        aux = true;
    if(aux != true)
        grRecord.newRecord();
    if (data) {
        for (var prop in data) {
            switch (prop){
                default: grRecord.setValue(prop,data[prop]); break;
            }

        }
        if(aux != true){grRecord.insert();}
        if(aux == true){grRecord.update();}
        return true;
    }return false;
}
