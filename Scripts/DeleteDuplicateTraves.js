var aux =[]
var counter = 0;
var grTravel = new GlideRecord('u_travel_transportation')
//grTravel.addQuery("u_start_stay_dateON2018-07-14@javascript:gs.dateGenerate('2018-07-14','start')@javascript:gs.dateGenerate('2018-07-14','end')^u_inbound_air_rail_carrier=cd5fa044db5f97c04f0254904b9619bb")
    grTravel.query()
    grTravel.orderByDesc("sys_created_on");
    while(grTravel.next() && counter < 5){
        counter++
        gs.info('counter'+grTravel.sys_id)
        var travelTransportation = new GlideAggregate('u_travel_transportation');
            travelTransportation.addAggregate('COUNT');
            travelTransportation.addQuery("u_start_stay_date", grTravel.u_start_stay_date);
            travelTransportation.addQuery("u_end_stay_date", grTravel.u_end_stay_date);
            travelTransportation.addQuery("u_requestor_trip",grTravel.u_requestor_trip);
            travelTransportation.addQuery("u_inbound_air_rail_carrier",grTravel.u_inbound_air_rail_carrier);
            travelTransportation.addQuery("u_station",grTravel.u_station);
            travelTransportation.addQuery("u_traveler_type", grTravel.u_traveler_type);
            travelTransportation.addQuery("u_stay_city_state",grTravel.u_stay_city_state);
            travelTransportation.addQuery("sys_id",'!=',grTravel.sys_id);
            if(aux.length > 0)
                travelTransportation.addQuery("sys_id",'NOTIN',aux);
            travelTransportation.query();
            if(travelTransportation.next()){
                incidents = travelTransportation.getAggregate('COUNT');
                if(incidents >0)
                gs.info('The record : '+grTravel.sys_id+' Has : '+incidents+' Duplicated values')
            }
            var travelTransportation1 = new GlideRecord('u_travel_transportation');
            travelTransportation1.addQuery("u_start_stay_date", grTravel.u_start_stay_date);
            travelTransportation1.addQuery("u_end_stay_date", grTravel.u_end_stay_date);
            travelTransportation1.addQuery("u_requestor_trip",grTravel.u_requestor_trip);
            travelTransportation1.addQuery("u_inbound_air_rail_carrier",grTravel.u_inbound_air_rail_carrier);
            travelTransportation1.addQuery("u_station",grTravel.u_station);
            travelTransportation1.addQuery("u_traveler_type", grTravel.u_traveler_type);
            travelTransportation1.addQuery("u_stay_city_state",grTravel.u_stay_city_state);
            travelTransportation1.addQuery("sys_id",'!=',grTravel.sys_id);
            travelTransportation1.query();
            while(travelTransportation1.next()){
                aux.push(travelTransportation1.getValue('sys_id'))
            }
            aux = []
    }
    