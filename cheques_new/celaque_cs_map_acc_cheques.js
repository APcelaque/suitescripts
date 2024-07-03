/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define([
    'N/record',
    'N/search',
    'N/log'
], function(record, search, log) {
    'use strict';

    function pageInit(context) {
        var currentRecord = context.currentRecord;
        logAccountValues(currentRecord);
    }

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;
        if (context.fieldId === 'custbody16') {
            logAccountValues(currentRecord);
        }
    }

    function logAccountValues(currentRecord) {
        try {
            var accountId = currentRecord.getValue({ fieldId: 'account' });
            var accountText = currentRecord.getText({ fieldId: 'account' });

            console.log('Account ID: ' + accountId);
            console.log('Account Text: ' + accountText);

        } catch (error) {
            log.error({
                title: 'Error en logAccountValues',
                details: error
            });
        }
    }
    
});