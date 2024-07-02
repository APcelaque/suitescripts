/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/ui/serverWidget', 'N/log'], function(record, serverWidget, log) {

    function beforeLoad(context) {
        if (context.type !== context.UserEventType.CREATE && context.type !== context.UserEventType.EDIT) {
            return;
        }

        var form = context.form;
        var newRecord = context.newRecord;

        var accountId = newRecord.getValue({fieldId: 'account'});

        var boolMandatorio = false;

        switch (accountId) {
            case '506':  
                boolMandatorio = true;
                break;
            case '33850': 
                boolMandatorio = true;
                break;
            case '549': 
                boolMandatorio = true;
                break;
            case '33849':
                boolMandatorio = true;
                break;
            default:
                boolMandatorio = false;
                break;
        }

        form.getField({id: 'custbody_relacionada_deposito'}).isMandatory = boolMandatorio;
    }

    function beforeSubmit(context) {
        var newRecord = context.newRecord;
        var accountId = newRecord.getValue({fieldId: 'account'});
        var boolMandatorio = ['506', '33850', '549', '33849'].indexOf(accountId) > -1;


        var relatedDeposit = newRecord.getValue({fieldId: 'custbody_relacionada_deposito'});
        if (boolMandatorio && !relatedDeposit) {
            throw new Error('Campo relacionada es obligatorio.');
        }
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    };
});
