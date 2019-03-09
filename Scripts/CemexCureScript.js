var SSTravelServiceUtils = Class.create();
SSTravelServiceUtils.prototype = {
	initialize: function() {
	},

	brValidateVisibility: function(){

		var query = '';
		var countries = '';

		//Review visibility groups
		var tableQuery = 'u_groupDYNAMICd6435e965f510100a9ad2572f2b47744';

		var visibilityRules = new GlideRecord('u_assignment_groups');
		visibilityRules.addEncodedQuery(tableQuery);
		visibilityRules.query();

		while(visibilityRules.next()){
			//Obtain Countries
			var countriesRecord = visibilityRules.getValue('u_countries');

			countries = visibilityRules.getValue('u_countries').split(',');
			//gs.log('countries: '+countries,'countries');

			for(var i=0; i<countries.length;i++){
				if(query == ''){
					query = 'u_home_country='+countries[i];
				}else{
					query += '^ORu_home_country='+countries[i];
				}
			}
		}
		gs.log('1 '+query,'countryquery');
		return query;
	},

	validateVisibility : function(currentTrip){

		var result           = false;
		var loggedUser       = gs.getUserID();
		var user             = gs.getUser();
		var loggedUserGroups = [];

		var query = 'u_countriesLIKE'+currentTrip.getValue('u_home_country').toString();
		gs.log('2 '+query,'countryquery');
		var visibilityRules = new GlideRecord('u_assignment_groups');
		visibilityRules.addEncodedQuery(query);
		visibilityRules.query();

		while(visibilityRules.next()){

			//Review if member of Assignment Group
			if(user.isMemberOf(visibilityRules.getValue('u_group'))){

				result = true;
			}
		}

		return result;

	},

	brValidateVisibilityTransportation: function(){

		var query = '';
		var countries = '';

		//Review visibility groups
		var tableQuery = 'u_groupDYNAMICd6435e965f510100a9ad2572f2b47744';

		var visibilityRules = new GlideRecord('u_assignment_groups');
		visibilityRules.addEncodedQuery(tableQuery);
		visibilityRules.query();

		while(visibilityRules.next()){
			//Obtain Countries
			var countriesRecord = visibilityRules.getValue('u_countries');

			countries = visibilityRules.getValue('u_countries').split(',');
			//gs.log('countries: '+countries,'countries');

			for(var i=0; i<countries.length;i++){
				if(query == ''){
					query = 'u_trip.u_home_country='+countries[i];
				}else{
					query += '^ORu_trip.u_home_country='+countries[i];
				}
			}
		}
		return query;
	},

	validateVisibilityTransportation : function(currentTravel){

		var result           = false;
		var loggedUser       = gs.getUserID();
		var user             = gs.getUser();
		var loggedUserGroups = [];
		var tripId = currentTravel.u_trip.getValue('u_home_country');
		tripId = currentTravel.u_trip.u_home_country;

		//gs.log("Country: " + tripId, "testDo");
		var query = 'u_countriesLIKE'+tripId;

		//gs.log("Query: " + query, "testDo");

		var visibilityRules = new GlideRecord('u_assignment_groups');
		visibilityRules.addEncodedQuery(query);
		visibilityRules.query();

		while(visibilityRules.next()){
			//Review if member of Assignment Group
			if(user.isMemberOf(visibilityRules.getValue('u_group'))){
				//gs.log("MEMEBER", "testDo");
				result = true;
			}
		}
		
		if(!result){
// 			var cxTravelServicesUtils = new CxTravelServicesUtils();
// 			var flightsScope = cxTravelServicesUtils.getFlightsScope(true);
			
// 			if(flightsScope.length > 0){
// 				result = true;
// 			}
			
			var groupGSOC = gs.getProperty('cmx.travels.gsoc.group');
			var groupDirectors = gs.getProperty('cmx.travels.security.managers.directors');	  
			
			if(user.isMemberOf(groupGSOC) || user.isMemberOf(groupDirectors)){
				result = true;
			}
		}

		//gs.log("R: " + result, "testDo");
 		return result;		
	},

	queryTravelRecords: function(){
		//*********************************************************************************************************************************************
		//                                                             Variables
		//*********************************************************************************************************************************************

		//_________________
		//Message Variables
		//_________________
		var httpStatus = '';
		var responsePNR       = '';
		var responsesysid     = '';
		var responserequestor = '';
		var status            = '';
		var tripId = '';
		var travelId = '';
		var responseBodyJSON = '';
		var pnrArray = [];

		//________________
		//QUERY Dates
		//________________
		var today = new Date();
		var last2Days = new Date();
		last2Days.setDate(last2Days.getDate() - 2);

		var toDate = today.toISOString();
		var fromDate = last2Days.toISOString();
		//gs.log('toDate: '+toDate,'TRAVEL SERVICE');
		//gs.log('fromDate: '+fromDate,'TRAVEL SERVICE');

		//var fromDate = "2017-12-06T00:00:00.583Z";
		//var toDate = "2017-12-08T23:59:59.583Z";

		//________________
		//Web Service Execution
		//________________
		try {
			var r = new sn_ws.RESTMessageV2('Travel Services', 'post');
			r.setStringParameter('fromGmtDate',fromDate);
			r.setStringParameter('toGmtDate',toDate);

			var response = r.execute();
			var responseBody = response.getBody();
			responseBodyJSON = JSON.parse(responseBody);
			httpStatus = response.getStatusCode();
			//gs.log('STATUS: '+httpStatus,'TRAVEL SERVICE');
			//gs.log('LENGTH: '+responseBodyJSON.TravelLocationPlans.length,'TRAVEL SERVICE');
			gs.log('LENGTH: '+responseBody,'TRAVEL SERVICE');
		}
		catch(ex) {
			var message = ex.getMessage();
			//gs.log('message: '+message,'TRAVEL SERVICE');
		}

		if(httpStatus=='200'){

			var travelPlans = responseBodyJSON.TravelLocationPlans;

			//Review all Travel Plans obtain in the query
			for(var i=0;i<travelPlans.length;i++){
				//if(travelPlans[i].RecordLocator=='KYBMXW'){   //TEST RECORD LOCATOR
				//gs.log('RECORD: '+JSON.stringify(travelPlans[i]),'TRAVEL SERVICE');
				pnrArray.push(travelPlans[i].RecordLocator);

				//________________
				//Trips Variables
				//________________

				var contactMedia   = '';
				var endDate        = '';
				var homeCountry    = '';
				var preferredEmail = '';
				var preferredPhone = '';
				var pnrLocator     = travelPlans[i].RecordLocator;
				var requestor      = '';
				var startDate      = '';


				var travelerLocations = travelPlans[i].TravelLocations;
				var travelerProfiles = travelPlans[i].Profiles;
				//gs.log(pnrLocator+' Locations Length: '+travelerLocations.length,'TRAVEL SERVICE');
				//gs.log(pnrLocator+' Profiles Length: '+travelerProfiles.length,'TRAVEL SERVICE');

				if(travelerProfiles.length!=0){
					//Profile values
					var profileCountry = new GlideRecord('core_country');
					if(profileCountry.get('name',travelerProfiles[0].HomeCountry)){
						homeCountry = profileCountry.sys_id.toString();
					}else{
						profileCountry.initialize();
						profileCountry.name = travelerProfiles[0].HomeCountry;
						homeCountry = profileCountry.insert();
					}
					//requestor = travelerProfiles.FirstName+' '+travelerProfiles.LastName;

					var profileEmails = travelerProfiles[0].EmailAddresses;
					var profilePhoneNumbers = travelerProfiles[0].PhoneNumbers;
					//gs.log(pnrLocator+' EmailAddresses Length: '+profileEmails.length,'TRAVEL SERVICE');
					//gs.log(pnrLocator+' PhoneNumbers Length: '+profilePhoneNumbers.length,'TRAVEL SERVICE');

					//Review all EmailAddresses the profile has
					for(var h=0;h<profileEmails.length;h++){
						//Obtain Preferred Email Address
						if(profileEmails[h].EmailPriority=='Preferred'){
							//Obtain traveler local profile
							preferredEmail = profileEmails[h].EmailAddress;
							if(preferredEmail!=''){
								var user = new GlideRecord('sys_user');
								user.addQuery('email',preferredEmail);
								//user.addQuery('first_name',travelerProfiles.FirstName);
								//user.addQuery('last_name',travelerProfiles.LastName);
								user.query();

								if(user.next()){
									requestor = user.sys_id.toString();
								}else{
									user.initialize();
									user.user_name = travelerProfiles[0].FirstName.toLowerCase()+'.'+travelerProfiles[0].LastName.toLowerCase();
									user.first_name = travelerProfiles[0].FirstName;
									user.last_name = travelerProfiles[0].LastName;
									user.email = preferredEmail;
									requestor = user.insert();

									//Associate User to "New Users Groups"
									var group = new GlideRecord('sys_user_group');
									if(group.get('name','New Users Group')){
										var groupMember = new GlideRecord('sys_user_grmember');
										groupMember.initialize();
										groupMember.user = requestor;
										groupMember.group = group.sys_id;
										groupMember.insert();

									}
								}
							}
							// 								else{
							// 									//Send notification to Security Control with email issue
							// 									var eventName = 'cx.security.travelservice.noemail';
							// 									var emailBody = 'PNR  #'+pnrLocator+' does not have an email address.';

							// 									gs.eventQueue(eventName,'',emailBody,'');
							// 								}
						}
					}

					//Review all PhoneNumbers the profile has
					for(var k=0;k<profilePhoneNumbers.length;k++){
						//Obtain Preferred Phone Number
						if(profilePhoneNumbers[k].PhonePriority=='Preferred'){
							preferredPhone = profilePhoneNumbers[k].CountryCode+' '+profilePhoneNumbers[k].PhoneNumber;
						}
					}
				}

				var activeLocations = false;
				for(var m=0;m<travelerLocations.length;m++){
					if(travelerLocations[m].SegmentType!='Header' && travelerLocations[m].SegmentType!='Mobile'){
						activeLocations = true;
					}
				}


				//_______________________________
				//Notification of empty fields
				//_______________________________

				// 						var SegmentType                              = '';
				// 						var firstNameEmpty                           = travelerProfiles[0].FirstName;
				// 						var lastNameEmpty                            = travelerProfiles[0].LastName;
				// 						var homeCountryEmpty                         = travelerProfiles[0].HomeCountry;
				// 						var preferredEmailEmpty                      = preferredEmail;
				// 						var preferredPhoneEmpty                      = preferredPhone;
				// 						var inboundFlightRailDepartureCityStateEmpty = '';
				// 						var inboundFlightRailArrivalCityStateEmpty   = '';
				// 						var inboundFlightRailDepartureDateTimeEmpty  = '';
				// 						var inboundFlightRailArrivalDateTimeEmpty    = '';
				// 						var airLineNameEmpty                         = '';
				// 						var flightNumberEmpty                        = '';

				// 						for(var n=0;n<travelerLocations.length;n++){
				// 							SegmentType                              = travelerLocations[n].SegmentType;
				// 							inboundFlightRailDepartureCityStateEmpty = travelerLocations[n].FromIataLocationCode;
				// 							inboundFlightRailArrivalCityStateEmpty   = travelerLocations[n].ToIataLocationCode;
				// 							flightNumberEmpty                        = travelerLocations[n].AirRailNumber;

				// 							var startTravelDateNotif                 = travelerLocations[n].FromGmtDate;
				// 							var endTravelDateNotif                   = travelerLocations[n].ToGmtDate;

				// 							airLineNameEmpty                         = travelerLocations[n].AirRailName;
				// 						}

				// 						if(SegmentType != 'Hotel' && pnrLocator==''||firstNameEmpty==''||lastNameEmpty==''||homeCountryEmpty==''||preferredEmailEmpty==''||preferredPhoneEmpty==''||inboundFlightRailDepartureCityStateEmpty==''||inboundFlightRailArrivalCityStateEmpty==''||inboundFlightRailDepartureDateTimeEmpty==''||inboundFlightRailArrivalDateTimeEmpty==''||airLineNameEmpty==''||flightNumberEmpty==''){

				// 							//Send notification to Security Control
				// 							var eventName = 'cx.security.travelservice.noemail';
				// 							var emailBody = 'First Name: '+firstNameEmpty+'<br>Last Name: '+lastNameEmpty+'<br>Home Country: '+homeCountryEmpty+'<br>Preferred Email: '+preferredEmailEmpty+'<br>Preferred Phone: '+preferredPhoneEmpty+'<br>Inbound Flight/Rail Departure City, State: '+inboundFlightRailDepartureCityStateEmpty+'<br>Inbound Flight/Rail Arrival City, State: '+inboundFlightRailArrivalCityStateEmpty+'<br>Inbound Flight/Rail Departure Date & Time: '+inboundFlightRailDepartureDateTimeEmpty+'<br>Inbound Flight/Rail Arrival Date & Time: '+inboundFlightRailArrivalDateTimeEmpty+'<br>Air Line Name: '+airLineNameEmpty+'<br>Flight Number: '+flightNumberEmpty;

				// 							gs.eventQueue(eventName,'',emailBody,emailBody,'');

				// 						}


				//_______________________________
				//Insert or Update Trip
				//_______________________________
				if(travelerLocations.length!=0 && preferredEmail!='' && activeLocations){
					var trips = new GlideRecord('u_trips');
					if(trips.get('u_pnr_locator',pnrLocator)){

						tripId = trips.sys_id.toString();

						//___________________
						//Update Trips Record
						//___________________

						trips.u_requestor       = requestor;
						trips.u_home_country    = homeCountry;
						trips.u_preferred_email = preferredEmail;
						trips.u_preferred_phone = preferredPhone;
						//trips.u_start_date      = startDate;
						//trips.u_end_date        = endDate;
						trips.u_fight_number = travelPlans[i].PnrLocationPlanId;
						trips.u_contact_media   = '';
						trips.active            = travelPlans[i].Active;
						trips.update();

						//________________
						// Response Update
						//__________________
						status = 'Record updated';
						responserequestor = trips.u_requestor;
						responsesysid = tripId;
						responsePNR = trips.u_pnr_locator;

					}else{
						//___________________
						//Insert Trips Record
						//___________________

						trips.initialize();
						trips.u_requestor       = requestor;
						trips.u_home_country    = homeCountry;
						trips.u_preferred_email = preferredEmail;
						trips.u_preferred_phone = preferredPhone;
						trips.u_pnr_locator     = pnrLocator;
						//trips.u_start_date      = startDate;
						//trips.u_end_date        = endDate;
						trips.u_fight_number = travelPlans[i].PnrLocationPlanId;
						trips.u_contact_media   = '';
						trips.active            = travelPlans[i].Active;
						tripId                  = trips.insert();

						//_________________
						// Response Create
						//___________________
						status                  = 'Record created';
						responserequestor       = trips.u_requestor;
						responsesysid           = trips.sys_id;
						responsePNR             = trips.u_pnr_locator;
					}

					//_______________________________
					//Insert or Update Travel
					//_______________________________
					//if(travelerLocations.length!=0){
					//Review all Locations the trip has
					for(var j=0;j<travelerLocations.length;j++){

						if(travelerLocations[j].SegmentType!='Header' && travelerLocations[j].SegmentType!='Mobile'){
							//Travel dates
							var startTravelDate = new GlideDateTime(travelerLocations[j].FromGmtDate);
							startTravelDate.setValue(travelerLocations[j].FromGmtDate);
							var endTravelDate = new GlideDateTime(travelerLocations[j].ToGmtDate);
							endTravelDate.setValue(travelerLocations[j].ToGmtDate);

							//Review complete Trip dates
							if(startDate=='' || startDate>startTravelDate){
								startDate = startTravelDate;
							}
							if(endDate=='' || endDate<endTravelDate){
								endDate = endTravelDate;
							}

							//Review Carrier values
							var inboundCarrierId = '';
							if(travelerLocations[j].AirRailName!=''){
								var inboundCarrier = new GlideRecord('core_company');
								if(inboundCarrier.get('name',travelerLocations[j].AirRailName)){
									inboundCarrier.u_code = travelerLocations[j].AirRailCode;
									inboundCarrier.update();
									inboundCarrierId = inboundCarrier.sys_id.toString();
								}else{
									inboundCarrier.initialize();
									inboundCarrier.name = travelerLocations[j].AirRailName;
									inboundCarrier.u_code = travelerLocations[j].AirRailCode;
									inboundCarrierId = inboundCarrier.insert();
								}
							}

							//Review Supplier values
							var supplierId = '';
							if(travelerLocations[j].Supplier!=''){
								var supplier = new GlideRecord('core_company');
								if(supplier.get('name',travelerLocations[j].Supplier)){
									supplierId = supplier.sys_id.toString();
								}else{
									supplier.initialize();
									supplier.name = travelerLocations[j].Supplier;
									supplierId = supplier.insert();
								}
							}

							//Obtain Stay City/State
							var stayCity = '';
							if(travelerLocations[j].SegmentType=='Hotel'){
								stayCity = travelerLocations[j].FromIataLocationCode;
							}else{
								stayCity = travelerLocations[j].ToIataLocationCode;
							}

							//Review country with new table
							var countryId = '';
							var station = '';
							var transportationStation = new GlideRecord('u_transport_station');
							if(transportationStation.get('u_iata_code',stayCity)){
								countryId = transportationStation.u_country;
								station = transportationStation.u_name;
							}

							// Tentativo cambiar el filtro por PnrLocationPlanId - The unique travel location plan ID
							/*gs.info('travels id = ' + j);
										gs.info('travels id = ' + startTravelDate);
										gs.info('travels id = ' + endTravelDate);
										gs.info('travels id = ' + requestor);
										gs.info('travels id = ' + inboundCarrierId);
										gs.info('travels id = ' + countryId);
										gs.info('travels id = ' + station);
										gs.info('travels id = ' + travelerLocations[j].TravelerType);
										gs.info('travels id = ' + stayCity);*/
							var travelTransportation = new GlideRecord('u_travel_transportation');	
							travelTransportation.addQuery("u_start_stay_date", startTravelDate);
							travelTransportation.addQuery("u_end_stay_date", endTravelDate);
							travelTransportation.addQuery("u_requestor_trip", requestor);
							travelTransportation.addQuery("u_inbound_air_rail_carrier", inboundCarrierId+'');
							//travelTransportation.addQuery("u_stay_country", countryId);
							travelTransportation.addQuery("u_station", station+'');
							travelTransportation.addQuery("u_traveler_type", travelerLocations[j].TravelerType+'');
							travelTransportation.addQuery("u_stay_city_state", stayCity+'');
							travelTransportation.query();

							// New rule to update information
							//if(travelTransportation.get('u_travel_transportation_id',travelerLocations[j].TravelerLocationId)){

							if(travelTransportation.next()) {
								travelTransportation.u_trip                                      = tripId;
								travelTransportation.u_requestor_trip                            = requestor;
								travelTransportation.u_preferred_email                           = preferredEmail;
								travelTransportation.u_preferred_phone                           = preferredPhone;
								travelTransportation.u_pnr_locator                               = pnrLocator;
								travelTransportation.u_segment_type                              = travelerLocations[j].SegmentType;
								travelTransportation.u_traveler_type                             = travelerLocations[j].TravelerType;
								travelTransportation.u_stay_city_state                           = stayCity;
								travelTransportation.u_stay_country                              = countryId;
								travelTransportation.u_station                                   = station;
								travelTransportation.u_start_stay_date                           = startTravelDate;
								travelTransportation.u_end_stay_date                             = endTravelDate;
								travelTransportation.company                                     = supplierId;
								travelTransportation.u_inbound_air_rail_carrier                  = inboundCarrierId;
								travelTransportation.u_inbound_flight_train_number               = travelerLocations[j].AirRailNumber;
								travelTransportation.u_inbound_flight_rail_departure_city_state  = travelerLocations[j].FromIataLocationCode;
								travelTransportation.u_inbound_flight_rail_departure_date        = startTravelDate;
								travelTransportation.u_inbound_flight_rail_arrival_city_state    = travelerLocations[j].ToIataLocationCode;
								travelTransportation.u_inbound_flight_rail_arrival_date          = endTravelDate;
								travelTransportation.u_outbound_air_rail_carrier                 = '';
								travelTransportation.u_outbound_flight_train_number              = '';
								travelTransportation.u_outbound_flight_rail_departure_city_state = '';
								travelTransportation.u_outbound_flight_rail_departure_date       = '';
								travelTransportation.u_outbound_flight_rail_arrival_city_state   = '';
								travelTransportation.u_outbound_flight_rail_arrival_date         = '';
								travelTransportation.u_called_user_departing                     = '';
								travelTransportation.u_called_user_arrival                       = '';

								// New section of fields
								travelTransportation.setValue('u_global_departure_date',this.validDate(travelerLocations[j].FromGmtDate).getNumericValue());
								travelTransportation.setValue('u_global_arrival_date',this.validDate(travelerLocations[j].ToGmtDate).getNumericValue());
								travelTransportation.setValue('u_local_departure_date',this.validDate(travelerLocations[j].FromLocalDate).getNumericValue());
                                travelTransportation.setValue('u_local_arrival_date',this.validDate(travelerLocations[j].ToLocalDate).getNumericValue());
								travelTransportation.u_from_medical_risk                         = travelerLocations[j].FromMedicalRisk;
								travelTransportation.u_to_medical_risk                           = travelerLocations[j].ToMedicalRisk;
								travelTransportation.u_from_security_risk                        = travelerLocations[j].FromSecurityRisk;
								travelTransportation.u_to_security_risk                          = travelerLocations[j].ToSecurityRisk;
								travelTransportation.u_deparment_airport_code                    = travelerLocations[j].FromIataLocationCode;         
								travelTransportation.u_arrival_airport_code                      = travelerLocations[j].ToIataLocationCode;

								//Populate Risk and Route
								travelTransportation.u_route                                     = travelTransportation.u_departing_station+' -->  '+travelTransportation.u_station;
								travelTransportation.u_risk                                      = this.calculateRisk(travelTransportation.u_to_security_risk, travelTransportation.u_to_medical_risk);


								travelTransportation.update();
							}else{
								travelTransportation.initialize();
								travelTransportation.u_requestor_trip                            = requestor;
								travelTransportation.u_preferred_email                           = preferredEmail;
								travelTransportation.u_preferred_phone                           = preferredPhone;
								travelTransportation.u_pnr_locator                               = pnrLocator;
								travelTransportation.u_trip                                      = tripId;
								travelTransportation.u_segment_type                              = travelerLocations[j].SegmentType;
								travelTransportation.u_traveler_type                             = travelerLocations[j].TravelerType;
								travelTransportation.u_travel_transportation_id                  = travelerLocations[j].TravelerLocationId;
								travelTransportation.u_stay_country                              = countryId;
								travelTransportation.u_station                                   = station;
								travelTransportation.u_stay_city_state                           = stayCity;
								travelTransportation.u_start_stay_date                           = startTravelDate;
								travelTransportation.u_end_stay_date                             = endTravelDate;
								travelTransportation.company                                     = supplierId;
								travelTransportation.u_inbound_air_rail_carrier                  = inboundCarrierId;
								travelTransportation.u_inbound_flight_train_number               = travelerLocations[j].AirRailNumber;
								travelTransportation.u_inbound_flight_rail_departure_city_state  = travelerLocations[j].FromIataLocationCode;
								travelTransportation.u_inbound_flight_rail_departure_date        = startTravelDate;
								travelTransportation.u_inbound_flight_rail_arrival_city_state    = travelerLocations[j].ToIataLocationCode;
								travelTransportation.u_inbound_flight_rail_arrival_date          = endTravelDate;
								travelTransportation.u_outbound_air_rail_carrier                 = '';
								travelTransportation.u_outbound_flight_train_number              = '';
								travelTransportation.u_outbound_flight_rail_departure_city_state = '';
								travelTransportation.u_outbound_flight_rail_departure_date       = '';
								travelTransportation.u_outbound_flight_rail_arrival_city_state   = '';
								travelTransportation.u_outbound_flight_rail_arrival_date         = '';
								travelTransportation.u_called_user_departing                     = '';
								travelTransportation.u_called_user_arrival                       = '';
								travelTransportation.u_deparment_airport_code                    = travelerLocations[j].FromIataLocationCode;         
								travelTransportation.u_arrival_airport_code                      = travelerLocations[j].ToIataLocationCode;
								travelTransportation.u_fight_number                              = travelerLocations[j].AirRailNumber;

								// New section of fields
								travelTransportation.setValue('u_global_departure_date',this.validDate(travelerLocations[j].FromGmtDate).getNumericValue());
								travelTransportation.setValue('u_global_arrival_date',this.validDate(travelerLocations[j].ToGmtDate).getNumericValue());
								travelTransportation.setValue('u_local_departure_date',this.validDate(travelerLocations[j].FromLocalDate).getNumericValue());
                                travelTransportation.setValue('u_local_arrival_date',this.validDate(travelerLocations[j].ToLocalDate).getNumericValue());
                                
								travelTransportation.u_from_medical_risk                         = travelerLocations[j].FromMedicalRisk;
								travelTransportation.u_to_medical_risk                           = travelerLocations[j].ToMedicalRisk;
								travelTransportation.u_from_security_risk                        = travelerLocations[j].FromSecurityRisk;
								travelTransportation.u_to_security_risk                          = travelerLocations[j].ToSecurityRisk;

								//Populate Risk and Route
								travelTransportation.u_route                                     = travelTransportation.u_departing_station+' -->  '+travelTransportation.u_station;
								travelTransportation.u_risk                                      = this.calculateRisk(travelTransportation.u_to_security_risk, travelTransportation.u_to_medical_risk);

								travelTransportation.insert();
							}

							//_______________________________
							//Notification of empty fields
							//_______________________________

							var SegmentType                              = travelerLocations[j].SegmentType;
							var firstNameEmpty                           = travelerProfiles[0].FirstName;
							var lastNameEmpty                            = travelerProfiles[0].LastName;
							var homeCountryEmpty                         = travelerProfiles[0].HomeCountry;
							var preferredEmailEmpty                      = preferredEmail;
							var preferredPhoneEmpty                      = preferredPhone;
							var inboundFlightRailDepartureCityStateEmpty = travelerLocations[j].FromIataLocationCode;
							var inboundFlightRailArrivalCityStateEmpty   = travelerLocations[j].ToIataLocationCode;
							var inboundFlightRailDepartureDateTimeEmpty  = travelerLocations[j].FromGmtDate;
							var inboundFlightRailArrivalDateTimeEmpty    = travelerLocations[j].ToGmtDate;
							var airLineNameEmpty                         = travelerLocations[j].AirRailName;
							var flightNumberEmpty                        = travelerLocations[j].AirRailNumber;

							if(SegmentType != 'Hotel' && (pnrLocator==''||firstNameEmpty==''||lastNameEmpty==''||homeCountryEmpty==''||preferredEmailEmpty==''||preferredPhoneEmpty==''||inboundFlightRailDepartureCityStateEmpty==''||inboundFlightRailArrivalCityStateEmpty==''||inboundFlightRailDepartureDateTimeEmpty==''||inboundFlightRailArrivalDateTimeEmpty==''||airLineNameEmpty==''||flightNumberEmpty=='')){

								//Send notification to Security Control
								var eventName = 'cx.security.travelservice.noemail';
								var emailBody = 'First Name: '+firstNameEmpty+'<br>Last Name: '+lastNameEmpty+'<br>Home Country: '+homeCountryEmpty+'<br>Preferred Email: '+preferredEmailEmpty+'<br>Preferred Phone: '+preferredPhoneEmpty+'<br>Inbound Flight/Rail Departure City, State: '+inboundFlightRailDepartureCityStateEmpty+'<br>Inbound Flight/Rail Arrival City, State: '+inboundFlightRailArrivalCityStateEmpty+'<br>Inbound Flight/Rail Departure Date & Time: '+inboundFlightRailDepartureDateTimeEmpty+'<br>Inbound Flight/Rail Arrival Date & Time: '+inboundFlightRailArrivalDateTimeEmpty+'<br>Air Line Name: '+airLineNameEmpty+'<br>Flight Number: '+flightNumberEmpty;

								gs.eventQueue(eventName,trips,emailBody,emailBody,'');

							}
						}
					}

					//Update Trips Dates
					var tipDates = new GlideRecord('u_trips');
					if(tipDates.get(tripId)){
						tipDates.u_start_date      = startDate;
						tipDates.u_end_date        = endDate;
						tipDates.update();
					}
				}
				//}
			}
		}
		//gs.log('pnrArray: '+pnrArray,'TRAVEL SERVICE');
		//gs.log('pnrArrayLength: '+pnrArray.length,'TRAVEL SERVICE');
	},
	calculateRisk: function(security_risk, medical_risk){
		if(security_risk == 'Extreme' || medical_risk == 'Extreme') 
			return 'Extreme';
		else if(security_risk == 'High' || medical_risk == 'High') 
			return 'High';
		else if(security_risk == 'Medium' || medical_risk == 'Medium')
			return 'Medium';
		else if(security_risk == 'Low' || medical_risk == 'Low')
			return 'Low';
		else if(security_risk == 'Insignificant' || medical_risk == 'Insignificant')
			return 'Insignificant';

    },
    validDate: function(date){
        var regExp = /^(\d{2})\/(\d{2})\/(\d{4})\s(.*)/.exec(date);
        
        return new GlideDateTime(regExp[3]+'-'+regExp[1]+'-'+regExp[2]+' '+regExp[4]);
    
    },

	type: 'SSTravelServiceUtils'
};