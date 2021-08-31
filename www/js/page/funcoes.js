/*-------------------------------------------------------------------------------------------------------------------*/
/*                                            Principal                                                              */
/*-------------------------------------------------------------------------------------------------------------------*/
function Promessa(tela, parametros, load) { // Faz a comunicação com o servidor

    if (!navigator.onLine) {
        Toast("Você está sem internet, verifique a conexão e tente novamente");
        myApp.preloader.show();
      }
    
      if (load == undefined)
        myApp.preloader.show(); if (!parametros)
        parametros = {};
    
      // parametros["idpessoa"] = jQuery.isEmptyObject(Usuario_Dados.listar()) ? 0: Usuario_Dados.listar()["pessoa"]["idpessoa"];
    
      return Promise.resolve(
        jQuery.ajax({
          type: "POST",
          dataType: "json",
          data: parametros,
          url: myApp["data"]["banco"] + "projetoTc?metodo=" + tela
        })
      ).finally(function () {
        //LoadNuclick.close();
        myApp.preloader.hide();
      });
}

function Formulario() {
    this.getValores = function (form) { //pega os valores digitados
        var data = {};
        form.find("[name]").each(function (index) {
            var campo = $(this).attr("placeholder");
            var required = $(this).attr("required");
            var name = $(this).attr("name");
            var type = $(this).attr("type");
            var value = $(this).val();
            var objeto = name.split('.');

            if (!value && required) {
                data = {};
                Toast("Campo " + campo + " é Obrigatório");
                $(this).focus();
                return false;
            }

            if (type == "checkbox") {
                value = $(this).is(":checked");

            }
            if (type == "email" && required) {
                var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                if (!$.trim(value).match(pattern)) {
                    data = {};
                    Toast(campo + ' Inválido');
                    $(this).focus().select();
                    return false;
                }
            }

            if (type == "textarea" && !value)
                value = value.replace(/\n/g, ' ').trim();

            if (type == "password" && required && value) {
                if (value.length == 32) {
                    value = value
                } else {
                    value = md5("*" + value + "upvendas");

                }
            }

            /*   if(campo == "Usuário" && required){
                var pattern = /^(?=.{3,30}$)[a-zA-Z][a-zA-Z\d]*(-?|_?|\.?)[A-Za-z\d]+$/;
                if (!$.trim(value).match(pattern)) {
                  data = {};
                  Toast(campo + ' Inválido');
                  $(this).focus().select();
                  return false;
                }
              } */

            if ((name == "cpf_cnpj" || objeto[1] === "cpf_cnpj") && required) {
                if (!valida_cpf_cnpj(value)) {
                    data = {};
                    Toast(campo + " Inválido");
                    $(this).focus();
                    return false;
                }
            }

            /* Verifica se é um Objeto */
            if (objeto.length == 2) {
                if (data[objeto[0]] == undefined) data[objeto[0]] = {};
                if (value) data[objeto[0]][objeto[1]] = value;
            } else {
                if (value) data[name] = value;
            }

        });
        return data;
    };
    this.setValores = function (form, data, objeto) {
        objeto = objeto == undefined ? "" : objeto + ".";
        for (var key in data) {
            if (data[key] != "null" && data[key] != null) {
                form.find("[name='" + objeto + key + "']").val(data[key]).trigger("change");
                myApp.input.checkEmptyState(form.find("[name='" + objeto + key + "']"));
            }
        }
    };
    this.clean = function (form) {
        form[0].reset();
        myApp.input.checkEmptyState(form.find("[name]"));
    };
}

