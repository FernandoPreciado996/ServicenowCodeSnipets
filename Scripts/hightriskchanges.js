(function executeRule(current, previous /*null when async*/) {
	
	var recipies = [];

    recipies.push(_getRegionalGroup(current.u_requestor_trip.u_country)) 
    recipies.push(_getRegionalGroup(current.u_stay_country)) 
    
    
    gs.eventQueue('country.risky.notification',current,recipies,'');

    function _getRegionalGroup(countryID){ // get the user from core_contry sys id
        if(countryID){
            var grGroup = new GlideRecord('sys_user_group');
            grGroup.addQuery('u_countryISNOTEMPTY');
            grGroup.addQuery('u_country.sys_idSTARTSWITH'+countryID+'^nameSTARTSWITHcx local Security');
            grGroup.query();
            grGroup.next();
            if(grGroup.parent){
                return grGroup.getValue('parent');
            }
        }else{
            gs.info('Fail in country'+countryID);
        }
    }



})(current, previous);



var current = new GlideRecord('u_travel_transportation')
current.get('96a8f4c6dbc8bf4054477dad68961974')
var recipies = [];

recipies.push(_getRegionalGroup(current.u_requestor_trip.u_country));
recipies.push(_getRegionalGroup(current.u_stay_country));


gs.eventQueue('country.risky.notification',current,recipies+'','');

function _getRegionalGroup(countryID){ // get the user from core_contry sys id
    if(countryID){
        var grGroup = new GlideRecord('sys_user_group');
        grGroup.addQuery('u_countryISNOTEMPTY');
        grGroup.addQuery('u_country.sys_idSTARTSWITH'+countryID+'^nameSTARTSWITHcx local Security');
        grGroup.query();
        grGroup.next();
        if(grGroup.parent){
            return grGroup.getValue('parent');
        }
    }else{
        gs.info('Fail in country'+countryID);
    }
}
