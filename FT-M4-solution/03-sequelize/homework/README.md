# Sequelize Blog Homework

## Descripción

En esta homework vamos a construir un Blog al estilo Wikipedia en el cual podremos crear nuevas
páginas con su contenido asociado y luego consultarlas, modificarlas o eliminarlas. Adicionalmente se
mantendrá un registro de todos aquellos usuarios que hayan creado alguna página en el Blog. Por
último, cada página puede pertenecer a una o más categorías específicas.

## Configuración inicial

1. Ejecutar `npm install` desde la carpeta `homework`
2. Configurar la base de datos de postgres para poder correr el proyecto correctamente:

  * Verificar que se encuentre instalado postgres en su máquina
  * Crear la base de datos denominada `henryblog` que se utilizará en esta homework ejecutando el
  siguiente comando: `CREATE DATABASE henryblog;` desde una interfaz a Postgres.
  * Modificar las siguientes linea del archivo `models/index.js`:

  ```js
  var db = new Sequelize('postgres://usuario:password@localhost:5432/henryblog', {
    logging: false,
  });
  ```
  Es necesario cambiar donde dice `usuario` por el usuario con el cual crearon la base de datos y
  donde dice `password` con la contraseña de dicho usuario.

3. Ejecutar `npm start` para correr el servidor. Inicialmente al acceder a `http://localhost:3001/`
para visualizar el Blog no se verá nada ya que las rutas del servidor no se encuentran implementadas.

## Instrucciones

### Creación de modelos de Sequelize

Dentro del modelo de la base de datos que vamos a utilizar en este ejercicio debemos generar las
entidades `Page`, `User` and `Category` descriptas debajo.

#### Diagrama Entidad-Relación

Antes de comenzar a codear tomate un tiempo para pensar como deberían ser las relaciones entre estas
tres entidades que debemos definir para el blog considerando que una página puede pertenecer a más de
una categoría.

#### Page

La entidad `Page` hace referencia a cada una de las páginas que van a crear los usuarios para cargar
contenido, por lo que las mismas deberían contener los siguientes campos:

  * __title__*: El título de la página
  * __urlTitle__*: La URL que vamos a utilizar para acceder a la información de una página a través de
  los links (Debe ser una URL válida).
  * __content__*: El contenido de la página
  * __status__: Estado actual de la página (Puede ser `open` o `closed`)
  * __route__: url de la ruta

#### User

La entidad `User` va a correponder a aquellos usuarios que participen del Blog generando nuevas
páginas, por lo que tendrán que contener los siguientes campos:

  * __name__*: Nombre completo del usuario
  * __email__*: Email del usuario (Debe ser único)

#### Category

La entidad `Category` corresponde a las distintas categorías o temas a los que puede pertenecer una
paǵina, por lo que minimamente debería contener:

  * __name__*: Nombre de la categoría (Debe ser único)
  * __description__: Descripción de la categoría

##### Esquema

Para llevar adelante esta tarea será necesario modificar el archivo `index.js` de la carpeta `models`:

  ```js
  const Page = db.define('page', {
    // Tu código acá:

  });

  const User = db.define('users', {
    // Tu código acá:

  })

  const Category = db.define('category', {
    // Tu código acá:

  })
  ```