function Util() {
    this.formataDuasCasas = function (n, casasDecimais) {
        var numero = parseFloat(n);
        casasDecimais = casasDecimais == undefined ? 2 : casasDecimais;
        numero = numero.toFixed(casasDecimais).split('.');
        numero[0] = " " + numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }
    this.removeAccents = function (str) {
        var accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        str = str.split('');
        var strLen = str.length;
        var i, x;
        for (i = 0; i < strLen; i++) {
            if ((x = accents.indexOf(str[i])) != -1) {
                str[i] = accentsOut[x];
            }
        }
        return str.join('');
    }
    this.copiaAreaTransferencia = function (text) {
        var textArea = document.createElement("textarea");

        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;

        document.body.appendChild(textArea);
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            Toast('Copiado para area de transferência.');
        } catch (err) {
            Toast('Não foi possivel copiar para area de transferência');
        }

        document.body.removeChild(textArea);
    }
    this.maiuscula = function (text) {
        var loweredText = text.toLowerCase();
        var words = loweredText.split(" ");
        for (var a = 0; a < words.length; a++) {
            var w = words[a];

            var firstLetter = w[0];
            w = firstLetter.toUpperCase() + w.slice(1);

            words[a] = w;
        }
        return words.join(" ");
    };
    this.normaliza = function (data) {
        return JSON.stringify(data).replace(/\"/g, "\'");
    }
    this.preloadImgUnica = function (url, el) { // Melhorar essa coisa linda
        url = "https://sistemaagely.com.br/" + url.replace("getImagem", "getArquivo");

        preloadImage(url,
            function () { // Imagem carregada com sucesso 
                $(el).stop().animate({ opacity: '0' }, function () {
                    $(this).attr('src', url).animate({ opacity: '1' });
                });
            },
            function () { // Imagem não carregada
                $(el).stop().animate({ opacity: '0' }, function () {
                    $(this).attr('src', 'img/sem_logo.png').animate({ opacity: '1' });
                });
            }
        );

        function preloadImage(url, anImageLoadedCallback, anImageErrorCallback) {
            var img = new Image();

            img.onload = function () {
                anImageLoadedCallback();
            };
            img.onerror = function () {
                anImageErrorCallback();
            };

            img.src = url;
        }
    }
    this.onlyNumber = function (data) {
        return data != undefined ? data.replace(/[^\d]/, '') : undefined;
    }
    this.carregaGoogleMaps = function (data) {
        return new google.maps.Map(document.getElementById(data["id"]), {
            center: {
                lat: parseFloat(data["latitude"]),
                lng: parseFloat(data["longitude"])
            },
            zoom: 14,
            disableDefaultUI: true
        });
    }
    this.carregaMarkerGoogleMaps = function (data, map) {
        return new google.maps.Marker({
            map: map,
            title: data["nome"],
            position: {
                lat: parseFloat(data["latitude"]),
                lng: parseFloat(data["longitude"])
            },
            icon: {
                url: "img/logo.png", // url
                scaledSize: new google.maps.Size(32, 32), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(0, 32) // anchor
            }
        });
    }
    this.ordenaArray = function (data, key) {
        return data.sort(function (a, b) { return (Util.removeAccents(a[key]) > Util.removeAccents(b[key])) ? 1 : ((Util.removeAccents(b[key]) > Util.removeAccents(a[key])) ? -1 : 0); });
    }
    this.desordenaArray = function (data) {
        return data.sort(function () { return .5 - Math.random(); });
    }
}

function Toast(texto, tempo, fechar) {
    tempo = tempo == undefined ? 3500 : tempo;
    fechar = fechar == undefined ? false : true;
    return myApp.toast.create({
        text: texto,
        closeTimeout: tempo,
        closeButton: fechar,
        position: 'center',
        closeButtonColor: 'green',
        cssClass: 'toastNormal'
    }).open();
}

function Toast2(texto, tempo, fechar) {
    tempo = tempo == undefined ? 3000 : tempo;
    fechar = fechar == undefined ? false : true;
    return myApp.toast.create({
        text: texto,
        closeTimeout: tempo,
        closeButton: fechar,
        position: 'center',
        closeButtonColor: 'green',
        cssClass: 'toastPreto'
    }).open();
}

function LoadPage(name, parametros) {
    var pageName = "/" + name + "/";
    var page = $("#" + name);
    var painel = $(".panel-left");

    if (page.width() >= 1200)
        page.find(".tabs-swipeable-wrap").removeClass("tabs-swipeable-wrap").addClass("tabs-animated-wrap");

    if (painel.is(":visible")) {
        if (painel.find(".accordion-item-opened").length > 0)
            myApp.accordion.close(painel.find(".accordion-item-opened"));

        myApp.panel.close();
    }

    if ($(".view-login").is(":visible")) {
        View_Inicial.router.navigate(pageName, parametros);
    } else {
        View_Principal.router.navigate(pageName, parametros);
    }

    page.find(".page-content").animate({ scrollTop: 0 }, 300);

}

