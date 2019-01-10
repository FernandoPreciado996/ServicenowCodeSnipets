 //to put custom code

 getMessage: function (key,array,lang){
    var grmsg= new GlideRecord('sys_ui_message');
    grmsg.addEncodedQuery('key='+key+'^language='+lang);
    grmsg.query();
    if(grmsg.next())
        key = grmsg.message;
    for(var i in array){
        var str = '{'+i+'}';
        key = key.replace(new RegExp(str, 'g'),array[i]);
    }
    return key;
},