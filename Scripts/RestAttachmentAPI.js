
var attachmetnID='fa82476f1bbe270094d976e1dd4bcb16';
var hola ='https://dtdev.service-now.com/api/now/attachment/'+attachmetnID+'/file';

var headers = restGet(hola,'get')

function createPDF (endpoint,method,data){

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

}

function getHeaders (endpoint,method,data){

    var request = new sn_ws.RESTMessageV2();
    request.setEndpoint(endpoint);
    //request.setAuthenticationProfile('basic','072743f64fe623009eb68deba310c782');
    //request.setBasicAuth('4thsource.user','123')
    request.setBasicAuth('dollar.user','123')
    //request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Accept', "*/*");
    request.setHttpMethod(method);
    var response = request.execute();
    //var responseBody = response.getBody();
    var httpStatus = response.getStatusCode();
    gs.info('Status :'+httpStatus+' ')

}

