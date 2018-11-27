//This script its used when i forgot to change update sets and i need to clen them
//basicaly i took the query of the wrong update set usualy with created on today and the sys id of the new update set where those stuff should go

clean('bbf5fa011382ef00379f52722244b0bc','update_set=716648e7133dab00379f52722244b031^sys_created_onONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()')
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