//this script loops thought the variables in the request item and it display them

(function runMailScript(/* GlideRecord */ current, /* TemplatePrinter */ template,
    /* Optional EmailOutbound */ email, /* Optional GlideRecord */ email_action,
    /* Optional GlideRecord */ event) {

var variables = current.variables.getElements(); 
for (var i=0;i<variables.length;i++) { 
var v = variables[i];
if(v.getQuestion().getValue()){
var question = v.getQuestion().getLabel() +" :"+v.getQuestion().getValue() + "\n" ; 
template.print(question);
}
} 

})(current, template, email, email_action, event);