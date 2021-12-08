/*----------------------------------------------------------------------------------------*/
/*                                   Váriaveis Globais                                    */
/*----------------------------------------------------------------------------------------*/
var Formulario = new Formulario();
var Util = new Util();
var Resgates = new Resgates();
var nomeNoiva = "";
var transfOuCupom = "";
var cod = "";
var idres = 0;
var finalData = "";
var index = 0;
var dtfinalizacao = "";
var nomeP = "";
var idP = 0;
var dtinicial = "";
var dtfinal = "";
var atividade = "";

window.onload = function () {

    var init = {

        versao: function () {
            /* Pega Versão */
            if (myApp["data"]["teste"]) {
                myApp["data"]["versao"] = "data";
                //myApp["data"]["banco"] = "http://10.0.0.233:8080/Projetotc/"
                //myApp["data"]["banco"] = "http://192.168.106.125:8080/Projetotc/"
                //myApp["data"]["banco"] = "http://192.168.56.1:8080/Projetotc/"
                myApp["data"]["banco"] = "http://192.168.0.106:8080/Projetotc/";
                // myApp["data"]["banco"] = "https://sistemaagely.com.br:8245/upvendas140121c/"
                //myApp["data"]["banco"] = "http://10.0.0.3:8080/ChaDeLingerie/";
                typeof cordova !== "undefined" ? init.app() : init.web();
            } else {

                jQuery.ajax({
                    type: "POST",
                    dataType: "json",
                    //url: "https://sistemaagely.com.br/ajax?tela=GetVersaoApp&app=upvendas&teste=true&linkCompleto=true",
                    url: myApp["data"]["url_raiz"] + "?tela=GetVersaoApp&app=chadelingerie&teste=false&linkCompleto=true",
                    success: function (data) {
                        myApp["data"]["versao"] = data + "/";
                        myApp["data"]["banco"] = data + "/";
                        localStorage[myApp["id"]] = JSON.stringify(myApp["data"]);
                        typeof cordova !== "undefined" ? init.app() : init.web();
                    },
                    error: function (erro) {
                        myApp.toast.create({
                            text: "Modo offline ativado",
                            closeTimeout: 5000,
                            closeButton: false,
                            closeButtonColor: 'green',
                        }).open();
                    }
                });
            }
        },
        app: function () {
            init.boas_vindas();
            document.addEventListener("backbutton", function () { BackPage(); });
            window.open = cordova.InAppBrowser.open;
            $("#versao").text(BuildInfo["version"]);
        },
        web: function () {
            init.boas_vindas();
            $("#versao").text(myApp["data"]["versao"]);
        },
        boas_vindas: function () {
            
            if (localStorage.dadosLembrarGerencial != undefined && !jQuery.isEmptyObject(localStorage.dadosLembrarGerencial)) {
              
                var dadosUsuario = JSON.parse(localStorage.dadosLembrarGerencial);
                if ((dadosUsuario.usuario == 'usuarioteste' ) && dadosUsuario.senha == "759062f344eec3434a2c3591f3c31f77") {
                    myApp.tab.show('.view-principal');
                    LoadPage('menu',{ animate: false });
                    //Resgates.getResgates();
                   
                }else{
                    LoadPage('login',{ animate: false });
                }
            } else {
                LoadPage("login", { animate: false });
                
            }

            salvaLocalStorage();
        }
    }
    if (typeof cordova !== "undefined"){
        document.addEventListener('deviceready', function () { init.versao() }, false);

    }else{
        init.versao();

    }
};
