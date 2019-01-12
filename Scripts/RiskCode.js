var jsonAvariableGroups ={}; // this object will contains the data segmented for each regional manager group  
var GSOCData={
	flights: []
} // this variable will contain all the data and is send to GSOC even with empty country field 
_populateJsonFirstTime()

var grTravels = new GlideRecord('u_travel_transportation');
grTravels.addQuery('u_traveler_type=International^u_segment_typeSTARTSWITHAir^u_requestor_tripISNOTEMPTY^u_inbound_flight_rail_departure_dateONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORu_inbound_flight_rail_departure_dateONTomorrow@javascript:gs.beginningOfTomorrow()@javascript:gs.endOfTomorrow()^u_riskINHigh,Extreme');
grTravels.query();
while(grTravels.next()){
	_populateJson(grTravels.getValue('sys_id'),GSOCData)

	var departureManager =_getDepartureManager(grTravels.u_requestor_trip);
	var arrivalManager = _getArrivalManager(grTravels.sys_id);

	if(departureManager == arrivalManager){
		_populateJson(departureManager,jsonAvariableGroups)
	}else{
		_populateJson(departureManager,jsonAvariableGroups)
		_populateJson(arrivalManager,jsonAvariableGroups)
	}
}

//gs.eventQueue('high_risk.travel',grTravels,JSON.stringify(GSOCData),gs.getProperty('cmx.travels.gsoc.group'));

for (var n in jsonAvariableGroups){
	if(jsonAvariableGroups[n].flights.length > 0){
	//gs.eventQueue('high_risk.travel',grTravels,JSON.stringify(jsonAvariableGroups[n]),jsonAvariableGroups[n].sys_id);
	}
	gs.info(jsonAvariableGroups[n].flights.length)

}
gs.info(JSON.stringify(jsonAvariableGroups))// final data for regional groups
gs.info(JSON.stringify(GSOCData))//final data for gsoc




function _populateJsonFirstTime(){// populate the json with all the regional manager groups only called 1 time
	var grRegionalGroups = new GlideRecord('sys_user_group');
	grRegionalGroups.addQuery('nameSTARTSWITHCX Regional Security -');
	grRegionalGroups.query();
	while(grRegionalGroups.next()){
		if(grRegionalGroups){
			var grRegionalManager = new GlideRecord('sys_user_grmember')
				grRegionalManager.addQuery('group='+grRegionalGroups.sys_id);
				grRegionalManager.query();
				grRegionalManager.next();
				//gs.info(grRegionalManager.sys_id)
				if(grRegionalManager.user){
					jsonAvariableGroups[grRegionalGroups.getDisplayValue('name')] = {
						sys_id: grRegionalGroups.getValue('sys_id'),
						regionalname: grRegionalManager.user.getDisplayValue('name'),
						flights: []
					}
				}
		}
		
	}
}

function _populateJson(Manager,json){
	//gs.info(json+' code'+Manager)
	var aux = '';
	//gs.info('dentro funcion'+grTravels.getDisplayValue('u_requestor_trip'))
	if(json == GSOCData) aux = json; // this function populate GSOC data also 
	else aux = json[Manager];
	//gs.info(JSON.stringify(aux.flights))
	aux.flights.push({
		user:grTravels.getDisplayValue('u_requestor_trip'),
		number:grTravels.getDisplayValue('u_inbound_flight_train_number'),
		home_country: grTravels.u_requestor_trip.u_country.getDisplayValue(),
		local_departure_date: grTravels.getDisplayValue('u_local_departure_date'),
		arrival_country_name:grTravels.getDisplayValue('u_stay_country'),
		local_arrival_date:grTravels.getDisplayValue('u_local_arrival_date'),
		risk:grTravels.getDisplayValue('u_to_security_risk'),
		pnr:grTravels.getDisplayValue('u_pnr_locator')
	})

	
}

function _getDepartureManager(userId){// get the regional manager from the user.u_country field
	try{
		var user = new GlideRecord('sys_user')
			if(user.get(userId)){
				return _getRegionalGroup(user.u_country)
			}else throw 'Missing User for country '+userId;

	}catch(ex){
		gs.info(ex)
	}
}

function _getArrivalManager(flightID){// get the regional manager from the travel.u_stay_country field
	var grTravel = new GlideRecord('u_travel_transportation')
	if(grTravel.get(flightID)){
		return _getRegionalGroup(grTravel.u_stay_country)
	}

}

function _getRegionalGroup(countryID){ // get the user from core_contry sys id
	if(countryID){
		var grGroup = new GlideRecord('sys_user_group')
		grGroup.addQuery('u_countryISNOTEMPTY')
		grGroup.addQuery('u_country.sys_idSTARTSWITH'+countryID+'^nameSTARTSWITHcx local Security')
		grGroup.query();
		grGroup.next();
		if(grGroup.parent){
			//gs.info(grGroup.getDisplayValue('parent'))
			return grGroup.getDisplayValue('parent');
		}
	}else{
		gs.info('Fail in country'+countryID)
	}
}
