
var grTravel = new GlideRecord('u_travel_transportation');
var GSOCData={
    result:[]

}
var jsonFlightsToday={}; //catch todays same travelers
var jsonFlightsTomorrow={};//catch tomorrow same travelers
var auxUserCounter=[]; // catch the duplicate users and send them to GSOCData

var todayQuery='u_inbound_flight_rail_departure_dateONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()^u_segment_typeSTARTSWITHAir^u_traveler_typeSTARTSWITHInternational^u_requestor_tripISNOTEMPTY';
var tomorrowQuery='u_inbound_flight_rail_departure_dateONTomorrow@javascript:gs.beginningOfTomorrow()@javascript:gs.endOfTomorrow()^u_segment_typeSTARTSWITHAir^u_traveler_typeSTARTSWITHInternational^u_requestor_tripISNOTEMPTY';

populateJSON(todayQuery,true,jsonFlightsToday)
populateJSON(tomorrowQuery,true,jsonFlightsTomorrow)

gs.eventQueue('same.travel.notification.scheduled',grTravel,JSON.stringify(GSOCData.result),gs.getProperty('cmx.travels.gsoc.group'))
gs.info(JSON.stringify(GSOCData.result))


function populateJSON(query,clean,data){// populate GSOCData json with all matches
    var grTravels = new GlideRecord('u_travel_transportation');
    grTravels.addEncodedQuery(query);
    grTravels.query();
    while(grTravels.next()){
            data[grTravels.getDisplayValue('u_inbound_flight_train_number').trim()] ={
                todaydepartureDate: grTravels.getValue('u_inbound_flight_rail_departure_date'),
                displayVal: grTravels.getDisplayValue('u_inbound_flight_rail_departure_date'),
                flightNumber:grTravels.getValue('u_inbound_flight_train_number').trim(),
                flights: []
            }
    }
    for (var n in data){
        
        var grSameTravels = new GlideRecord('u_travel_transportation');
            grSameTravels.addEncodedQuery(query);
            grSameTravels.addQuery('u_inbound_flight_rail_departure_date',data[n].todaydepartureDate)
            grSameTravels.addQuery('u_inbound_flight_train_number','CONTAINS',data[n].flightNumber)
            grSameTravels.query();
            while(grSameTravels.next()){
                auxUserCounter.push(
                        {
                            user:grSameTravels.getDisplayValue('u_requestor_trip'),
                            number:grSameTravels.getDisplayValue('u_inbound_flight_train_number'),
                            home_country: grSameTravels.u_requestor_trip.u_country.getDisplayValue(),
                            local_departure_date: grSameTravels.getDisplayValue('u_local_departure_date'),
                            arrival_country_name:grSameTravels.getDisplayValue('u_stay_country'),
                            local_arrival_date:grSameTravels.getDisplayValue('u_local_arrival_date'),
                            risk:grSameTravels.getDisplayValue('u_to_security_risk'),
                            pnr:grSameTravels.getDisplayValue('u_pnr_locator'),
                            departure_airport:grSameTravels.getDisplayValue('u_departing_station'),
                            arrival_airport:grSameTravels.getDisplayValue('u_station')
                        }
                    );
            }
            if(auxUserCounter.length>1){
                    for(var o = 0 in auxUserCounter){
                        GSOCData.result.push(auxUserCounter[o]);
                    }
            }
            else if(clean == true) {delete data[n];}
            auxUserCounter=[];
    }
}
