// This code was to be able to put choises but it seems that the table field are kind of buggy need to reviw that 27/11/2018
var items =[
    {label:'On Hold', value: 11, secuence: 7},
    {label:'Released', value: 12, secuence: 8},
    {label:'Scoping', value: -4, secuence: 1},
    {label:'Testing/QA', value: 8, secuence: 10},
    {label:'UAT Fail', value: 99, secuence: 2}
]
addTodictionary(items,'d42f88194fa2a640ab9aafdd0210c78b')

function addTodictionary(items,table){
    items.map(function(item){
        var grDictionary = new GlideRecord('sys_choice');
        //grDictionary.newRecord();
        grDictionary.setValue('label',item.label);
        grDictionary.setValue('language','en');
        grDictionary.setValue('sequence',item.secuence);
        grDictionary.setValue('table',table);
        grDictionary.setValue('element','state')
        grDictionary.setValue('value',item.value);
        //grDictionary.insert();
        gs.info(grDictionary.table+" Has been incerted");
    })
}
