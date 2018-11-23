//Used in a espesific case were instead of create 20 UI policies i set the variables that were empty set to hidden mode.
function onCondition() {
    var variableSet ="application_request_request_email_account_access_or_group";
    var variableSet1 ="reuqested_for_information"
    hideField(variableSet,variableSet1);

    function hideField(set1,set2){
        var val;
        for (x = 0; x < g_form.nameMap.length; x++) {
            val = g_form.getValue(g_form.nameMap[x].prettyName);
            console.log("test"+val);
            if(!val){
                g_form.setDisplay(g_form.nameMap[x].prettyName, false);
            }
           g_form.setDisplay(set1, true);
           g_form.setDisplay(set2, true);
        } 

    }
}