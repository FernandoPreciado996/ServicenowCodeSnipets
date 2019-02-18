//This script its used when i forgot to change update sets and i need to clen them
//basicaly i took the query of the wrong update set usualy with created on today and the sys id of the new update set where those stuff should go

clean('dea85cebdb83ab0c896ff3931d961933','update_set=a98e1fe5450331005001a73205c8a5c9^sys_updated_by=CJimenez^sys_created_on>javascript:gs.endOfLastMonth()^ORsys_created_on=NULL')
function clean(target,query){
    var gr = new GlideRecord('sys_update_xml')
        gr.addQuery(query);
        gr.query();
        var aux = 0;
        while(gr.next()){
            gr.update_set = target;
            gr.update();
            aux++
        }
        gs.info('Updated records '+aux)
}