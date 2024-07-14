/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log'], function(log) {
    function pageInit(context) {
        var currentRecord = context.currentRecord;
        var fieldId = 'account'; 

        try {
            var accountField = currentRecord.getField({ fieldId: fieldId });
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
            console.log('Error al obtener opciones del campo account', error.toString());
            log.error('Error al obtener opciones del campo account', error.toString());
        }
    }

    return {
        pageInit: pageInit
    };
});
