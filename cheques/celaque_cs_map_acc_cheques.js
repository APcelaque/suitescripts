/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

// customscript_celaque_cs_mapaccounts cheques 

define(['N/log'], function(log) {

    function pageInit(context) {
        var record = context.currentRecord;
        var mode = context.mode;

        try {
            var accountField = record.getField({ fieldId: 'account' });
            var accountNewField = record.getField({ fieldId: 'custpage_accounts' });

            if (mode === 'create' || mode === 'edit') {
                accountField.isDisplay = false;
                accountNewField.isDisplay = true;
            } else if (mode === 'view') {
                accountField.isDisplay = true;
                accountNewField.isDisplay = false;
            }
        } catch (e) {
            log.error({
                title: 'Error en pageInit',
                details: e
            });
        }
    }

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;
        var fieldName = context.fieldId;
        try {
            var formaPago = currentRecord.getValue({ fieldId: 'custbody_formapago' });

            if (formaPago === '2' && fieldName === 'custbody16') {
                var tranid = currentRecord.getValue({ fieldId: 'custbody16' });
                var accountID = mapTranidToAccount(tranid);

                if (accountID) {
                    currentRecord.setValue({ fieldId: 'custpage_accounts', value: accountID });
                    currentRecord.setValue({ fieldId: 'account', value: accountID });
                }
            }
        } catch (e) {
            log.error({
                title: 'Error en fieldChanged',
                details: e
            });
        }
    }

    function mapTranidToAccount(tranid) {
        var accountMapping = {
            "ARG": "32797",
            "ATL": "32798",
            "AF28": "336",
            "AG98": "1819",
            "AG99": "1819",
            "AC03": "336",
            "ADJ3": "337",
            "AHC2": "557",
            "AHC3": "557",
            "AF04": "598",
            "AF05": "598",
            "DAP4": "598",
            "DASP": "598",
            "AHB8": "605",
            "AHB9": "605",
            "AGQ7": "629",
            "AGQ8": "629",
            "OCCI": "640",
            "ASI": "641",
            "DASI": "1186",
            "AHC0": "1816",
            "AHC1": "1816",
            "CIP": "1858",
            "DCIP": "1859",
            "CIPP": "1858",
            "AISA": "31989",
            "ALH1": "31991",
            "ALH6": "31991",
            "AK68": "31995",
            "AK69": "31993",
            "AK70": "31991",
            "ALH2": "31993",
            "ALH3": "31995",
            "ALH4": "31993",
            "ALH5": "31995",
            "ATLP": "32798",
            "LIR": "32908",
            "BPN": "33432",
            "AKE9": "599"
        };

        var naming = extractNaming(tranid);
        return accountMapping[naming] || null;
    }

    function extractNaming(tranid) {
        var pattern = /^(ARG|ATL|AF28|AG98|AG99|AC03|ADJ3|AHC2|AHC3|AF04|AF05|DAP4|DASP|AHB8|AHB9|AGQ7|AGQ8|OCCI|ASI|DASI|AHC0|AHC1|CIP|DCIP|CIPP|AISA|ALH1|ALH6|AK68|AK69|AK70|ALH2|ALH3|ALH4|ALH5|ATLP|LIR|BPN|AKE9)/;
        var match = tranid.match(pattern);
        log.debug('Extracted Naming:', match ? match[0] : 'No match found');
        return match ? match[0] : null;
    }

    return {
        fieldChanged: fieldChanged,
        pageInit: pageInit
    };
});