// Since hash tables are not supported by servicenos this is a bruteforce solution for the issue
//This code will be a sheduled job that runs every day at 00:00:00 GMT 
//This code match the persosn that are in the same flight for the current day
// if more than one person are in the same flight i will send a notification to a certain group
// if that flight is denominated hight risked it will send a notification for the regional manager for each region if it exist.

var aux = {};
var departureManagers = {};
var auxTravelers = [];
var grTravels = new GlideRecord('u_travel_transportation');
grTravels.addQuery('u_traveler_type=International^u_segment_typeSTARTSWITHAir^u_requestor_tripISNOTEMPTY^u_inbound_flight_rail_departure_dateONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORu_inbound_flight_rail_departure_dateONTomorrow@javascript:gs.beginningOfTomorrow()@javascript:gs.endOfTomorrow()^u_riskINHigh,Extreme');

grTravels.query();
while(grTravels.next()){
	var grTravelMatcher = new GlideRecord('u_travel_transportation');
	grTravelMatcher.addQuery('u_traveler_type=International^u_segment_typeSTARTSWITHAir^u_requestor_tripISNOTEMPTY^u_inbound_flight_rail_departure_dateONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^ORu_inbound_flight_rail_departure_dateONTomorrow@javascript:gs.beginningOfTomorrow()@javascript:gs.endOfTomorrow()^u_riskINHigh,Extreme');
	grTravelMatcher.addQuery('u_inbound_flight_train_number',grTravels.getValue('u_inbound_flight_train_number'));
	grTravelMatcher.query();
	while(grTravelMatcher.next()){
        auxTravelers.push(
			{
				user:grTravels.getDisplayValue('u_requestor_trip'),
				flightNumber:grTravels.getDisplayValue('u_inbound_flight_train_number'),
				sys_id: grTravels.getValue('u_requestor_trip'),
				localDepartureDate: grTravels.getDisplayValue('u_local_departure_date'),
				destination:grTravels.getDisplayValue('u_stay_country'),
				destinationRisk:grTravels.getDisplayValue('u_to_security_risk'),
				pnr:grTravels.getDisplayValue('u_pnr_locator')
			});
			getUserRegionalManager(grTravels.getValue('u_requestor_trip'))
	}
	if(auxTravelers.length > 0){
		if(!aux[grTravels.getDisplayValue('u_inbound_flight_train_number')]){
			aux[grTravels.getDisplayValue('u_inbound_flight_train_number')]=
				{
                travelesUsers:auxTravelers,
				stayCode:grTravels.getDisplayValue('u_inbound_flight_rail_arrival_city_state')
			};
			//gs.info([grTravels.getDisplayValue('u_inbound_flight_train_number')]+' :'+JSON.stringify(aux[grTravels.getDisplayValue('u_inbound_flight_train_number')]))
		}
	}
	auxTravelers = [];
}
//gs.info(JSON.stringify(aux))
//gs.eventQueue('high_risk.travel',grTravels,JSON.stringify(aux),gs.getProperty('cmx.travels.gsoc.group'));
//gs.info(Object.keys(aux))
//gs.info(aux['213'].travelesUsers.length)

for (var n in aux){
	for(var i = 0; i <aux[n].travelesUsers.length;i++){
		var user =aux[n].travelesUsers[i]
		gs.info(user.sys_id)
	}
	
}


//getUserRegionalManager('991699753741b200a023138943990e05')
function getUserRegionalManager(userId){
	try{
		var user = new GlideRecord('sys_user')
			if(user.get(userId)){
				var grGroup = new GlideRecord('sys_user_group')
				grGroup.addQuery('u_country.sys_idSTARTSWITH'+user.u_country+'^nameSTARTSWITHcx local Security')
				grGroup.query();
				grGroup.next();
				if(grGroup.parent){
					var grRegionalManager = new GlideRecord('sys_user_grmember')
						grRegionalManager.addQuery('group='+grGroup.parent);
						grRegionalManager.query();
						grRegionalManager.next();
						if(grRegionalManager.user){
							gs.info(grRegionalManager.user.sys_id)
							departureManagers[grRegionalManager.user.sys_id] = true;
							//return grRegionalManager.user.sys_id+""
						}
						else throw 'Missing user from group '+grGroup.getDisplayValue('parent');
				}else throw 'Missing group for country '+user.getDisplayValue('u_country');

			}else throw 'Missing User for country '+userId;

	}catch(ex){
		gs.info(ex)
	}
}




