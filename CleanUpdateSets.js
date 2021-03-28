//This script its used when i forgot to change update sets and i need to clen them
//basicaly i took the query of the wrong update set usualy with created on today and the sys id of the new update set where those stuff should go

clean('e589d671137d230031b855912244b05f',"update_set=0968bde613be630031b855912244b090^sys_created_onNOTON2019-01-25@javascript:gs.dateGenerate('2019-01-25','start')@javascript:gs.dateGenerate('2019-01-25','end')^ORsys_created_on=NULL^sys_created_onNOTON2019-02-12@javascript:gs.dateGenerate('2019-02-12','start')@javascript:gs.dateGenerate('2019-02-12','end')^ORsys_created_on=NULL^target_name=Story Management^sys_created_onON2019-02-07@javascript:gs.dateGenerate('2019-02-07','start')@javascript:gs.dateGenerate('2019-02-07','end')")
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