function BackPage() {
    var view;

    if (View_Principal.$el.hasClass("tab-active"))
        view = View_Principal;

    if (View_Inicial.$el.hasClass("tab-active"))
        view = View_Inicial;

    if (myApp.popup.get() != undefined)
        myApp.popup.close();
    else if (myApp.dialog.get() != undefined)
        myApp.dialog.close();
    else if ($(".iziModal").is(":visible"))
        $(".iziModal:visible").iziModal("close");

    else
        view.router.back();

    if (typeof cordova !== 'undefined') { screen.orientation.unlock(); }


}

function abreviaName(name) { // Retorna o nome abreviado Luiz G.S.B. Mariano
    var name = name.split(' ');
    var novoNome;
    for (var key in name) {
        if (key == 0) {
            novoNome = name[key] + ' ';
        } else if (key == name.length - 1) {
            novoNome += ' ' + name[name.length - 1];
        } else {
            novoNome += name[key].charAt(0).toUpperCase() + '.';
        }
    }
    return novoNome.trim();
}

function salvaLocalStorage() {
    localStorage[myApp["id"]] = JSON.stringify(myApp["data"]);
}

function trocaMenu(menu) {
    $(".menu .menu-inner .menu-item .menu-item-content").removeClass('active-menu');
    $(menu).find(".menu-item-content").addClass('active-menu');
}
function retira_acentos(str) {

    com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";

    sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    novastr = "";
    for (i = 0; i < str.length; i++) {
        troca = false;
        for (a = 0; a < com_acento.length; a++) {
            if (str.substr(i, 1) == com_acento.substr(a, 1)) {
                novastr += sem_acento.substr(a, 1);
                troca = true;
                break;
            }
        }
        if (troca == false) {
            novastr += str.substr(i, 1);
        }
    }
    return novastr;
}
/*-------------------------------------------------------------------------------------------------------------------*/
/*                                            Login                                                                  */
/*-------------------------------------------------------------------------------------------------------------------*/
function entrar() {
    //pegar os valores digitados no formulario de login(usuario e senha)
    var form = Formulario.getValores($('#login .list'));
    if (!jQuery.isEmptyObject(form)) {
        if ($("#lembrar").prop("checked")) {
            localStorage.setItem("dadosLembrarGerencial", JSON.stringify(form));
        }
        console.log(form.senha);
        if ((form.usuario == 'medicoteste') && form.senha == "759062f344eec3434a2c3591f3c31f77") {
            myApp.tab.show('.view-principal');
            LoadPage('menu');
            //Resgates.getResgates();
        }
    }
}
/*-------------------------------------------------------------------------------------------------------------------*/
/*                                             TED                                                                   */
/*-------------------------------------------------------------------------------------------------------------------*/
function aumentaLetras() {
    nomeP = $('#codigo').val().toUpperCase();
    Resgates.dadosPaciente(nomeP);
}

function listaPaciente(data) {
    idP = data.idusuario;    
    if (idP != 0) {
        
        document.getElementById("dadosPaciente").style.display = 'block';
        document.getElementById("dadosPaciente2").style.display = 'block';
        document.getElementById("rowP").style.display = 'none';
        
        $("#menu .nomeCpf").html("<b>Paciente: </b>" +data.nome+ "  " + "  <b>Cpf: </b>" +data.cpf);
        $("#menu .altPesKg").html("<b>Idade: </b>" + data.idade+ " anos" + "  " +  "<b>Altura: </b>" +data.altura+" m" + "  " + "<b>Peso: </b>" +data.peso+ " kg");

        Resgates.getAtividades(idP)
    } else {
        Toast("Verifique o nome do Paciente!")
    }
}

