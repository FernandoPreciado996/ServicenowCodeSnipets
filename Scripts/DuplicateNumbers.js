function duplicateNumber(table,number){
    var aux =0;
    var grRecord = new GlideRecord(table);
    grRecord.addQuery('number',number);
    grRecord.query();
    while(grRecord.next()){
        aux++
    }
    if(aux >0)
    return number+' - '+aux;
    else
    return number
}