var jsonAvariableGroups ={}; // this object will contains the data segment for each regional manager group  
var GSOCData={
	flights: []
} // this variable will contain all the date
_populateJsonFirstTime()

var grTravels = new GlideRecord('u_travel_transportation');
grTravels.addQuery('u_traveler_type=International^u_segment_typeSTARTSWITHAir^u_requestor_tripISNOTEMPTY^u_inbound_flight_rail_departure_dateONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORu_inbound_flight_rail_departure_dateONTomorrow@javascript:gs.beginningOfTomorrow()@javascript:gs.endOfTomorrow()^u_riskINHigh,Extreme');
grTravels.query();
while(grTravels.next()){
	_populateJson(grTravels.getValue('sys_id'),GSOCData)

	var departureManager =_getDepartureManager(grTravels.u_requestor_trip);
	var arrivalManager = _getArrivalManager(grTravels.sys_id);
	if(departureManager == arrivalManager){
		//_populateJson(departureManager,jsonAvariableGroups)
	}else{
		//_populateJson(departureManager,jsonAvariableGroups)
		//_populateJson(arrivalManager,jsonAvariableGroups)
	}

}
gs.info(JSON.stringify(jsonAvariableGroups))
gs.info(JSON.stringify(GSOCData))




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
	gs.info(json+' code'+Manager)
	//gs.info('dentro funcion'+grTravels.getDisplayValue('u_requestor_trip'))
	if(json = GSOC)
	json[Manager].flights.push({
		user:grTravels.getDisplayValue('u_requestor_trip'),
		flightNumber:grTravels.getDisplayValue('u_inbound_flight_train_number'),
		sys_id: grTravels.getValue('u_requestor_trip'),
		localDepartureDate: grTravels.getDisplayValue('u_local_departure_date'),
		destination:grTravels.getDisplayValue('u_stay_country'),
		destinationRisk:grTravels.getDisplayValue('u_to_security_risk'),
		pnr:grTravels.getDisplayValue('u_pnr_locator')
	})

	
}

function _getDepartureManager(userId){
	try{
		var user = new GlideRecord('sys_user')
			if(user.get(userId)){
				return _getRegionalGroup(user.u_country)
			}else throw 'Missing User for country '+userId;

	}catch(ex){
		gs.info(ex)
	}
}

function _getArrivalManager(flightID){
	var grTravel = new GlideRecord('u_travel_transportation')
	if(grTravel.get(flightID)){
		return _getRegionalGroup(grTravel.u_stay_country)
	}

}

function _getRegionalGroup(countryID){
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
