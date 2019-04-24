//This script will add the given record to an existing update set



var gr = new GlideRecord('sys_user_group');
gr.get('2999f6bc1bb76b00c691535c2e4bcb94');


addToUpdateSet(gr)

function addToUpdateSet(current) {
//Check to make sure the table isn't synchronized already if you want to force it comment the validation. (Not recommended)
var tbl = current.getTableName();
if(tbl.startsWith('wf_') || tbl.startsWith('sys_ui_') || tbl == 'sys_choice' || current.getED().hasAttribute('update_synch') ||current.getED().hasAttribute('update_synch_custom')){
      gs.info('Updates are already being recorded for this table.');
}
else{
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
}
