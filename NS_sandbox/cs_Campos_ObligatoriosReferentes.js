/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define([
    'N/error',
    'N/record',
    'N/log'

], function(error, record, log) {

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;
        var fieldId = context.fieldId;

        if (fieldId === 'leadsource') {
            var leadSource = currentRecord.getValue({ fieldId: 'leadsource' });
            log.debug('leadsource value:', leadSource);

            if (leadSource == 'Referente' || leadSource == '-4') { 
                currentRecord.getField({ fieldId: 'custbody22' }).isMandatory = true; 
                currentRecord.getField({ fieldId: 'custbody23' }).isMandatory = true;
                currentRecord.getField({ fieldId: 'custbody_referente' }).isMandatory = true;

            } else {
                currentRecord.getField({ fieldId: 'custbody22' }).isMandatory = false; 
                currentRecord.getField({ fieldId: 'custbody23' }).isMandatory = false;
                currentRecord.getField({ fieldId: 'custbody_referente' }).isMandatory = false; 
            }
        }
    }

    function saveRecord(context) {
        var currentRecord = context.currentRecord;
        var leadSource = currentRecord.getValue({ fieldId: 'leadsource' });

        if (leadSource == 'Referente' || leadSource == '-4') { 

            var numeroReferente = currentRecord.getValue({ fieldId: 'custbody22' });
            var correoReferente = currentRecord.getValue({ fieldId: 'custbody23' });
            var referente = currentRecord.getValue({ fieldId: 'custbody_referente' });

            if (!numeroReferente || !correoReferente || !referente) {
                alert('Los campos "REFERENTE", "NÚMERO REFERENTE" y "CORREO REFERENTE" deben ser llenados cuando el Lead Source es "Referente".');
                return false;
            }
        }

        return true;
    }

    return {
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };

});