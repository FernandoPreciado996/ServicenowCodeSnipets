
var attachmetnID='fa82476f1bbe270094d976e1dd4bcb16';
var hola ='https://dtdev.service-now.com/api/now/attachment/'+attachmetnID+'/file';
var firstEndpoint ='https://4thsourcedev.service-now.com/api/now/attachment/'+attachmetnID+'/file';
var secondEndpoint ='https://4thsourcedev.service-now.com/api/now/attachment/file?table_name=rm_story&table_sys_id=b47278df13fae30031b855912244b0be&file_name=test.xlsx'
var enpointFinal = 'https://dtdev.service-now.com/api/69096/story_managment/attachments';

var headers = restGet(hola,'get')
//var create = restPOST(secondEndpoint,'POST',headers)
//var werty = createGlyde(attachmetnID,headers);
//gs.info()






function restGet (endpoint,method,data){
    var grStory= new GlideRecord('rm_story')
    gs.info(grStory.get('b47278df13fae30031b855912244b0be'));
    var request = new sn_ws.RESTMessageV2();
    request.setEndpoint(endpoint);
    //request.setAuthenticationProfile('basic','072743f64fe623009eb68deba310c782');
    //request.setBasicAuth('4thsource.user','123')
    request.setBasicAuth('dollar.user','123')
    //request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Accept', "*/*");
    request.saveResponseBodyAsAttachment('rm_story',grStory.sys_id,'2019.01.07-Service Definition - Softmenu.xlsx')
    request.setHttpMethod(method);
    var response = request.execute();
    //var responseBody = response.getBody();
    var httpStatus = response.getStatusCode();
    gs.info('Status :'+httpStatus+' ')
    //gs.info(responseBody)
    //var StringUtil = GlideStringUtil();
    //var test = StringUtil.base64Encode(responseBody)
    //gs.info(test)

    //return responseBody;
    // gs.info(responseBody);
    //gs.info(JSON.stringify(response));

}
function restPOST (endpoint,method,data){
    var grAttachment = new GlideRecord('sys_attachment');
        gs.info(grAttachment.get('b2c40d9e4f2a6f406aa9ab99f110c721'));
       gs.info(grAttachment)
    
    var dataFinal = new GlideSysAttachment();
    var carro = dataFinal.getBytes(grAttachment);
    gs.info(carro)
    var StringUtil = new GlideStringUtil();
    var test = StringUtil.base64Encode(carro)
    gs.info(test)
    var request = new sn_ws.RESTMessageV2();
    request.setEndpoint(endpoint);
    //request.setAuthenticationProfile('basic','072743f64fe623009eb68deba310c782');
    request.setBasicAuth('4thsource.user','123')
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Accept', "*/*");
    request.setRequestHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    request.setHttpMethod(method);
    gs.info(carro)
    request.setRequestBody(test)
    var response = request.execute();
    var responseBody = response.getBody();
    var httpStatus = response.getStatusCode();
    gs.info('Status :'+httpStatus+' ')
    return JSON.parse(responseBody);
    // gs.info(responseBody);
    //gs.info(JSON.stringify(response));

}
function createGlyde(recordsys,data){
    //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    //var grAttachment = new GlideRecord('sys_attachment');
       // gs.info(grAttachment.get('b2c40d9e4f2a6f406aa9ab99f110c721'));
       // gs.info(grAttachment)
    
    //var dataFinal = new GlideSysAttachment();
    //var carro = dataFinal.getBytes(grAttachment);
    //gs.info(carro)
        var grStory= new GlideRecord('rm_story')
        gs.info(grStory.get('b47278df13fae30031b855912244b0be'));

    
    
    var createattachment = new GlideSysAttachment();
    gs.info(typeof data)
    var hola =JSON.parse(data);
    gs.info(hola.result.content)
    //var result = createattachment.writeBase64(grStory,'Example.xlsx','application/xlsx',dataFinal)
    var result = createattachment.write(grStory,'Example.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',hola.result.content)
    gs.info(result)



}