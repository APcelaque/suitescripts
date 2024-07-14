/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
*/

// UE - Campos Obligatorios Referentes
// Cuando Lead Source es 'Referente', los campos relacionados con el origen de la venta.

define([
    'N/record',
    'N/ui/serverWidget', 
    'N/log'

], function(record, serverWidget, log) {

    function beforeLoad(context) {
        if (context.type !== context.UserEventType.CREATE && context.type !== context.UserEventType.EDIT) {
            return;
        }

        var form = context.form;
        var newRecord = context.newRecord;

        var leadSource = newRecord.getValue({ fieldId: 'leadsource' });
        log.debug('Valor de leadsource en beforeLoad:', leadSource);

        if (leadSource == 'Referente' || leadSource == '-4') {
            form.getField({ id: 'custbody22' }).isMandatory = true; 
            form.getField({ id: 'custbody23' }).isMandatory = true; 
            form.getField({ id: 'custbody_referente' }).isMandatory = true; 
        }
    }

    function beforeSubmit(context) {
        
        var newRecord = context.newRecord;
        var leadSource = newRecord.getValue({ fieldId: 'leadsource' });

        log.debug('Valor de leadsource en beforeSubmit:', leadSource);

        if (leadSource == 'Referente' || leadSource == '-4') { 

            var numeroReferente = newRecord.getValue({ fieldId: 'custbody22' });
            var correoReferente = newRecord.getValue({ fieldId: 'custbody23' });
            var referente = newRecord.getValue({ fieldId: 'custbody_referente' });

            if (!numeroReferente || !correoReferente || !referente) {
        
                log.error({
                    title: 'Validación de campos obligatorios',
                    details: 'Todos los campos obligatorios deben ser llenados cuando el Lead Source es "Referente".'
                });

                throw new Error('Todos los campos obligatorios deben ser llenados cuando el Lead Source es "Referente".');
            }
        }
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    };

});
