const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/atividade4', {useNewUrlParser:true});

const Cat = mongoose.model('Usuario', { username: String, name: String, password: String });

const kitty = new Cat({ name: 'Zildjian' });

kitty.save().then(() => console.log('meow'));