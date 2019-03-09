var current = new GlideRecord('u_travel_transportation')
current.get('7c30c9051b087740c691535c2e4bcbde')
var result = new GlideDateTime(validateDates('03/08/2019 16:25:00'));
gs.info(result.getNumericValue())
current.setValue('u_global_arrival_date',result.getNumericValue())
current.update();

gs.info(current.u_global_arrival_date.getGlideObject().getNumericValue())


function validateDates(date){
    var regExp = /^(\d{2})\/(\d{2})\/(\d{4})\s(.*)/.exec(date);
    return regExp[3]+'-'+regExp[1]+'-'+regExp[2]+' '+regExp[4];
}


/*BR query
Shecudeled notification(2)
Que notificaciones 2 mias 2 de Erick validar bien que show
Que Widget, 
GSOC admin para el flisghtstats properties

BR on update/insert alerta flight stats 
*/