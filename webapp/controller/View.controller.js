sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/ValueState",
    'sap/ui/model/json/JSONModel',
    '@apollogic/ui5-validator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ValueState, JSONModel, Validator) {
        "use strict";

        const aControlsNames = ["sap.m.Input", "sap.m.DatePicker", "sap.m.ComboBox"]

        let oValidator = {
            aInputs: [],
            onLiveChange: () => { }
        }

        return Controller.extend("validatorsandbox.controller.View", {
            onInit: function () {
                // set explored app's demo model on this sample
                var oModel = new JSONModel();
                const oView = this.getView();
                oModel.loadData("https://sapui5.hana.ondemand.com/test-resources/sap/ui/documentation/sdk/products.json");
                oView.setModel(oModel, "oDataModel");
                var oModel2 = new JSONModel({
                    property: "123",
                    Name: "",
                    radioButton: null
                });
                oView.setModel(oModel2, "viewModel");
            },

            // onAfterRendering: function () {
            //     const oView = this.getView();
            //     oValidator.aInputs = this.getInputsRecursively(oView);
            //     oValidator.aInputs.forEach((oInput) => {
            //         if (oInput.getRequired()) {
            //             oInput.attachLiveChange((event) => {
            //                 const value = oInput.getValue();
            //                 oInput.setValueState(value ? ValueState.None : ValueState.Error);
            //             })
            //         }
            //     });
            // },

            onValidatePress: function () {
                const oView = this.getView();
                const validationErrors = Validator.validate(oView);

                // single control check
                // const control = oView.byId("checkboxId");
                // const validationError = Validator.validateControl(control);
                
                console.log(validationErrors);
            },

            onLiveChangeTest: function () {
                console.log("live change test1 fired");
            },

            onLiveChangeTest2: function () {
                console.log("live change test2 fired");
            },

            getInputsRecursively(oObject) {
                let aInputs = [];
                let oAggregations = oObject.mAggregations;
                oAggregations ??= {};
                const aAggregationsKeys = Object.keys(oAggregations);

                const flattenedAggregations = [];
                //flatten aggregations to list of objects
                aAggregationsKeys.forEach((key) => {
                    let currentAggregation = oAggregations[key];
                    flattenedAggregations.push(...(Array.isArray(currentAggregation) ? currentAggregation : currentAggregation ? [currentAggregation] : []));
                });

                flattenedAggregations.forEach((aggregation) => {
                    if (aggregation.getMetadata && aControlsNames.indexOf(aggregation.getMetadata().getName()) >= 0) {
                        aInputs.push(aggregation)
                    } else {
                        aInputs.push(...this.getInputsRecursively(aggregation));
                    }
                })

                return aInputs;
            }
        });
    });
