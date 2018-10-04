var eos;

var chain = {
    main: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // main network
    jungle: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // jungle testnet
    sys: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f' // local developer
};

/**
  Other httpEndpoint's: https://www.eosdocs.io/resources/apiendpoints
*/
//eos = Eos({
//    keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',// private key
//    httpEndpoint: 'https://api.eoslaomao.com',
//    chainId: chain.sys,
//});

eos = Eos({
    httpEndpoint: 'https://api.eoslaomao.com'
});

$(function () {
    //$("#gen_random").click(function (event) {
    //    event.preventDefault();
    //    $('input[name=account_name]').val(get_random_eos_name());
    //    validate_form();
    //});
    //i18n.init();
    i18n.init({ cookieName: 'i18next' });
    $('input[name=account_name]').keyup(function (event) {
        validate_form();
    });
    $('#activekey').on("keyup", validate_form);
    $('#activekey').on("change", validate_form);
    $('#activekey').on("paste", validate_form);

    $('#ownerkey').on("keyup", validate_form);
    $('#ownerkey').on("change", validate_form);
    $('#ownerkey').on("paste", validate_form);

    $('#complete').on("click", completeReg);
    $('#langlink').on("click", switchLang);
    $('#checkAccount').on("click", checkAccount);
    validate_form();
    $('input[name=account_name]').focus();
});

//
//  Sign and broadcast a transaction.

//  @example updateProducerVote('myaccount', 'proxyaccount', ['respectedbp'])
//
async function updateProducerVote(voter, proxy = '', producers = []) {
    return eos.voteproducer(voter, proxy, producers);
}

function check_availability() {
    let account_name = $('input[name=account_name]').val();
    if (!is_valid_account_name(account_name)) {
        $("#validate").attr("name", "close-circle");
        $("#addon").css("color", "red");
        return false;
    }

    eos.getAccount(account_name).then((x) => {
        // console.log("Account already exists");
        $("#validate").attr("name", "close-circle");
        $("#addon").css("color", "red");
        set_valid(false);
        //check = false;

    })
        .catch((err) => {
            // console.log("Account is free");
            $("#validate").attr("name", "checkmark-circle");
            $("#addon").css("color", "green");
            //set_valid(true);
            //check = true;
        });
    return true;
}

function is_valid_public_key(key) {
    return eosjs_ecc.isValidPublic(key.trim());
}

function switchLang() {
    if ($('#langlink').text() == 'En')
        $('#langlink').attr("href", "/?lng=en");
    else
        $('#langlink').attr("href", "/?lng=zh-CN");
}

function checkAccount() {
    let account_name = $('input[name=account_name]').val();
   
    eos.getAccount(account_name).then((x) => {
        // console.log("Account already exists");
        //$(".modal-body").html(t("create"));
        //check = false;
        $('#checkModal').modal('show');
        //$('#checkModal.btn-success').attr("href", "https://eospark.com/MainNet/account/" + account_name);

    })
        .catch((err) => {

            //var temp = $.t("home.create");
            $('#checkModalFail').modal('show');
            //$(".modal-body").html(temp);
        });
}

function completeReg() {
    $.post('/gethash', { ownerkey: $('#ownerkey').val(), activekey: $('#activekey').val(), account: $('input[name=account_name]').val()}, function (result) {
        $("#memo").html($('input[name=account_name]').val() + result);
        $('#ownerkey').prop("disabled", true);
        $('#ownerkey').addClass("disabled");
        $('#activekey').prop("disabled", true);
        $('#activekey').addClass("disabled");
        $('input[name=account_name]').prop("disabled", true);
        $('input[name=account_name]').addClass("disabled");
        $("#complete").addClass("disabled");
        $("#moreinfo").attr("href", "https://eospark.com/MainNet/account/" + account_name);
    }, 'text');
}

function validateKeys(){
    let valid_1 = is_valid_public_key($("#activekey").val());
    let valid_2 = is_valid_public_key($("#ownerkey").val());
    if (valid_1) {
        $("#validateActive").attr("name", "checkmark-circle");
        $("#addon-active").css("color", "green");
    }
    else {
        $("#validateActive").attr("name", "close-circle");
        $("#addon-active").css("color", "red");
    }
    if (valid_2) {
        $("#validateOwner").attr("name", "checkmark-circle");
        $("#addon-owner").css("color", "green");
    }
    else {
        $("#validateOwner").attr("name", "close-circle");
        $("#addon-owner").css("color", "red");
    }
    return valid_1 && valid_2;
}


function get_random_eos_name() {
    function choices(population, k) {
        var out = [];
        for (var i = 0; i < k; i++) {
            out.push(population[Math.floor(population.length * Math.random())]);
        }
        return out.join("");
    }
    let alphabet = 'abcdefghijklmnopqrstuvwxyz12345';
    return choices(alphabet, 12);
}

function is_valid_account_name(account_name) {
    let re = new RegExp("^([a-z1-5]){12}$");
    return re.test(account_name);
}

function set_valid(valid) {
    //let img_valid = $("img.valid");
    //let img_invalid = $("img.invalid");
    if (valid) {
        //img_valid.show();
        //img_invalid.hide();
        $("#complete").prop("disabled", false);
        $("#complete").text("Continue");
        //if()
        $("#complete").removeClass("disabled");
        $("#complete").css("color", "green");
    } else {
        //img_valid.hide();
        //img_invalid.show();
        $("#complete").prop("disabled", true);
        $("#complete").addClass("disabled");
        $("#complete").text("Please enter a valid name");
        $("#complete").css("color", "white");

    }
}

function set_valid_keys(valid, keys_valid) {
    //let img_valid = $("img.valid");
    //let img_invalid = $("img.invalid");
    if (valid && keys_valid) {
        //img_valid.show();
        //img_invalid.hide();
        $("#complete").prop("disabled", false);
        $("#complete").text("Continue");
        //if()
        $("#complete").removeClass("disabled");
        $("#complete").css("color", "green");
    } else {
        //img_valid.hide();
        //img_invalid.show();
        $("#complete").prop("disabled", true);
        $("#complete").addClass("disabled");
        $("#complete").text("Please enter a valid name");
        $("#complete").css("color", "white");

    }
}

function validate_form() {
    //let account_name = $('input[name=account_name]').val();
    //set_valid(is_valid_account_name(account_name));
    let check_account = check_availability();
    let check_keys = validateKeys();
    set_valid_keys(check_keys, check_account);
    //check_availability();
}

