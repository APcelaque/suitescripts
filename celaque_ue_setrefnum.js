/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

define(['N/record', 'N/log'], function(record, log) {

    function beforeSubmit(context) {
        var rec = context.newRecord;

        var lineCount = rec.getLineCount({
            sublistId: 'apply'
        });

        for (var i = 0; i < lineCount; i++) {
            var refNum = rec.getSublistValue({
                sublistId: 'apply',
                fieldId: 'refnum', 
                line: i
            });

            if (refNum) {
                log.debug('RefNum Found', 'RefNum on line ' + (i + 1) + ' is: ' + refNum);

                rec.setValue({
                    fieldId: 'tranid',
                    value: refNum
                });

                break;
            }
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };

});