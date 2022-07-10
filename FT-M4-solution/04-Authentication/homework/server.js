const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

const users = [
  {id: 1, name: 'Franco', email: 'Franco@mail.com', password: '1234'},
  {id: 2, name: 'Toni', email: 'Toni@mail.com', password: '1234'}
]

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

const isAuthenticated = (req, res, next) => {
  const { userId } = req.cookies;
  const user = users.find(user => user.id.toString() == userId);
  if ( user ) return res.redirect('/home');
  next();
};

const isNotAuthenticated = (req, res, next) => {
  const { userId } = req.cookies;
  const user = users.find(user => user.id.toString() == userId);
  if ( !user ) return res.redirect('/login');
  next();
};

app.get('/', (req, res) => {
  const { userId } = req.cookies;
  res.send(`
    <h1>Bienvenidos a Henry!</h1>
    ${ userId ? `
    <a href='/home'>Perfil</a>
    <form method="post" action="/logout">
      <button>Salir</button>
    </form>
    ` : `
    <a href='/login'>Ingresar</a>
    <a href='/register'>Registrarse</a>
    `}
  `);
});

app.get('/register', isAuthenticated, (req, res) => {
  res.send(`
  <h1>Registrarse</h1>
  <form method="post" action="/register">
    <input name='name' placeholder='Nombre' required />
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' placeholder='Contraseña' required />
    <input type="submit" value='Registrarse' />
  </form>
  <a href='/login'>Iniciar sesión</a>
  `)
});

app.get('/login', isAuthenticated, (req, res) => {
  res.send(`
    <h1>Iniciar sesión</h1>
    <form method="post" action="/login">
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type="submit" value='Ingresar' />
    </form>
    <a href='/register'>Registrarse</a>
  `)
});

app.get('/home', isNotAuthenticated, (req, res) => {
  const { userId } = req.cookies;
  const user = users.find(user => user.id.toString() == userId);
  res.send(`
    <h1>Bienvenido ${user.name}</h1>
    <h4>${user.email}</h4>
    <a href='/'>Inicio</a>
  `);
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const user = users.find(user => user.email === email);
  if (user || (!name || !email || !password)) {
    res.redirect('/register');
  } else {
    users.push({
      id: users.length + 1,
      name,
      email,
      password
    });
    res.redirect('/');
  }
});

app.post('/login', (req, res) => {
  console.log('Hice post a /login');
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user.id)   {
    res.cookie('userId', user.id);
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

app.post('/logout', (req, res) => {
  console.log('Hice post a /logout');
  console.log('Hice post a /logout');
  res.clearCookie('userId');
  res.redirect('/');
});

app.listen(3000, (err) => {
  if(err) {
   console.log(err);
 } else {
   console.log('Listening on localhost:3000');
 }
});
