var models = require('./models');
const { db, Category } = require('./models')
var app = require('./index.js');

const force = true;
db.sync({ force })
    .then(function () {
        app.listen(3001, function () {
            console.log('Server is listening on port 3001!');

          // Descomentar estas lineas:
          
          var catAutos =  Category.create({
            name: "Autos",
            description: "Categoria que habla sobre autos"
          });
          
          var catDeportes =  Category.create({
            name: "Deportes",
            description: "Categoria que habla sobre Deportes"
          });
          
          var catVideojuegos =  Category.create({
            name: "Videojuegos",
            description: "Categoria que habla sobre Videojuegos"
          });
          
          Promise.all([catAutos, catDeportes, catVideojuegos])
            .then(res => {
              console.log("Categorías precargadas");
            });
        });
    });
