// This code will find though the old record in rage_item table and insert a duplicate into the new discovery shceduled record related list.

if(source.u_segmento != "") {
    var OldName = source.u_descripción;
    var range = new GlideRecord('discovery_range_item');
        range.addQuery('schedule.name','CONTAINS',OldName);
        range.query();
        if(range.next()){
			range.schedule = target.sys_id;
			var id = range.insert();
			log.info(ip + " inserted " + id);
        }
}


//code to test if the old record match with the new ones 
//This could be improved implementing a sort algorimt that return true/false if the record and content match

var aux = 0;
var grSheduled = new GlideRecord('discovery_schedule')
    grSheduled.addQuery('nameLIKEold^location=18d7add7dba1270042994410ba9619a4'); // dinamyc query
    grSheduled.query();
    while(grSheduled.next()){
        var grItems =  new GlideRecord('discovery_range_item');
            grItems.addQuery('schedule='+grSheduled.sys_id)
            grItems.query();
            while(grItems.next()){
                aux++
            }
    }
gs.info(aux)



//code to edit when the data soruces will run
//The hard code number in line 20  target == 25 are the blocks in with we want to run
//we make this block of code because if the data soruce run again with other data soruce running the record mess up o could be mess up
// this is a separeted code from the top code
//
var target = 0;
var grScheduled = new GlideRecord('discovery_schedule')
//grScheduled.addQuery('nameLIKEtienda^nameNOT LIKEOLD'); //not old
grScheduled.addQuery('nameNOT LIKEtienda^active=true');
grScheduled.orderBy('name');
var parent = [];
grScheduled.query();
while(grScheduled.next()){
    gs.info("Target " + target);
  if(target == 0) {
      grScheduled.disco_run_type = "periodically";
      grScheduled.run_after = "";
      grScheduled.update();
  } else {
       if(parent.length > 0) {
               grScheduled.disco_run_type = "after_discovery";
           grScheduled.run_after = parent.pop();
           grScheduled.update();
       }
  }
  target++
  if(target == 25)
      target = 0;
  parent.push(grScheduled.getValue('sys_id'));
}