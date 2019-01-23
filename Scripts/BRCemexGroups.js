(function executeRule(current, previous /*null when async*/) {


    //GSOC
    var GSOC = userIsGSOC();
    //regionals
    var regionalGroup =userGroupType('regional');
    //local
    var localGroup =userGroupType('local');
    //Manager
    var subordinates =getSubordinates(); 
    //var current = new GlideRecord('u_travel_transportation');
    gs.addInfoMessage(gs.getUserDisplayName())
    
    //current.query();
        if(userIsGSOC()){
            totalRecords[current.getValue(sys_id)] ={sysid:current.getValue('sys_id')}
        }else if(regionalGroup){
            var countries = avariableCountryRegionalGroup(regionalGroup)
            if(countries){
                    current.addQuery('u_stay_countryIN'+countries).addOrCondition('current.u_requestor_trip.u_countryIN'countries))
                       
            }
        }else if(localGroup){
            var countries = avariableCountrylocalGroup(regionalGroup)
            if(countries != false){
                for(var i in countries){
                    if(countries[i] == current.u_stay_country || countries[i] == current.u_requestor_trip.u_country){
                        totalRecords[current.getValue(sys_id)] ={sysid:current.getValue('sys_id')}
                    }
                }
            }
        }
        if(subordinates){
            current.addOrCondition('u_requestor_tripIN'+subordinates)
        }
    
    
    current.addQuery('sys_idIN'+totalFinal);
    gs.addInfoMessage(JSON.stringify(totalFinal))
    
    //GSCO
    function userIsGSOC(){
        return gs.getUser().isMemberOf(gs.getProperty('cmx.travels.gsoc.group'));
    }
    //Regional Manager 
    function userGroupType(type){ // also works for local
        var grValidGroups = new GlideRecord('sys_user_group');
        if(type == 'regional')
            grValidGroups.addQuery('nameLIKECX Regional Security -');
        else if(type == 'local')
            grValidGroups.addQuery('nameSTARTSWITHCX Local Security -');
        else return false;
            grValidGroups.query();
            while(grValidGroups.next()){
                if(gs.getUser().isMemberOf(grValidGroups.sys_id)){
                    return grValidGroups.sys_id;
                }
            }
            return false;
    }
    function avariableCountryRegionalGroup(group){
        var auxIDS =[];
        var grGroups = new GlideRecord('sys_user_group');
            grGroups.addQuery('parent',group);
            grGroups.query();
            while(grGroups.next()){
                auxIDS.push(grGroups.u_country.sys_id.getValue());
            }    
            if(auxIDS.length > 0){
                return auxIDS;
            }else return false;
    }
    //locals
    function avariableCountrylocalGroup(group){
        var auxIDS =[];
        var grGroups = new GlideRecord('sys_user_group');
            if(grGroups.get(group)){
                while(grGroups.next()){
                    auxIDS.push(grGroups.u_country.sys_id.getValue())
                }    
                if(auxIDS.length > 0){
                    return auxIDS 
                }else return false;
            }else return false;
           
    }
    //Subordinates
    function getSubordinates() {
    
        var subordinates = [];
        getSubordinatesId(gs.getUserID(),subordinates);
    
        function getSubordinatesId(id,subordinates){
            var user = new GlideRecord('sys_user');
            user.addEncodedQuery('manager='+id);
            user.query();
            while(user.next()){
                subordinates.push(user.sys_id.toString());
                getSubordinatesId(user.sys_id.toString(),subordinates);
            }			
        }
        
        if(subordinates.length>0)
        return subordinates;
        else return false;
    }
    
    })(current, previous);