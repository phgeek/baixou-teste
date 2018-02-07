$(document).ready(function() {
    getList();
});

function getList() {
    if (!localStorage.getItem('bToken'))
        getToken();

    getItems();
}

function getToken() {
    localStorage.setItem('bToken-bkp', localStorage.getItem('bToken'));
    $.ajax({
        url: "http://testedev.baixou.com.br/processo/auth",
        type: "POST",
        data: {email: "ph.ufeb@gmail.com"},
        success: function(d) {
            if (d.status) {
                localStorage.setItem('bToken', d.token);

            // ERROR
            } else {
                // If a Token error
                if(/(Token)/.test(d.error))
                    getList();

                if(/(E\-mail)/.test(d.error))
                    alert(d.error);
            }
        }
    });
}

function getItems() {
    var bToken = localStorage.getItem('bToken');
    $.ajax({
        url: "http://testedev.baixou.com.br/processo/lista?token=" + bToken,
        success: function(d) {
            if (d.status) {

                // Create a new ListJS
                var options = {
                    valueNames: [{name: 'imagem', attr: 'src'}, 'titulo', 'descricao', 'preco', 'nparcela', 'vparcela'],
                    item: '<div class="col-lg-6"><img class="imagem" /><p class="titulo"></p><p class="descricao"></p><div class="price"><span class="preco"></span><span class="nparcela invisible"></span><span class="vparcela invisible"></span></div></div>'
                };
                var newList = new List('full-list', options, d.ofertas);
                newList.on('updated', function() {
                    $(".nparcela, .vparcela").not(":empty").removeClass('invisible');
                }).update();

            // ERROR
            } else {
                // If a Token error
                if(/(Token)/.test(d.error))
                    getToken();
            }
        }
    });
}