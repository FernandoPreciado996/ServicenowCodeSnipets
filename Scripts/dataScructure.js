
// this code is using data structure it loopt to the incident tabvle finding the short description that matches
// since servicenow doesnt support new Map constructor this code was leaved i will take it to future proyects outside servicenow
// next steps add more parameter to the matches array
	


var grIncident = new GlideRecord('incident')
	grIncident.query();
	var aux = new Map;
	var matches =[];

	while(grIncident){
		if(!aux.get(grIncident.short_description)){
			aux.set(grIncident.short_description,0)
		}else if(aux.get(grIncident.short_description)){
			aux.set(grIncident.short_description,aux.get(grIncident.short_description)+1)
			matches[grIncident.getValue('short_description')] = aux.get(grIncident.short_description);
		}
	}
	for (n in matches){
		gs.info(n+" "+matches[n])
	}