function listaSolicitacaoResgates(teds) {
    var hoje = new Date();
    var ano = hoje.getFullYear();
    var mes = hoje.getMonth()+1;
    var dia = hoje.getDate();
    var hora = hoje.getHours();
    var minutos = hoje.getMinutes();
    var datadehoje = String(dia) + '/' + String(mes) + '/' + String(ano);
    dtfinal = datadehoje;
    dtfinalizacao = datadehoje + ' às ' + String(hora) + ':' + String(minutos) + 'hs';
    console.log(dtfinalizacao);
    var lista = $("#conteudoTabelaTed");
    lista.empty();
    /* detalhaTed(' + Util.normaliza(teds[i]) + ') */
    for (var i in teds) {
        var tipo = "";
        if (teds[i].idtipo_resgate == 1) {
            tipo = "Ted"
        } else if (teds[i].idtipo_resgate == 2) {
            tipo = "Pix" 
        } else {
            tipo = "Cupom"
        }
        lista.append('<div class="row ' + (i % 2 == 0 ? '' : 'branco') + '">'
            + '    <div class="col-15">' + (teds[i].data) + '</div>'
            + '    <div class="col-15">' + teds[i].nome + '</div>'
            + '    <div class="col-15">' + tipo + '</div>'
            + '    <div class="col-15">R$ ' + Util.formataDuasCasas(teds[i].valorrecebido) + '</div>'
            + '    <div class="col-15 '+ (teds[i].status ==  "pendente" ? "red" : "") +'">' + teds[i].status + '</div>'
            + '    <div class="col-10" onclick="tedOuCupom(' + Util.normaliza(teds[i]) + ')"><i class="material-icons">search</i></div>'
            + '</div>');
    }
}

function listaAtividades(data) {
    var lista = $("#conteudoTabelaTed");
    lista.empty();
    for (var i in data) {
        if(i < 23) {
            dtinicial = data[i].data_atv;
            dtfinal = data[i+1].data_atv;
        } else {
            dtinicial = data[i].data_atv;
            dtfinal = "sem data";   
        }
        var dataI = data[i].data_atv.split(" ")[0];
        var hora = data[i].data_atv.split(" ")[1];
        var ano = dataI.split("-")[0]
        var mes = dataI.split("-")[1]
        var dia = dataI.split("-")[2]
        var datahj = dia + "/" + mes + "/" + ano;
        
        lista.append('<div class="row ' + (i % 2 == 0 ? '' : 'branco') + '">'
            + '    <div class="col-40">' + (datahj + " às " + hora + "hs") + '</div>'
            + '    <div class="col-15">' + data[i].atividade + '</div>'
            + '    <div class="col-10" onclick=""><i class="material-icons">search</i></div>'
            + '</div>');    
    }
}

function tedOuCupom(data) {
    finalData = data.data_final
    nomeNoiva = data.nome
    if (data.idtipo_resgate == 3) {
        Resgates.getCupons(data.idresgate)
    } else {
        Resgates.getTransferencias(data.idresgate)
    }
}

function detalhaCupom(data) {
    transfOuCupom = "Cupom";
    index = 1;
    $('.popup-detalha-ted .page-content').empty();
    $('.popup-detalha-ted .page-content').append('<div class="conteudo">' +
        '            <div class="row titulo">' +
        '                <div class="col coluna">Dados do Cupom</div>' +
        '             </div>' +
        '             <div class="tracinho">' +
        '                 <div class="linha"></div>' +
        '            </div>' +
        '            <div class="row"><b>Nome:</b> ' + nomeNoiva + '</div> ' +
        '            <div class="row"><b>Tipo:</b> Cupom ' + data.empresa + '</div> ' +
        '            <div class="row"><b>Código:</b> ' + (data.codigo != 'null' ? data.codigo : '') +'</div>' +
        '            <div class="row"><b>Valor:</b> R$ ' + Util.formataDuasCasas(data.valor) + '</div>' +
        '            <div class="row"><b>Data de Finalização:</b>' + (data.data_final != undefined ? data.data_final : '') + '</div>' +
        (data.codigo == 'null' 
            ? '            <div class="row" style="height: 40px;"></div>' +
            '            <div class="row" id="linha1"><b>Digite o código do cupom: </b>' +
            '                                   <input type="text" name="cod" id="codigo" style="border-style: solid; border-width: 1px;">'+
            '           </div>' 
            : '            <div class="row" style="height: 40px;"></div>'
        ) +
        '  </div>');

        (data.data_final == undefined  ?
            $(".popup.popup-detalha-ted .toolbar-bottom  .toolbar-inner").html('<button class="col button button-fill button-round" onclick="Resgates.aprovados('+ data.idresgate +')">Finalizar</button>')
                
        :   
        $(".popup.popup-detalha-ted .toolbar-bottom  .toolbar-inner").html(''))           
        
            /* ' <button class="col button button-fill button-round rejeitar" onclick="">Rejeitar</button>'*/ 
     
            
            myApp.popup.open('.popup-detalha-ted');
}

