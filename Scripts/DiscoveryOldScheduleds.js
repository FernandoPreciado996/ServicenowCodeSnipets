var grScheduled = new GlideRecord('discovery_schedule');
    //grScheduled.addQuery('sys_id','bc2ced9bdba1270042994410ba9619a6')
    grScheduled.query();
    while(grScheduled.next()){
        var grRanges = new GlideAggregate('discovery_range_item');
            grRanges.addAggregate('COUNT');
            grRanges.addQuery('schedule=bc2ced9bdba1270042994410ba9619a6');
            grRanges.query();
            var aux = 0;
            if(grRanges.next()){
                aux = grRanges.getAggregate('COUNT')
                gs.info('Aggregate : '+aux);
                if(aux <= 5){  // we validate that the curernts cheduled only have 1 or less ip ranges. IMPORTANT this validation are for the current 10/12/2018 records DO NOT USE WITHOUT first read the code.
                    grScheduled.name = 'OLD_'+grScheduled.getDisplayValue('name');
                    grScheduled.active = false
                    grScheduled.update();
                    gs.info('Updated : '+grScheduled.sys_id)
                }

            }    

    }