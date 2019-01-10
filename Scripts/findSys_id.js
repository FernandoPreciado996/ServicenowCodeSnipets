// pending refactor
var aux;
var grTables = new GlideRecord('sys_db_object')
    grTables.addQuery('nameNOT LIKE$')
    grTables.query()
    while(grTables.next()){
        aux++
        if(grTables.name != 'sh$sc_ic_aprvl_defn_staging'||grTables.name != 'sh$wf_workflow_version')
        var grRecord =  new GlideRecord(grTables.name)
        grRecord.addQuery('sys_id','CONTAINS','5e12a55bdb9a2b406402cae3b9961964');
        grRecord.query();
        if(grRecord.next()){
            gs.info(grTables.name+" Record2 :"+grRecord.sys_id)
        }
    }
    gs.info(aux)