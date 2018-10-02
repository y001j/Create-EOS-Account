"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET home page.
 */
let eos = require('./common').eos;
const express = require("express");
const router = express.Router();
//import EosApi = require('eosjs-api');
//import Eos = require('eosjs');
var base = 0;
var quote = 0;
const crypto = require("crypto");
var bodyParser = require("body-parser");
router.get('/', (req, res) => {
    res.charset = 'utf-8';
    eos.getTableRows(true, 'eosio', 'eosio', 'rammarket', 3).then(function (value) {
        console.log(value);
        base = parseFloat(value.rows[0].base.balance.split(" ")[0]);
        quote = parseFloat(value.rows[0].quote.balance.split(" ")[0]);
    });
    var theprice = 1.05 * (4 + 0.256) * 1024 * quote / base + 0.05 + 0.15 + 0 + 0.1;
    res.render('index', { title: 'EOS Account Generator - EOS账号生成器', price: theprice.toFixed(4) });
});
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.post('/gethash', (req, res) => {
    var content = req.body; //加密的明文；
    console.log(content.ownerkey + content.activekey);
    console.log(content.account);
    var sha1 = crypto.createHash('sha1'); //定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(content.ownerkey + content.activekey);
    var d = sha1.digest('hex').substring(10, 20); //加密后的值
    var sha256 = crypto.createHash('sha256');
    sha256.update(content.account + d);
    var sum = sha256.digest('hex');
    //creataccount
    eos.transaction({
        actions: [
            {
                account: 'accountpower',
                name: 'regaccount',
                authorization: [{
                        actor: 'accountpower',
                        permission: 'active'
                    }],
                data: {
                    sender: 'accountpower',
                    hash: sum,
                    owner_key: content.ownerkey,
                    active_key: content.activekey
                }
            }
        ]
    }
    //options
    ).then(trx => {
        console.log("get siged transaction data: ", trx);
        console.log('completed.');
        res.send(d);
    }).catch(e => {
        console.log("error", e);
        res.send('transaction failed');
    });
});
function changeDecimalBuZero(number, bitNum) {
    /// <summary>
    /// 小数位不够，用0补足位数
    /// </summary>
    /// <param name="number">要处理的数字</param>
    /// <param name="bitNum">生成的小数位数</param>
    var f_x = parseFloat(number);
    if (isNaN(f_x)) {
        return 0;
    }
    var s_x = number.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + bitNum) {
        s_x += '0';
    }
    return s_x;
}
exports.default = router;
//# sourceMappingURL=index.js.map