sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";

	return Controller.extend("br.com.idxtecCentroCusto.controller.CentroCusto", {
		onInit: function(){
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		onRefresh: function(){
			var oModel = this.getOwnerComponent().getModel();
			oModel.refresh(true);
			this.getView().byId("tableCentroCusto").clearSelection();
		},
		
		onIncluirCentro: function(){
			var oDialog = this._criarDialog();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Inserir Novo Centro de Custo",
				msgSalvar: "Centro de custo inserido com sucesso!"
			});
			
			oDialog.unbindElement();
			oDialog.setEscapeHandler(function(oPromise){
				if(oModel.hasPendingChanges()){
					oModel.resetChanges();
				}
			});
			
			var oContext = oModel.createEntry("/CentroCustos", {
				properties: {
					"Id": 0,
					"Codigo": "",
					"Descricao": ""
				}
			});
			
			oDialog.setBindingContext(oContext);
			oDialog.open();
		},
		
		onEditarCentro: function(){
			var oDialog = this._criarDialog();
			var oTable = this.byId("tableCentroCusto");
			var nIndex = oTable.getSelectedIndex();
			var oViewModel = this.getModel("view");
			
			oViewModel.setData({
				titulo: "Editar Centro de Custo",
				msgSalvar: "Centro de custo alterado com sucesso!"
			});
			
			if(nIndex === -1){
				MessageBox.warning("Selecione um Centro de Custo da tabela!");
				return;
			}
			
			var oContext = oTable.getContextByIndex(nIndex);
			
			oDialog.bindElement(oContext.sPath);
			oDialog.open();
		},
		
		onRemoverCentro: function(){
			var that = this;
			var oTable = this.byId("tableCentroCusto");
			var nIndex = oTable.getSelectedIndex();
			
			if(nIndex === -1){
				MessageBox.warning("Selecione um Centro de Custo da tabela!");
				return;
			}
			
			MessageBox.confirm("Deseja realmente remover esse Centro de Custo?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						that._remover(oTable, nIndex);
						MessageBox.success("Centro de custo removido com sucesso!");
					}
				} 
			});
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath, {
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				},
				error: function(oError){
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		onSaveDialog: function(){
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getModel("view");
			
			if(this._checarCampos(this.getView()) === true){
				MessageBox.warning("Preencha todos os campos obrigatórios!");
				return;
			} else{
				oModel.submitChanges({
				success: function(){
					oModel.refresh(true);
					MessageBox.success(oViewModel.getData().msgSalvar);
					oView.byId("CentroCustoDialog").close();
					oView.byId("tableCentroCusto").clearSelection();
				},
				error: function(oError){
					MessageBox.error(oError.responseText);
				}
			});	
			}
		},
		
		onCloseDialog: function(){
			var oModel = this.getOwnerComponent().getModel();
			
			if(oModel.hasPendingChanges()){
				oModel.resetChanges();
			}
			
			this.byId("CentroCustoDialog").close();
		},
		
		_criarDialog: function(){
			var oView = this.getView();
			var oDialog = this.byId("CentroCustoDialog");
			
			if(!oDialog){
				oDialog = sap.ui.xmlfragment(oView.getId(), "br.com.idxtecCentroCusto.view.CentroCustoDialog", this);
				oView.addDependent(oDialog);
			}
			
			return oDialog;
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("descricao").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		},
		
		getModel: function(sModel) {
			return this.getOwnerComponent().getModel(sModel);
		}
	});
});