const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const { dbConnection } = require('./config/dbConnection');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const sessionsRouter = require('./routes/sessions.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const PORT = 8080;

dbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://gustavoosan:HIRoma-550@cluster0.eqbm5rt.mongodb.net/ecommerce?appName=Cluster0",
        ttl: 3600
    }),
    secret: 'CoderSecretCode',
    resave: true,
    saveUninitialized: true
}));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});