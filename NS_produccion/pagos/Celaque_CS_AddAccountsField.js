/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/ui/serverWidget'], function(serverWidget) {

    function beforeLoad(context) {

        if ( context.type === context.UserEventType.EDIT || context.type === context.UserEventType.CREATE) {
            // Create the field
            var form = context.form;
            
            var customField = form.addField({
                id: 'custpage_accounts',
                type: serverWidget.FieldType.SELECT,
                label: 'Accounts',
            });

            form.insertField({
                field : customField,
                nextfield : 'custbody_formapago'
            });
        }
    }

    //container: 'main'
    function beforeSubmit(context) {

        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
            
            var currentRecord = context.newRecord;
            var customDropdownValue = currentRecord.getValue({
                fieldId: 'custpage_accounts'
            });

            currentRecord.setValue({
                fieldId: 'account',
                value: customDropdownValue
            });
        }
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    };

});