function detalhaTed(data) {
    index = 2
    if (data.agencia != null ) {
        transfOuCupom = "Ted";
    } else {
        transfOuCupom = "Pix";   
    }
    $('.popup-detalha-ted .page-content').empty();
    $('.popup-detalha-ted .page-content').append('<div class="conteudo">' +
        '            <div class="row titulo">' +
        '                <div class="col coluna">Dados da Transferência</div>' +
        '             </div>' +
        '             <div class="tracinho">' +
        '                 <div class="linha"></div>' +
        '            </div>' +
        (data.agencia != null  ?
            '            <div class="row"><b>Nome Correntista:</b> ' + data.nome + '</div>' +
            (data.tipo_pessoa == 'juridica' ? '' : '<div class="row"><b>CPF:</b> ' + data.cpf + '</div>') +
            (data.tipo_pessoa == 'fisica' ? '' : '<div class="row"><b>CNPJ:</b> ' + data.cnpj + '</div>') +
            '            <div class="row"><b>Tipo de Conta:</b> ' + data.tipo_conta + '</div>' +
            '            <div class="row"><b>Código do Banco:</b> ' + data.codigo_banco + '</div>' +
            '            <div class="row"><b>Agência:</b> ' + data.agencia + " - " + data.digito + '</div>' +
            '            <div class="row"><b>Número da Conta:</b> ' + data.conta + '</div>' 
                
            :   '    <div class="row"><b>Tipo chave: </b> ' + data.tipo_chave + '</div>' +
                '    <div class="row"><b>Chave: </b> ' + data.chave + '</div>' ) +
               '            <div class="row"><b>Valor da transferência:</b> R$ ' + Util.formataDuasCasas(data.valor) + '</div>'  +
               '            <div class="row"><b>Data de Finalização:</b>' + (data.data_final != undefined ? data.data_final : '') + '</div>' +
        '  </div>');
            
        (data.data_final == undefined  ?
            $(".popup.popup-detalha-ted .toolbar-bottom  .toolbar-inner").html('<button class="col button button-fill button-round" onclick="Resgates.aprovados('+ data.idresgate +')">Finalizar</button>')
                
        :   
        $(".popup.popup-detalha-ted .toolbar-bottom  .toolbar-inner").html(''))
            /* ' <button class="col button button-fill button-round rejeitar" onclick="">Rejeitar</button>' */
     
    myApp.popup.open('.popup-detalha-ted');
}

