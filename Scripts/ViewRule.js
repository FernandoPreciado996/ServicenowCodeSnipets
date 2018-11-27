//This code redirects the user to the given view if the condition meets
(function overrideView(view, is_list) {

	if(gs.getUser().hasRole('security_travel_trip_manager') || gs.getUser().hasRole('security_travel_responsible_user'))
		answer = "Security_Users_View";  //Name of the view in the form we give the scope to the sys_user table
	else
		answer = null;
	

})(view, is_list);