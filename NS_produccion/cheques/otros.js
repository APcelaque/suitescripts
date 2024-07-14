/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define([], function() {
    function pageInit(context) {
        var record = context.currentRecord;
        var mode = context.mode; 
  
          // Obten el campo que deseas mostrar/ocultar
        var accountField = record.getField({
            fieldId: 'account' // Reemplaza 'account' con el ID real del campo
        });
        var accountnew = record.getField({
        fieldId: 'custpage_accounts'
        });

        if (mode === 'create' || mode === 'edit') {
            // Ocultar el campo en modos de edición o creación
            accountField.isDisplay = false;
            accountnew.isDisplay = true;
        } else if (mode === 'view') {
            // Mostrar el campo en modo de vista
            accountField.isDisplay = true;
            accountnew.isDisplay = false;
        }
      }
      function fieldChanged(context) {
          var currentRecord = context.currentRecord;
          var fieldName = context.fieldId;
          var ejemplo = currentRecord.getValue({fieldId: 'custbody_formapago'});
          
  //custbody_formapago === '2'
        if (ejemplo === '2') {
          if(fieldName === 'custbody_nomenclatura_cuenta') {
              var tranid = currentRecord.getValue({fieldId: 'custbody_nomenclatura_cuenta'});
              var accountID = mapTranidToAccount(tranid);
  
            //  alert("Mapped Account ID: " + accountID);
              console.log('accountID', accountID);
              if(accountID != null){
               currentRecord.setValue({fieldId: 'custpage_accounts', value:accountID }); 
              }
              if(accountID != null){
                currentRecord.setValue({fieldId: 'account', value: accountID});
              }
          
          }
        }
  
      }
  
      function mapTranidToAccount(tranid) {
          var accountMapping = {
              "ARG":"32797",
              "ATL":"32798",
              "AF28": "336",
              "AG98": "1819",
              "AG99": "1819",
              'AC03': "336",
              "ADJ3": "337",
              'AHC2': "557",
              'AHC3': "557",
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
              "BPN":"33432",
              "AKE9":"599"
          };
  
          var naming = extractNaming(tranid);
          return accountMapping[naming] || 'No account ID found';
      }
  
      function extractNaming(tranid) {
         // var pattern = /^(AKE9|BPN|ARG|ATL|AF28|AC03|ADJ3|AHC2|AHC3|AF04|AF05|DAP4|DASP|AHB8|AHB9|AGQ7|AGQ8|OCCI|ASI|ASID|AHC0|AHC1|CIP|CIPD|CIPP|AISA|ALH1|ALH6|AK68|AK69|AK70|ALH2|ALH5|ALH4|ALH3|ATLP|LIR)/;
          //var pattern2 = /^(ARG|ATL|AF28|AG98|AG99|AC03|ADJ3|AHC2|AHC3|AF04|AF05|DAP4|DASP|AHB8|AHB9|AGQ7|AGQ8|OCCI|ASI|ASID|AHC0|AHC1|CIP|CIPD|CIPP|AISA|ALH1|ALH6|AK68|AK69|AK70|ALH2|ALH3|ALH4|ALH5|ATLP|LIR|BPN|AKE9)/;
          var pattner3 = /^(ARG|ATL|AF28|AG98|AG99|AC03|ADJ3|AHC2|AHC3|AF04|AF05|DAP4|DASP|AHB8|AHB9|AGQ7|AGQ8|OCCI|ASI|DASI|AHC0|AHC1|CIP|CIPD|DCIP|AISA|ALH1|ALH6|AK68|AK69|AK70|ALH2|ALH3|ALH4|ALH5|ATLP|LIR|BPN|AKE9)/
          var match = tranid.match(pattner3);
          console.log('Extracted Naming:', match ? match[0] : 'No match found');
          return match ? match[0] : null;
      }
      
      return {
          fieldChanged: fieldChanged,
          pageInit : pageInit
      };
  });
  



/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'], function(record, search) {

  function pageInit(context) {
      var currentRecord  =context.currentRecord;
      updateAccountField(context.currentRecord);
      //Select cuenta 
      var selectCuenta = currentRecord.getValue({
          fieldId: 'account'
      });
    log.debug(selectCuenta);
      currentRecord.setValue({fieldId: 'custpage_accounts', value:selectCuenta });
      
  }

  function fieldChanged(context) {
      if (context.fieldId === 'currency') { 
          setTimeout(function() {
              updateAccountField(context.currentRecord);
          }, 500); 
      }
  }

  function updateAccountField(currentRecord) {
      var selectedCurrency = currentRecord.getValue({
          fieldId: 'custbody_accountcurr'
      });

      var accountOptions = getAvailableAccounts(selectedCurrency);
      console.log('accountOptions', accountOptions);

      var accountField = currentRecord.getField({
          fieldId: 'custpage_accounts'
      });

      accountField.removeSelectOption({ value: null }); 

      accountOptions.forEach(function(account) {
          accountField.insertSelectOption({
              value: account.value,
              text: account.text
          });
      });
  }

  function getAvailableAccounts(selectedCurrency) {
      var results = [];
      var accountSearchObj = search.create({
          type: "account",
          filters: [
              ["custrecord_currency", "is", selectedCurrency]
          ],
          columns: [
              search.createColumn({name: "internalid", label: "Internal ID"}),
              search.createColumn({name: "name", sort: search.Sort.ASC, label: "Name"})
          ]
      });

      accountSearchObj.run().each(function(result){
          results.push({
              value: result.getValue({name: "internalid"}),
              text: result.getValue({name: "name"})
          });
          return true;
      });
      return results;
  }

  return {
      pageInit: pageInit,
      fieldChanged: fieldChanged
  };
});
