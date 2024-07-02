/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

// C - Campos obligatorios referentes
// Cuando Lead Source es 'Referente', los campos relacionados con el origen de la venta.

define([
    'N/error',
    'N/record',
    'N/runtime',
    'N/log'

], function(error, record, runtime, log) {
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
        log.debug('leadSource value: ' + leadSource);

        var referenteId = "-4";

        var mandatoryFields = [
            {id: 'custbody18', name: 'Número referente'},
            {id: 'custbody19', name: 'Correo referente'},
            {id: 'custbody_referente', name: 'Referente'}
        ];

        if (leadSource === referenteId) {
            var allFieldsValid = true;

            for (var i = 0; i < mandatoryFields.length; i++) {
                var field = mandatoryFields[i];
                var fieldValue = currentRecord.getValue({ fieldId: field.id });
                console.log('Checking field: ' + field.id + ' value: ' + fieldValue);
                log.debug('Checking field:', { id: field.id, value: fieldValue });

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

    function pageInit(context) {
        console.log('pageInit triggered');
        log.debug('pageInit triggered');
        var leadSourceField = document.getElementById('inpt_leadsource25');
        if (leadSourceField) {
            console.log('leadsource field found: ' + leadSourceField.value);
            log.debug('leadsource field found:', leadSourceField.value);
        } else {
            console.log('leadsource field not found');
            log.debug('leadsource field not found');
        }
    }

    return {
        saveRecord: saveRecord,
        fieldChanged: fieldChanged
    };
});