/* function detalhaTed(ted = {}) {
    $('.popup-detalha-ted .page-content').empty();
    $('.popup-detalha-ted .page-content').append('<div class="conteudo">' +
        '            <div class="row titulo">' +
        '                <div class="col coluna">Dados Pessoais</div>' +
        '             </div>' +
        '             <div class="tracinho">' +
        '                 <div class="linha"></div>' +
        '            </div>' +
        '            <div class="row"><b>Apelido/Nome Fantasia:</b> ' + (ted.pessoa.apelido_nomefantasia == undefined ? "-" : ted.pessoa.apelido_nomefantasia) + '</div> ' +
        '            <div class="row"><b>Nome/RazãoSocial:</b> ' + (ted.pessoa.nome_razaosocial == undefined ? "-" : ted.pessoa.nome_razaosocial) + '</div> ' +
        (ted.pessoa.tipo == 'PJ' ? '' : '<div class="row"><b>CPF:</b> ' + ted.pessoa.cpf + '</div>') +
        (ted.pessoa.tipo == 'PF' ? '' : '<div class="row"><b>CNPJ:</b> ' + ted.pessoa.cnpj + '</div>') +
        (ted.pessoa.tipo == 'PF' ? '' : '<div class="row"><b>Inscrição Estadual:</b> ' + (ted.pessoa.inscestadual == undefined ? "-" : ted.pessoa.inscestadual) + '</div>') +
        (ted.pessoa.tipo == 'PF' ? '' : '<div class="row"><b>Inscrição Municipal:</b> ' + (ted.pessoa.inscmunicipal == undefined ? "-" : ted.pessoa.inscmunicipal) + '</div>') +
        '            <div class="row"><b>Telefone (fixo):</b> ' + '(' + (ted.pessoa.ddd_fixo == undefined ? " " : ted.pessoa.ddd_fixo) + ') ' + (ted.pessoa.tel_fixo == undefined ? "-" : ted.pessoa.tel_fixo) + '</div>' +
        '            <div class="row"><b>Telefone (móvel):</b> ' + '(' + (ted.pessoa.ddd_movel == undefined ? " " : ted.pessoa.ddd_movel) + ') ' + (ted.pessoa.tel_movel == undefined ? "-" : ted.pessoa.tel_movel) + '</div>' +
        '            <div class="row"><b>Email:</b> ' + (ted.pessoa.email == undefined ? "-" : ted.pessoa.email) + '</div>' +
        '            <div class="row"><b>Data de Cadastro:</b> ' + moment(ted.pessoa.datacadastro == undefined ? "-" : ted.pessoa.datacadastro).format("DD/MM/YYYY") + '</div>' +
        (ted.pagarnivel == false ? 
        '             <div class="col coluna">Dados Bancários</div>' +
        '             </div>' +
        '             <div class="tracinho">' +
        '                 <div class="linha"></div>' +
        '            </div>' +
        (ted.idtransferencias_tipo == 1 ?
        '            <div class="row"><b>Nome Correntista:</b> ' + (ted.pessoa.cb_nome == undefined ? "-" : ted.pessoa.cb_nome) + '</div>' +
        '            <div class="row"><b>Tipo de Conta:</b> ' + (ted.pessoa.cb_tipoconta == undefined ? "-" : ted.pessoa.cb_tipoconta) + '</div>' +
        '            <div class="row"><b>Código do Banco:</b> ' + (ted.pessoa.cb_codigobanco == undefined ? "-" : ted.pessoa.cb_codigobanco) + '</div>' +
        '            <div class="row"><b>Agência:</b> ' + (ted.pessoa.cb_agencia == undefined ? "-" : ted.pessoa.cb_agencia) + '-' + (ted.pessoa.cb_agenciadv == undefined ? "-" : ted.pessoa.cb_agenciadv) + '</div>' +
        '            <div class="row"><b>Número da Conta:</b> ' + (ted.pessoa.cb_numeroconta == undefined ? "-" : ted.pessoa.cb_numeroconta) + '-' + (ted.pessoa.cb_numerocontadv == undefined ? "-" : ted.pessoa.cb_numerocontadv) + '</div>' 

        :   '    <div class="row"><b>Tipo chave: </b> ' + (ted.tipo_chavepix == undefined ? "-" : ted.tipo_chavepix) + '</div>' +
            '    <div class="row"><b>Chave: </b> ' + (ted.pessoa.chave_pix == undefined ? "-" : ted.pessoa.chave_pix) + '</div>' ) +
           '            <div class="row"><b>Valor da transferência:</b> R$ ' + Util.formataDuasCasas(ted.valorfinal) + '</div>' 


      : 
        '       <div class="col coluna">Dados Bancários Parceiro</div>' +
        '             </div>' +
        '             <div class="tracinho">' +
        '                 <div class="linha"></div>' +
        '            </div>' +
        '       <div class="row"><b>Nome Correntista:</b> ' + (ted.nome == undefined ? "-" : ted.nome) + '</div>' +
        '            <div class="row"><b>Tipo de Conta:</b> ' + (ted.cb_tipoconta == undefined ? "-" : ted.cb_tipoconta) + '</div>' +
        '            <div class="row"><b>Código do Banco:</b> ' + (ted.cb_codigobanco == undefined ? "-" : ted.cb_codigobanco) + '</div>' +
        '            <div class="row"><b>Agência:</b> ' + (ted.cb_agencia == undefined ? "-" : ted.cb_agencia) + '-' + (ted.cb_agenciadv == undefined ? "-" : ted.cb_agenciadv) + '</div>' +
        '            <div class="row"><b>Número da Conta:</b> ' + (ted.cb_numeroconta == undefined ? "-" : ted.cb_numeroconta) + '-' + (ted.cb_numerocontadv == undefined ? "-" : ted.pessoa.cb_numerocontadv) + '</div>' +
        '            <div class="row"><b>Valor da transferência:</b> R$ ' + Util.formataDuasCasas(ted.valorfinal)) + '</div>' +
        '   </div>' +
        '  </div>');
        ted.valor_formatado =  Util.formataDuasCasas(ted.valorfinal);
    if (ted.status.idtranferenciastatus == 1) {
        $(".popup.popup-detalha-ted .toolbar-bottom  .toolbar-inner").html('<button class="col button button-fill button-round" onclick="Teds.setAprovaSolicitacaoTED(' + Util.normaliza(ted) + ')">Aprovar</button>' +
            ' <button class="col button button-fill button-round rejeitar" onclick="Teds.setRejeitaSolicitacaoTED(' + Util.normaliza(ted) + ')">Rejeitar</button>');
    } else if (ted.status.idtranferenciastatus == 4) {
        $(".popup.popup-detalha-ted .toolbar-bottom  .toolbar-inner").html('  <button class="col button button-fill button-round" onclick="concluirTransferencia(' + Util.normaliza(ted) + ')" >Concluir</button>' +
            ' <button class="col button button-fill button-round rejeitar" onclick="Teds.setRejeitaSolicitacaoTED(' + Util.normaliza(ted) + ')">Rejeitar</button>');
    } else if (ted.status.idtranferenciastatus == 2 || ted.status.idtranferenciastatus == 3) {
        $(".popup.popup-detalha-ted .toolbar-bottom  .toolbar-inner").html('');
    }
    myApp.popup.open('.popup-detalha-ted');
}

function concluirTransferencia(obj) {
    myApp.dialog.create({

        closeByBackdropClick: false,
        animate: true,
        cssClass: 'dialog-transferencia',
        title: "",
        content: "<form class='list no-hairlines-md'>"
            + "<ul>"
            + '<li class="item-content item-input item-input-outline img">'
            + '<div class="img-foto">'
            + '<div class="circulo" id="foto-icon" >'
            + '<label class="botao" for="imagemTransferencia">'
            + '</label>'

            + '</div>'
            + '<input id="imagemTransferencia" onchange="uploadImgTransferencia(' + Util.normaliza(obj) + ')" type="file">'
            + '<input name="imagemTransferenciaBaixada" id="imagemTransferenciaBaixada" type="hidden">'
            + '</div>'
            + '</li>'
            + "</ul>"
            + "</form>",
        buttons: [
            {
                text: 'Cancelar',
            },
            {
                text: 'Concluir',
                cssClass: 'disabled',
                onClick: function () {

                    obj.url_comprovante = $("#imagemTransferenciaBaixada").val()
                    Teds.setConcluiSolicitacaoTED(obj);

                },
            },
        ],

    }).open();
}

function uploadImgTransferencia(obj = {}) {

    var nomeFoto = "transferencia_" + obj.idtransferencia + "_" + obj.documento;
    var form_data = new FormData();
    var file_data = $("#imagemTransferencia")[0].files[0]
    form_data.append("file_name", file_data);
    $.ajax({

        url: "https://sistemaagely.com.br:8345/upvendas30112020/atelieServer?tela=Upload&nomeArquivo=" + nomeFoto + "&caminho=&tipo=getImagem",
        cache: false,
        contentType: false,
        processData: false,
        async: false,
        data: form_data,
        type: 'post',
        success: function (data) {
            // display image
            $("#imagemTransferenciaBaixada").val(data)
            $("#foto-icon").css('background-image', 'url("img/check.png")')
            $("#app > div.dialog.dialog-buttons-2.dialog-transferencia.modal-in > div.dialog-buttons > span.dialog-button.disabled").removeClass("disabled");
        }
    });
}
 */