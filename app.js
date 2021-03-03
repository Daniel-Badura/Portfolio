// ------------ DEPENDECIES ---------------------------
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Widoczek = require('./models/Widoczek');
const {opis, miejsce} = require('./seeds/seedWidoczki');
const methodOverride = require('method-override');


// ------------ CONNECT MONGOOSE ----------------------
mongoose.connect('mongodb://localhost:27017/portfolio', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
// ------------ EXPRESS SETUP -------------------------
const app = express();
app.use(express.urlencoded({extend:true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
    res.render('home');
});
// ------------ METHOD OVERRIDE -----------------------
app.use(methodOverride('_method'))
// ------------ INDEX ---------------------------------
app.get('/widoczki', async (req, res) => {
    const widoczki = await Widoczek.find({});
    res.render('widoczki/index', {widoczki});
});
// ---------------------------------------- CRUD SECTION -------------------------------------------------
// ------------ NEW -----------------------------------
app.get('/widoczki/new', async (req, res) => {
    const widoczki = await Widoczek.find({});
    res.render('widoczki/new', {widoczki});
});
// ------------ POST NEW-------------------------------
app.post('/widoczki', async (req, res) => {
   const widoczek = new Widoczek(req.body.widoczek);
   await widoczek.save();
   res.redirect(`/widoczki/${widoczek._id}`);
})
// ------------ SHOW ----------------------------------
app.get('/widoczki/:id', async (req, res) => {
    const widoczek = await Widoczek.findById(req.params.id);
    res.render('widoczki/show', {widoczek});
});
// ------------ EDIT ----------------------------------
app.get('/widoczki/:id/edit', async (req, res) => {
    const widoczek = await Widoczek.findById(req.params.id);
    res.render('widoczki/edit', {widoczek});
});
// ------------ EDIT PUT -----------------------------
app.put('/widoczki/:id', async (req, res) => {
    const { id } = req.params;
    const widoczek = await Widoczek.findByIdAndUpdate(id, {...req.body.widoczek});
    res.redirect(`/widoczki/${widoczek._id}`);
})
// ------------ DELETE -----------------------------
app.delete('/widoczki/:id', async (req, res) => {
    const { id } = req.params;
    const widoczek = await Widoczek.findByIdAndDelete(id);
    res.redirect('/widoczki/');
})




// ------------ APP START -----------------------------
app.listen(3000, () => {
    console.log('Started on port 3000')
});

