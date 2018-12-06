
// Since hash tables are not supported by servicenos this is a bruteforce solution for the issue
//This code will be a sheduled job that runs every day at 00:00:00 GMT 
//This code match the persosn that are in the same flight for the current day
// if more than one person are in the same flight i will send a notification to a certain group
// if that flight is denominated hight risked it will send a notification for the regional manager for each region if it exist.
var aux = {};
var auxTravelers = [];
var grTravels = new GlideRecord('u_travel_transportation');
    grTravels.addQuery('u_global_departure_dateONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()')// testing pending add requestor!=null
    //grTravels.addQuery('u_inbound_flight_train_number=143');
    grTravels.query();
    while(grTravels.next()){
        var grTravelMatcher = new GlideRecord('u_travel_transportation');
            grTravelMatcher.addQuery('u_inbound_flight_train_number',grTravels.getValue('u_inbound_flight_train_number'));
            grTravelMatcher.query();
        while(grTravelMatcher.next()){
            auxTravelers.push(grTravelMatcher.getDisplayValue('u_requestor_trip'));
        }
        if(auxTravelers.length > 0){
            if(!aux[grTravels.getDisplayValue('u_inbound_flight_train_number')]){
                aux[grTravels.getDisplayValue('u_inbound_flight_train_number')]=
                    {
                        travelesUsers:auxTravelers+"",
                        PNR:grTravels.getValue('u_pnr_locator'),
                        flighNumber:grTravels.getDisplayValue('u_inbound_flight_train_number'),
                        carrier:grTravels.getDisplayValue('u_inbound_air_rail_carrier'),
                        risk:grTravels.getDisplayValue('u_risk'),
                        departureCode:grTravels.getDisplayValue('u_inbound_flight_rail_departure_city_state'),
                        stayCode:grTravels.getDisplayValue('u_inbound_flight_rail_arrival_city_state')
                    }
                auxTravelers = []
            }
            
        }
    }
    for (n in aux){
        gs.info(n+" :"+aux[n].travelesUsers)
        if(aux.risk == 'Hight'){
            var auxRisk = [];
            auxRisk.push(getGerentusers(aux[n].departureCode))
            auxRisk.push(getGerentusers(aux[n].stayCode))
            //gs.eventQueue('same.travel.notification',JSON.stringify(aux[n]),auxRisk+"");
        }else{
            //gs.eventQueue('same.travel.notification',JSON.stringify(aux[n]),null);
        }
    }
    //find the "gerente reginal" with the citycode
function getGerentusers(cityCode){ // since the db it not that redundant i need to make 5 query to diffent tables if you know a better way let me know luispreciado996@gmail.com
    var auxMembers =[];
    var grTravelStations = new GlideRecord('u_transport_station')
        grTravelStations.addQuery('u_iata_code',cityCode);
        grTravelStations.addQuery('u_country!=NULL');
        grTravelStations.query();
        if(grTravelStations.next()){
            gs.info('transportation table passed')
            var grCoreContry = new GlideRecord('core_country')
                grCoreContry.get(grTravelStations.u_country);
                if(grCoreContry){
                    gs.info('contry table passed')
                    var grCoreRegion = new GlideRecord('u_core_region');
                        grCoreRegion.addQuery('u_code',grCoreContry.iso3166_2); 
                        grCoreRegion.query();
                    }
                    if(grCoreRegion.next()){
                        gs.info('region table passed')
                        var grGroup = new GlideRecord('sys_user_group');
                            grGroup.addQuery('u_regionsLIKE'+grCoreRegion.sys_id);
                            grGroup.query()
                            if(grGroup.next()){
                                gs.info('group table passed')
                                var grGroupMember = new GlideRecord('sys_user_grmember');
                                    grGroupMember.addQuery('group',grGroup.sys_id);
                                    grGroupMember.query();
                                    while(grGroupMember.next()){
                                        gs.info('members table passed')
                                        auxMembers.push(grGroupMember.getValue('sys_id'))
                                    }
                            }
                    }
        }
        gs.info(auxMembers+"")
        return auxMembers+"";
}