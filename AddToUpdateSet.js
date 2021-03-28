/**
 * 
 * @param {GlideRecord} current  Gliderecord that need to be added to the set
 */

function addToUpdateSet(current) {
      //Push the update into the current update set
      if (typeof GlideUpdateManager2 != 'undefined')
            var um = new GlideUpdateManager2();
      else
            var um = new Packages.com.glide.update.UpdateManager2();
      um.saveRecord(current);
      //Query for the current update set to display info message
      var setID = gs.getPreference('sys_update_set');
      var us = new GlideRecord('sys_update_set');
      us.get(setID);
      //Display info message and reload the form
      gs.info('Record included in ' + us.name);

}
