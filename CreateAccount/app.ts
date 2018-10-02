import debug = require('debug');
import express = require('express');
import path = require('path');
//for internationalization - support multi-language
import i18next = require('i18next');
import i18nextMiddleware = require('i18next-express-middleware');
import Backend = require('i18next-node-fs-backend');

import routes from './routes/index';
import users from './routes/user';

var app = express();

app.locals.NEWACCOUNT_RAM_KB = 4;
app.locals.NEWACCOUNT_NET_STAKE = 0.5;
app.locals.NEWACCOUNT_CPU_STAKE = 1.5;
app.locals.SMART_ACCOUNT_CREATOR_FEE = 0;

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
            addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
        },
        detection: {
            order: ['querystring', 'cookie'],
            caches: ['cookie']
        },
        fallbackLng: 'en',
        preload: ['en', 'de'],
        saveMissing: true
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(i18nextMiddleware.handle(i18next));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
