GetVariables(gr.getUniqueValue(),gr.getTableName());

function GetVariables(record,table){
var aux = []
var user = gs.getUserID();
var grValidation = new GlideRecord(table);
    grValidation.get(record);
    if(grValidation.opened_by == gs.getUserID() || grValidation.watch_list.indexOf(gs.getUserID()) > -1 || current.caller_id == gs.getUserID() ||gs.getUser().hasRole('itil')){
        var grProducer = new GlideRecord('question_answer')
        //grProducer.addQuery('table_sys_id',gr.getUniqueValue());
        grProducer.addQuery('question.typeNOT IN12,20,24,19^value!=NULL')
        grProducer.addQuery('table_sys_id','d96bc91edb5ae300949480f33996196c');
        grProducer.query();
        while(grProducer.next()){
            if(getRefVal(grProducer.value,grProducer.question)){
                aux.push(
                    {
                        display_value:getRefVal(grProducer.value,grProducer.question),
                        value:grProducer.getDisplayValue('value'),  
                        id:null, 
                        label:grProducer.getDisplayValue('question'), 
                        type:8
                    })
            }else{
                aux.push(
                    {
                        display_value:grProducer.getDisplayValue('value'),
                        value:grProducer.getDisplayValue('value'),  
                        id:null, 
                        label:grProducer.getDisplayValue('question'), 
                        type:7
                    })
            }
            
        }
        for(var n in aux){
            gs.info(aux[n].label +" : "+aux[n].display_value)
        }
    }
    function getRefVal(targetID,followID){
        var grRef = new GlideRecord('item_option_new');
            grRef.addQuery('type=8');
            grRef.addQuery('sys_id',followID);
            grRef.query();
            if(grRef.next()){
                var grDinamicTable = new GlideRecord(grRef.reference)
                    grDinamicTable.get(targetID);
                    return grDinamicTable.getDisplayValue('name');
            }else{
                return false;
            }
    }
}
