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

    // Se mapean las id y la nomenclarura de las cuentas correspondientes

    var accountMapping = {
        "AC03": "334",
        "AF28": "334",
        "ADJ3": "337",
        "AHC2": "557",
        "AHC3": "557",
        "AF04": "598",
        "AF05": "598",
        "DASP": "598",
        "DAP4": "598",
        "AKE9": "599",
        "AHB8": "605",
        "AHB9": "605",
        "AGQ7": "629",
        "AGQ8": "629",
        "OCCI": "640",
        "ASI": "641",
        "DASI": "1186",
        "DOCCI": "1810",
        "AHC0": "1816",
        "AHC1": "1816",
        "AG99": "1819",
        "AG98": "1819",
        "CIP": "1858",
        "CIPP": "1858",
        "DCIP": "1859",
        "AISA": "31989",
        "ALH1": "31991",
        "ALH6": "31991",
        "AK68": "31991",
        "AK69": "31991",
        "AK70": "31991",
        "ALH4": "31993",
        "ALH5": "31995",
        "ARG": "32797",
        "ATL": "32798",
        "ATLP": "32798",
        "LIR": "32908",
        "LIRP": "32908",
        "BPN": "33432",
        "DATL": "33853"
    };

    function pageInit(context) {
        var currentRecord = context.currentRecord;
        logAccountOptions(currentRecord);
        updateAccountField(currentRecord);
    }

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;
        
        if (context.fieldId === 'custbody_nomenclatura_cuenta') { 
            updateAccountField(currentRecord);
        }
    }

    function updateAccountField(currentRecord) {
        try {
            var nomenclatura = currentRecord.getValue({ fieldId: 'custbody_nomenclatura_cuenta' });
            var accountId = accountMapping[nomenclatura];

            if (accountId) {
                currentRecord.setValue({ fieldId: 'account', value: accountId });
                log.debug('Account actualizada', 'Nomenclatura: ' + nomenclatura + ', Account ID: ' + accountId);

            } else {
                log.debug('Nomenclatura no encontrada en el mapeo', 'Nomenclatura: ' + nomenclatura);
            }

        } catch (error) {
            log.error({
                title: 'Error en updateAccountField',
                details: error.toString()
            });
        }
    }

    function logAccountOptions(currentRecord) {
        
        try {
            var accountField = currentRecord.getField({
                fieldId: 'account'
            });

            var options = accountField.getSelectOptions();
            var optionsArray = [];

            options.forEach(function(option) {
                optionsArray.push({
                    ID: option.value, 
                    Cuenta: option.text 
                });
            });

            var optionsJSON = JSON.stringify(optionsArray, null, 2);

            console.log('Account Options:', optionsJSON);

            log.debug('Account Options JSON', optionsJSON);

        } catch (error) {
            log.error({
                title: 'Error en logAccountOptions',
                details: error.toString()
            });
        }
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    };

});