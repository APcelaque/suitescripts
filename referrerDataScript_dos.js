/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define([
    'N/error',
    'N/record',
    'N/runtime'
], function(error, record, runtime) {
    'use strict';
    
    function saveRecord(context) {
        console.log('saveRecord triggered');
        return validateMandatoryFields(context.currentRecord);
    }

    function fieldChanged(context) {
        console.log('fieldChanged triggered for field: ' + context.fieldId);
        if (context.fieldId === 'leadsource') {
            validateMandatoryFields(context.currentRecord);
        }
    }

    function validateMandatoryFields(currentRecord) {
        var leadSource = currentRecord.getValue({
            fieldId: 'leadsource'
        });

        console.log('leadSource value: ' + leadSource);

        var referenteId = -4; 
        var mandatoryFields = [
            { id: 'custbody18', name: 'Número referente' },
            { id: 'custbody19', name: 'Correo referente' },
            { id: 'custbody_referente', name: 'Referente' }
        ];

        if (leadSource == referenteId) {  
            var allFieldsValid = true;
            for (var i = 0; i < mandatoryFields.length; i++) {
                var field = mandatoryFields[i];
                var fieldValue = currentRecord.getValue({ fieldId: field.id });
                console.log('Checking field: ' + field.id + ' value: ' + fieldValue);

                if (!fieldValue) {
                    alert('El campo ' + field.name + ' es obligatorio cuando el Lead Source es "Referente".');
                    allFieldsValid = false;
                }
            }
            if (!allFieldsValid) {
                return false;  
            }
        }

        return true;
    }

    return {
        saveRecord: saveRecord,
        fieldChanged: fieldChanged
    };
});
