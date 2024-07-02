/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/log'], function(record, search, log) {

    function pageInit(context) {
        var currentRecord = context.currentRecord;
        try {
            // Actualizar el campo accountField
            updateAccountField(currentRecord);

            // Seleccionar cuenta
            var selectCuenta = currentRecord.getValue({ fieldId: 'account' });
            log.debug('Selected Account', selectCuenta);

            currentRecord.setValue({ fieldId: 'custpage_accounts', value: selectCuenta });
        } catch (e) {
            log.error({
                title: 'Error en pageInit',
                details: e.toString()
            });
        }
    }

    function fieldChanged(context) {
        if (context.fieldId === 'currency' || context.fieldId === 'custbody_accountcurr') {
            setTimeout(function() {
                try {
                    updateAccountField(context.currentRecord);
                } catch (e) {
                    log.error({
                        title: 'Error en fieldChanged',
                        details: e.toString()
                    });
                }
            }, 500);
        }
    }

    function updateAccountField(currentRecord) {
        try {
            var selectedCurrency = currentRecord.getValue({ fieldId: 'custbody_accountcurr' });
            log.debug('Selected Currency', selectedCurrency);

            var accountOptions = getAvailableAccounts(selectedCurrency);
            log.debug('Account Options', accountOptions);

            var accountField = currentRecord.getField({ fieldId: 'custpage_accounts' });

            // Verificar si el campo existe y es manipulable
            if (accountField && typeof accountField.removeSelectOption === 'function') {
                // Limpiar opciones previas
                accountField.removeSelectOption({ value: null });

                accountOptions.forEach(function(account) {
                    accountField.insertSelectOption({
                        value: account.value,
                        text: account.text
                    });
                });

                // Seleccionar la cuenta actual si está en la lista de opciones
                var selectCuenta = currentRecord.getValue({ fieldId: 'account' });
                if (selectCuenta) {
                    currentRecord.setValue({ fieldId: 'custpage_accounts', value: selectCuenta });
                }
            } else {
                log.error({
                    title: 'Error en updateAccountField',
                    details: 'accountField no es manipulable o no existe'
                });
            }
        } catch (e) {
            log.error({
                title: 'Error en updateAccountField',
                details: e.toString()
            });
        }
    }

    function getAvailableAccounts(selectedCurrency) {
        var results = [];
        try {
            if (!selectedCurrency) {
                throw new Error('selectedCurrency está vacío o es nulo');
            }
            var accountSearchObj = search.create({
                type: "account",
                filters: [
                    ["custrecord_currency", "is", selectedCurrency]
                ],
                columns: [
                    search.createColumn({ name: "internalid", label: "Internal ID" }),
                    search.createColumn({ name: "name", sort: search.Sort.ASC, label: "Name" })
                ]
            });

            accountSearchObj.run().each(function(result) {
                results.push({
                    value: result.getValue({ name: "internalid" }),
                    text: result.getValue({ name: "name" })
                });
                return true;
            });

        } catch (e) {
            log.error({
                title: 'Error en getAvailableAccounts',
                details: e.toString()
            });
        }
        return results;
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    };
});
