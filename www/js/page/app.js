// Dom7
var $$ = Dom7;

// Framework7 App main instance
var myApp = new Framework7({
    root: '#app',
    id: 'com.libertas.sitetc',
    name: 'Framework7',
    theme: 'auto',
    data: function() {
        return {
            versao: "",
            banco: "",
            teste: true,
            url_raiz: "https://sistemaagely.com.br/ajax",
        };
    },
});

/* VIEW LOGIN */
var View_Inicial = myApp.views.create('.view-login', {
    url: '/',
    stackPages: true,
    routes: [{
        path: "/login/",
        pageName: "login",
        options: {
            transition: 'f7-circle',
        },
    }, ]

});

/* VIEW PRINCIPAL */
var View_Principal = myApp.views.create('.view-principal', {
    url: '/',
    stackPages: true,
    routes: [{
            path: "/menu/",
            pageName: "menu",
            options: {
                transition: 'f7-fade',
            },
        },
       
    ]
});

var Load = myApp.dialog.create({
    text: "<img src='img/icon.png' width=80><br> Carregando...",
    cssClass: "dialog-load"
});