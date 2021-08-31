function Resgates() {
    this.dadosPaciente = function(data) {
        var obj = {
            nome: data,
        }
          var GetPaciente = new Promessa("GetDadosPaciente", {obj : JSON.stringify(obj)})//requimento da promessa/ se tiver algum parametro passar dentro de chaves
          GetPaciente.then(function(dados){//retorno da promessa
            if(dados["situacao"] == "sucesso"){//se retornar sucesso é porque deu certo
              listaPaciente(dados.obj);//se der certo chama o metodo de lista passando a lista
            }else{// se não printa uma mensagem na tela
                Toast(dados["msg"]);
            }
          });    
    }
    this.getAtividades = function(data) {
        var obj = {
            idusuario: data
          }
        var GetAtividades = new Promessa("GetAtividades", {obj : JSON.stringify(obj)});
        GetAtividades.then(function(dados) {
            if(dados.situacao == "sucesso"){
                /* if(data != undefined){
                    for(var i in dados.transferencias){
                        if(dados.transferencias[i ].idtransferencia == data.idtransferencia){
                            detalhaTed(dados.transferencias[i]);
                            
                        }
                    }
                } */
                $(".menu .menu-inner .menu-item .menu-item-content").removeClass('active-menu');
                $('#menuTed').find(".menu-item-content").addClass('active-menu');
                listaAtividades(dados.obj);
            }else{
                Toast(dados.msg)
            }
        }, function(e) { console.log(e); });
    }
    this.getBatimentos = function(datainicial, datafinal) {
        var obj = {
            dtinicial: datainicial,
            dtfinal : datafinal
        }
        var GetBatimentos = new Promessa("GetBatimentos", {obj : JSON.stringify(obj)});
        GetBatimentos.then(function(dados) {
            if(dados.situacao == "sucesso"){
                /* if(data != undefined){
                    for(var i in dados.transferencias){
                        if(dados.transferencias[i ].idtransferencia == data.idtransferencia){
                            detalhaTed(dados.transferencias[i]);
                            
                        }
                    }
                } */
                $(".menu .menu-inner .menu-item .menu-item-content").removeClass('active-menu');
                $('#menuTed').find(".menu-item-content").addClass('active-menu');
                listaBatimentos(dados.obj);
            }else{
                Toast(dados.msg)
            }
        }, function(e) { console.log(e); });
    }
    this.getResgates = function() {
        var GetSolicitacaoResgates = new Promessa("GetResgatesTotal");
        GetSolicitacaoResgates.then(function(dados) {
            if(dados.situacao == "sucesso"){
                /* if(data != undefined){
                    for(var i in dados.transferencias){
                        if(dados.transferencias[i ].idtransferencia == data.idtransferencia){
                            detalhaTed(dados.transferencias[i]);
                            
                        }
                    }
                } */
                $(".menu .menu-inner .menu-item .menu-item-content").removeClass('active-menu');
                $('#menuTed').find(".menu-item-content").addClass('active-menu');
                listaSolicitacaoResgates(dados.obj);
            }else{
                Toast(dados.msg)
            }
        }, function(e) { console.log(e); });
    }
    this.getCupons = function(data) {
        var obj = {
            idresgate: data
          }
        var GetSolicitacaoCupons = new Promessa("GetDetCupom", {obj : JSON.stringify(obj)});
        GetSolicitacaoCupons.then(function(dados) {
            if(dados.situacao == "sucesso"){
                /* if(data != undefined){
                    for(var i in dados.transferencias){
                        if(dados.transferencias[i ].idtransferencia == data.idtransferencia){
                            detalhaTed(dados.transferencias[i]);
                            
                        }
                    }
                } */
                $(".menu .menu-inner .menu-item .menu-item-content").removeClass('active-menu');
                $('#menuTed').find(".menu-item-content").addClass('active-menu');
                detalhaCupom(dados.obj);
            }else{
                Toast(dados.msg)
            }
        }, function(e) { console.log(e); });
    }
    this.getTransferencias = function(data) {
        var obj = {
            idresgate: data
          }
        var GetSolicitacaoResgates = new Promessa("GetDetTransferencia", {obj : JSON.stringify(obj)});
        GetSolicitacaoResgates.then(function(dados) {
            if(dados.situacao == "sucesso"){
                /* if(data != undefined){
                    for(var i in dados.transferencias){
                        if(dados.transferencias[i ].idtransferencia == data.idtransferencia){
                            detalhaTed(dados.transferencias[i]);
                            
                        }
                    }
                } */
                $(".menu .menu-inner .menu-item .menu-item-content").removeClass('active-menu');
                $('#menuTed').find(".menu-item-content").addClass('active-menu');
                detalhaTed(dados.obj);
            }else{
                Toast(dados.msg)
            }
        }, function(e) { console.log(e); });
    }
    this.aprovados = function(data) {
        cod = ""
        cod = $('#codigo').val()
        var obj = {
            idresgate: data,
            data_final : dtfinal,
            codigo: $('#codigo').val()
        }

        if (cod != "" && index == 1) {
            var Aprovados = new Promessa("UpdateConcluido", {obj : JSON.stringify(obj)});
            Aprovados.then(function(dados) {
                if(dados.situacao == "sucesso"){
                    /* if(data != undefined){
                        for(var i in dados.transferencias){
                            if(dados.transferencias[i ].idtransferencia == data.idtransferencia){
                                detalhaTed(dados.transferencias[i]);
                                
                            }
                        }
                    } */
                    
                    Resgates.updatecodigo(data)
                    
                    
                    
                }else{
                    Toast(dados.msg)
                }
            }, function(e) { console.log(e); });
        } else if (index == 2) {
            var Aprovados = new Promessa("UpdateConcluido", {obj : JSON.stringify(obj)});
            Aprovados.then(function(dados) {
                if(dados.situacao == "sucesso"){
                    /* if(data != undefined){
                        for(var i in dados.transferencias){
                            if(dados.transferencias[i ].idtransferencia == data.idtransferencia){
                                detalhaTed(dados.transferencias[i]);
                                
                            }
                        }
                    } */
                    
                    Resgates.updatetransferencia(data)
                    
                    
                    
                }else{
                    Toast(dados.msg)
                }
            }, function(e) { console.log(e); });
        } else {Toast('Você precisa digitar o código.')}
        
    }
    this.updatecodigo = function(data) {
        var obj = {
            idresgate: data,
            codigo: cod,
            data_final : dtfinalizacao
        }
        var Aprovadosup = new Promessa("UpdateCodigo", {obj : JSON.stringify(obj)});
        Aprovadosup.then(function(dados) {
            if(dados.situacao == "sucesso"){
                /* if(data != undefined){
                    for(var i in dados.transferencias){
                        if(dados.transferencias[i ].idtransferencia == data.idtransferencia){
                            detalhaTed(dados.transferencias[i]);
                            
                        }
                    }
                } */
                Resgates.getResgates();
                myApp.popup.close();
                if (transfOuCupom == "Cupom") {
                    Toast('Cupom validado com sucesso.')
                } else if (transfOuCupom == "Ted") {
                    Toast('Ted concluída com sucesso.')
                } else {
                    Toast('Pix concluído com sucesso.')    
                }
                
            }else{
                Toast(dados.msg)
            }
        }, function(e) { console.log(e); });
    }
    this.updatetransferencia = function(data) {
        var obj = {
            idresgate: data,
            data_final : dtfinalizacao
        }
        var Aprovadosupt = new Promessa("UpdateTransferencia", {obj : JSON.stringify(obj)});
        Aprovadosupt.then(function(dados) {
            if(dados.situacao == "sucesso"){
                /* if(data != undefined){
                    for(var i in dados.transferencias){
                        if(dados.transferencias[i ].idtransferencia == data.idtransferencia){
                            detalhaTed(dados.transferencias[i]);
                            
                        }
                    }
                } */
                Resgates.getResgates();
                myApp.popup.close();
                if (transfOuCupom == "Cupom") {
                    Toast('Cupom validado com sucesso.')
                } else if (transfOuCupom == "Ted") {
                    Toast('Ted concluída com sucesso.')
                } else {
                    Toast('Pix concluído com sucesso.')    
                }
                
            }else{
                Toast(dados.msg)
            }
        }, function(e) { console.log(e); });
    }
}