Dentro de `Page`, `User` y `Category` deberán incluirse los campos correspondientes para cada uno
identificando su tipo de dato. En este [link](https://sequelize.org/master/manual/model-basics.html#model-definition)
podrán encontrar un ejemplo de cómo definir los esquemas. Por otro lado para saber todos los tipos de
datos aceptados por Sequelize pueden ingresar [acá](https://sequelize.org/master/manual/model-basics.html#data-types)

*Los campos que contienen un asterisco deben ser obligatorios, por lo que será necesario la
utilización de la opción `allowNull` en dichos casos*

##### Atributo Route (Virtual)

Adicionalmente necesitamos definir una ruta para cada página que se cree en el Blog para poder acceder
luego a su contenido. Para ello queremos que se genere dicha ruta concatenando `/pages/` con el campo
`urlTitle` de cáda página. Por ejemplo una `Page` cuyo `urlTitle` sea 'henry-Prep' debería tener una
ruta asociada igual a `/pages/henry-Prep`.

Como el campo `Route` es simplemente una variación del `urlTitle` no vale la pena también almacenarlo
en la base de datos. Para estos casos Sequelize tiene un tipo de dato denominado
[VIRTUAL](https://sequelize.org/master/manual/getters-setters-virtuals.html#virtual-fields) que nos
permite crear campos virtuales que no son almacenados en la base de datos sino que se crean de forma
dinámica cuando los necesitamos utilizar.

Por otro lado para definir que datos o información debe devolver cuando consultemos un campo virtual
es necesario definir un getter. [Aquí](https://sequelize.org/master/manual/getters-setters-virtuals.html#getters) podrán encontrar detalles de cómo implementarlo. En nuestro caso debemos
hacerlo dentro del campo que hemos definido como `route` y con el tipo de dato `VIRTUAL` previamente
mencionado.

##### Hooks

Es importante aclarar que el campo `urlTitle` debería ser una versión válida de URL para el campo
`title` por lo que deberías hacer que se genere automáticamente a partir del título ingresado por el
usuario. Por ejemplo si el usuario ingresa como título de la página: "Henry Sequelize Example", el
`urlTitle` debería generarse sólo como "Henry_Sequelize_Example".

Por lo tanto deben realizarse las siguientes validaciónes para el campo `urlTitle`:

  * No debe contener caracteres no alfanuméricos
  * Los espacios deben ser sustituidos por guiones bajos

Para eso deberán utilizar `regexes` y el método `replace` de Strings.

*__Ayuda__: Pueden utilizar la siguiente expresión regular: `page.title.replace(/\s+/g, '_').replace(/\W/g, '')`*

Implementar está función a partir de un `beforeValidate hook` en el archivo `index.js` de la carpeta
`models` para la entidad `Page`. [Acá](https://sequelize.org/master/manual/hooks.html) pueden
encontrar información sobre cómo implementar los hooks.

##### Vinculación

Si llegaste acá y todavía no pensaste en el modelo de entidad-relación te spoileamos la respuesta:

<p align="center">
  <img src="./img/ER.jpeg" />
</p>

Luego de haber creado los campos para cada entidad de la base de datos tenemos que relacionarlos entre
sí, ya que cada usuario (`User`) va a poder crear una o más páginas (`Page`) y cada página va a poder
pertenecer a una o más categorías (`Category`). Por lo tanto dentro del mismo archivo `index.js` de la
carpeta `models` también debemos agregar como se realcionan estas tres entidades.

Las distintas opciones que ofrece Sequelize para ello son:

  * hasOne
  * belongsTo
  * hasMany
  * belongsToMany

Para más detalles sobre cada una de ellas pueden consultar el siguiente [link](https://sequelize.org/master/manual/assocs.html)

En nuestro caso, las que corresponden utilizar son:

  * Relación uno a muchos entre `User` y `Page`: deben utilizarse en conjunto 'hasMany' y 'belongsTo'
  * Relación muchos a muchos entre `Page` y `Category`: deben utilizarse en conjunto dos 'belongsToMany'

Opcional: Pueden utilizar alias para identificar las relaciones por ejemplo la relación entre un
usuario y una página podría ser usando el alias `author`. En la sección ['Defining an Alias'](https://sequelize.org/master/manual/assocs.html#association-aliases--amp--custom-foreign-keys) de la
documentación se muestra un ejemplo de utilización del mismo

### Precarga de Categorías

Observar el archivo `app.js`, al final hay código comentado el cual se encarga de precargar en la base
de datos las 3 categorías que vamos a utilizar para nuestro blog. A esta altura ya deberían haber
creado correctamente el modelo de `Category` por lo que habría que importarlo acá y luego decomentar
las lineas mencionadas.

```js

// Agregar el Category en el import
const {db, Category} = require('./models')

```

*Pueden verificar si la carga fue exitosa ingresando desde la interfaz de postgres a la base de datos
y consultando todos los registros de la tabla categories*

### Routes

Ahora necesitaremos modificar las rutas de Express para manejar los request tanto de creación como
obtención de datos desde nuestro esquema:

  * __GET /__: Obtiene todas las páginas creadas (Debe traer también las categorías a las que
  pertenece cada página)
  * __GET /pages/:urlTitle__ : Obtiene todos los datos de una página en particular cuyo urlTitle
  corresponda con el indicado
  * __POST /pages__: Agrega una nueva página a la base de datos (Debe incluir también la categoría a
  la/s cual/es pertenece)
  * __GET /users__: Obtiene todos los usuarios
  * __GET /users/:id__: Obtiene los datos del usuario cuyo id corresponda con el indicado
  * __GET /categories__: Obtiene el listado de todas las categorías existentes
  * __GET /categories/:idCategory__: Obtiene todas las páginas que estén dentro de la categoría pasada como
  parámetro (El `:category` debe ser el nombre de la categoría)

*Los template de las rutas ya se encuentran creados dentro de la carpeta `routes` solo es necesario
modificarlos donde se indica*

#### Sequelize Query

Para obtener datos de la base de datos creada por Sequelize debemos utilizar su modelo de consulta que
podemos encontrar explicado en detalle en los siguientes dos links:

  * [Consultas básicas](https://sequelize.org/master/manual/model-querying-basics.html)
  * [Consultas de búsqueda](https://sequelize.org/master/manual/model-querying-finders.html)

__IMPORTANTE:__ Recordar que las consultas u operaciones sobre la base de datos serán a través de
promesas por lo que pueden capturar sus respuestas o errores como ya vimos en clases anteriores.

#### GET /

Modificar el archivo `index.js` de la carpeta `routes` y utilizar el método `findAll` de Sequelize
para obtener todas las páginas creadas hasta el momento. Luego con la respuesta renderizar el `index`
pasándole como argumento la respuesta de la consulta realizada.

```js
router.get('/', function(req, res){
  // Modificar para renderizar todas las páginas creadas que se encuentren
  // dento de la base de datos
  // (Debe traer también las categorías a las que pertenece cada página)
  // Tu código acá:

  // 1. Utilizar Page.findAll() en conjunto con el 'include' para hacer Eager Loading y traer
  //    también los datos de las categorías de cada página (Para más información acceder acá:
  //    https://sequelize.org/master/manual/eager-loading.html)
  // 2. Capturar la respuesta con lo ya visto en Express (Utilizar then())
  // 3. Renderizar la página "index" usando res.render('index', {pages}) (Donde {pages} es la
  //respuesta de la consulta a la base de datos)

})
```

#### GET /pages/:urlTitle

Modificar el archivo `pages.js` de la carpeta `routes` y utilizar el método `findOne` de Sequelize
para obtener una página en particular (La que coincida con el urlTitle indicado). Luego con la
respuesta renderizar el template `page` pasándole como argumento la respuesta de la consulta realizada.

```js
router.get('/:urlTitle', function(req, res) {
  // Modificar para que cuando se seleccione un "Page" en particular se muestren
  // los datos asociados al mismo
  // Tu código acá:

  // 1. Utilizar Page.findOne() pasándole como parámetro el urlTitle
  // 2. Capturar la respuesta utilizando then()
  // 3. Renderizar la página "page" usando res.render('page', {page}) (Donde {page} es la respuesta de
  //la consulta a la base de datos)


})
```

#### POST /pages

Modificar el archivo `pages.js` de la carpeta `routes` y utilizar el método `findOrCreate` de
Sequelize para buscar un usuario existente o crearlo en el caso de que no exista, luego el método
`create` de Sequelize para crear y gurdar un nuevo registro dentro de la tabla de páginas. Agregarle
el usuario a dicha página mediante el método `setUser` y por último la función que nos brinda
automáticamente Sequelize en los casos de relaciones muchos a muchos `setCategories` (En este caso es
'Categories' porque el modelo se llama 'Category' y Sequelize sabe como pluralizarlo). Una vez creada
exitosamente redirigir hacia la pantalla de la página recientemente creada.

```js
router.post('/', function(req, res) {
  // Modificar para que cuando se clickee el botón de "SUBMIT" se cree un nuevo post
  // tomando los datos desde el form y agregándolo a la base de datos
  // Tu código acá:

  // 1. Utilizar el método findOrCreate para obtener el usuario o crear uno nuevo en el caso de que no
  // exista
  // 2. Crear una página utilizando el método 'create' tomando los datos necesarios de. body del
  // request
  // [Se pueden anidar las promesas o utilizar un Promise.all para los puntos 1 y 2 pero tener en
  // cuenta que para los pasos siguientes debemos almacenar tanto el usuario como la pagina en alguna variable]
  // 3. Con los datos del usuario y la página, asociar el usuario a la página:
  // createdPage.setUser(user.id);
  // 4. Agregar las categorías recibidas en el body (llegan los ID's de categorias) a la página creada
  // mediante la función 'setCategories'
  // 5. Redirigir hacía la pantalla cuyo URL obtendremos de 'page.route'

});
```

__EXTRA:__ Si prueban agregar una página sin categorías va a ocurrir un error, lo mismo pasa si no enviamos todos
los datos obligatorios del form, por lo tanto sería mejor crear un mecanismo de validación en nuestro servidor
para chequear que todos los datos que necesitamos esten llegando dentro del body del request. En el caso de que
alguno de los datos no llegue podemos renderizar el template `error` pasándole un mensaje adecuado

```js

  if(...) {
    return res.render('error', {message: "Mensaje de error"});
  }

```

#### GET /users

Modificar el archivo `users.js` de la carpeta `routes` y utilizar el método `findAll` de Sequelize
para obtener todos los usuarios creados hasta el momento. Luego con la respuesta renderizar el `users`
pasándole como argumento la respuesta de la consulta realizada.

```js
router.get('/', function(req, res) {
  // Modificar para renderizar todas los usuarios que se encuentren
  // dento de la base de datos
  // Tu código acá:

  // 1. Utilizar User.findAll()
  // 2. Capturar la respuesta con then()
  // 3. Renderizar la página "users" usando res.render('users', {users}) (Donde {users} es la
  // respuesta de la consulta a la base de datos)

});
```

#### GET /users/:id

Modificar el archivo `users.js` de la carpeta `routes` y utilizar el método `findByPk` de Sequelize
para obtener un usuario en particular (El que coincida con el ID indicado). Luego con la respuesta
renderizar el template `unUsuarioEnParticular` pasándole como argumento la respuesta de la consulta
realizada.

```js
router.get('/:id', function(req, res) {
  // Modificar para renderizar los datos del usuario seleccionado
  // Tu código acá:

  // 1. Utilizar User.findByPk() pasándole como parámetro el id
  // 2. Agregarle todas las páginas de dicho usuario utilizando 'Eager Loading' (include) para
  // incluir el modelo de 'Page'
  // 3. Renderizar la página "unUsuarioEnParticular" usando res.render('unUsuarioEnParticular',
  //{user}) (Donde {user} es la respuesta de la consulta a la base de datos)

});
```

#### GET /categories

Modificar el archivo `categories.js` de la carpeta `routes` y utilizar el método `findAll` de Sequelize
para obtener todas las categorías existentes.

```js
router.get('/', function(req, res) {
  // Modificar para devolver los datos de todas las categorias existentes
  // Tu código acá:

  // 1. Utilizar Category.findAll()
  // 2. Capturar la respuesta con lo ya visto en Express (Utilizar then())
  // 3. Devolver los datos obtenidos en el paso anterior usando res.json

});
```

#### GET /categories/:idCategory

Modificar el archivo `categories.js` de la carpeta `routes` y utilizar el método `findByPk` de
Sequelize para obtener todas las pagínas asociadas a la categoría indicada como idCategory.

```js
router.get('/:idCategory', function(req, res) {
  // Modificar para que cuando se seleccione una "Category" en particular se muestren
  // todas las páginas que estén dentro de dicha categoría
  // Tu código acá:

  // 1. Utilizar Category.findByPk() pasándole como parámetro el id de la categoría
  //    en conjunto con el 'include' para hacer Eager Loading y traer
  //    también los datos de las paǵinas de esa categoría (Para más información acceder acá:
  //    https://sequelize.org/master/manual/eager-loading.html)
  // 2. Capturar la respuesta con lo ya visto en Express (Utilizar then())
  // 3. Devolver los datos res.json

});
```

### Extra

Se habrán dado cuenta que las últimas dos rutas correspondientes a las categorías no están siendo
utilizadas por ningún template HTML para mostrarlos en nuestra app por lo que los invitamos a crear
nuevas vistas y/o modificar las existentes para incluir una sección donde podamos ver el listado
de todas las categorías existentes y al clickear en alguna de ellas que nos muestre todas las
páginas que existen para dicha categoría.
