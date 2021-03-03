const mongoose = require('mongoose');
const {miejsce, opis} = require('./seedWidoczki');
const Widoczek = require('../models/Widoczek');
const cities = require('./cities');
const widoczek = require('../models/Widoczek');

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
const generatorNazw = array => array[Math.floor(Math.random()*array.length)];
const seedDB = async () => {
    await widoczek.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const losoweMiasto = Math.floor(Math.random() * 940);
        const widoczek = new Widoczek({
            location: `${cities[losoweMiasto].name}, ${cities[losoweMiasto].province}`,
            name: `${generatorNazw(opis)} ${generatorNazw(miejsce)}`
        })
        await widoczek.save();
    }
    


}

seedDB();