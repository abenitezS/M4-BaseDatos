const express = require('express');
const vb = require('volleyball');
const nunjucks = require('nunjucks');
const { pages, users, index, categories } = require('./routes');
const app = express();

const env = nunjucks.configure('views', {noCache: true});

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(vb);
app.use(express.static('./public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json({extended: false}));
app.use('/', index);
app.use('/pages', pages);
app.use('/users', users);
app.use('/categories', categories);
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send(err.message);
});


module.exports = app;
