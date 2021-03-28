//This function given the table and re record id could delete the comments
//The requirement of this was: Since im working in a rest story integration betwen instances when i delete an story and recreate the comments, since the story have the same sys_id the old comments show up. 


deleteJournalInputs('rm_story','25c52ec0db332300d848712ebf961958')


function deleteJournalInputs(table,record){
    
var grStory = new GlideRecord(table)
    if(grStory.get(record)){
        var grJournal = new GlideRecord('sys_journal_field');
            grJournal.addQuery('element_id',grStory.sys_id);
            grJournal.addQuery('sys_journal_field',grStory.sys_class_name);
            grJournal.query();
            while(grJournal.next()){
                grJournal.deleteRecord();
            }
        var grAudit = new GlideRecord('sys_audit');
        grAudit.addQuery('documentkey',grStory.sys_id);
        grAudit.addQuery('fieldname','IN',['work_notes','comments']);
        grAudit.query();
        while(grAudit.next()){
            var grStoryLine = new GlideRecord('sys_history_line');
                grStoryLine.addQuery('audit_sysid',grAudit.sys_id);
                grStoryLine.addQuery('field','IN',['work_notes','comments']);
                grStoryLine.query();
            while(grStoryLine.next()){
                grStoryLine.deleteRecord()
            }
            grAudit.deleteRecord()
        }
    }
}