const supertest = require('supertest');
const app = require('../index.js');
const { db } = require('../models');
const { Page, User,  Category } = require('../models');
const expect = require('chai').expect;

const agent = supertest(app);

describe('Routes Testing', function() {
  afterAll(async function() {
    await db.sync({ force: true })
    db.close();
  })

  beforeAll(async function(){
    await Category.create({
      name: "Autos",
      description: "Categoria que habla sobre autos"
    });

    await Category.create({
      name: "Deportes",
      description: "Categoria que habla sobre Deportes"
    });

    await Category.create({
      name: "Videojuegos",
      description: "Categoria que habla sobre Videojuegos"
    });
  })

  describe('pedidos http PAGES', function () {
    beforeEach(function(){
      return Page.sync({ force: true })
    })
    describe('GET /', function () {
      it('responde con 200', function() {
        return agent.get('/')
        .expect(200);
      });
      it('espera que sea html', function(){
        return agent.get('/')
          .expect('Content-Type', /html/);
      });
    });

    describe('GET /pages/add', function () {
      it('responde con 200', function(){
        return agent.get('/pages/add')
          .expect(200);
      });
      it('espera que sea html', function(){
        return agent.get('/pages/add')
          .expect('Content-Type', /html/);
      });
    });

    describe('GET /pages/:urlTitle', function () {
      it('responde con 404 cuando la página no existe', function() {
        return agent.get('/pages/noexiste')
          .expect(404);
      });
      it('responde con 200 cuando la página existe', function() {
        return Page.create({
          title: 'hola',
          content: 'hola',
        })
        .then(() => {
          return agent.get('/pages/hola')
            .expect(200);
        })
      });
      it('espera que sea html', function(){
        return agent.get('/pages/hola')
          .expect('Content-Type', /html/);
      });
    });

    describe('POST /pages', function () {
      it('responde con 302', function(){
        return agent.post('/pages')
          .send({
            title: 'hola',
            content: 'chau',
            authorEmail: 'toni@toni.com',
            authorName: 'Franco',
            categories: [1]
          })
          .expect(302);
      });
      it('crea una page en la base de datos', function(){
        return agent.post('/pages')
          .send({
            title: 'hola',
            content: 'chau',
            authorEmail: 'toni@toni.com',
            authorName: 'Franco',
            categories: [1]
          })
          .then(() => {
            return Page.findOne({
              where: {
                title: 'hola'
              }
            });
          })
          .then(page => {
            expect(page).to.exist;
          });
      });
      it('setea correctamente la categoría en la base de datos', function(){
        return agent.post('/pages')
          .send({
            title: 'hola',
            content: 'chau',
            authorEmail: 'toni@toni.com',
            authorName: 'Franco',
            categories: [1,2]
          })
          .then(() => {
            return Page.findOne({
              where: {
                title: 'hola'
              },
              include: {
                model: Category
              }
            });
          })
          .then(page => {
            expect(page.categories[0].name).to.equal('Autos');
            expect(page.categories[1].name).to.equal('Deportes');
          });
      });
    });

  });

  describe('pedidos http USER', function () {
    beforeEach(function(){
      return User.sync({ force: true })
    })

    describe('GET /users', function () {
      it('responde con 200', function() {
        return User.create({
          name: 'hola',
          email: 'hola@hola.com',
        })
        .then(() => {
          return agent.get('/users')
            .expect(200);
        })
      });
      it('espera que sea html', function(){
        return agent.get('/users')
          .expect('Content-Type', /html/);
      });
    });

    describe('GET /users/:id', function () {
      it('responde con 200', function() {
        return User.create({
          name: 'hola',
          email: 'hola@hola.com',
        })
        .then(() => {
          return agent.get('/users/1')
            .expect(200);
        })
      });
      it('espera que sea html', function(){
        return agent.get('/users')
          .expect('Content-Type', /html/);
      });
    });

  });

  describe('pedidos HTTP categories', function () {
    beforeEach(function(){
      return Category.sync({ force: true })
    })

    describe('GET /categories', function () {
      it('responde con 200', function() {
        return agent.get('/categories')
        .expect(200);
      });
      it('responde con un json con todas las categorias.', function() {
        return Category.create({
          name: "Autos",
          description: "Categoria que habla sobre autos"
        })
        .then(() => {
          return Category.create({
            name: "Deportes",
            description: "Categoria que habla sobre Deportes"
          })
        })
        .then(() => {
          return agent.get('/categories')
        })
        .then(categories => {
          expect(categories.body[0].name).to.equal('Autos');
          expect(categories.body[0].description).to.equal('Categoria que habla sobre autos');
          expect(categories.body[1].name).to.equal('Deportes');
          expect(categories.body[1].description).to.equal('Categoria que habla sobre Deportes');
        })
      });
    });
    describe('get /categories/:idCategory', function () {
      it('responde con 404 cuando la categoria no existe', function() {
        return agent.get('/categories/99')
          .expect(404);
      });
      it('responde con 200 cuando la página existe', function() {
        return Category.create({
          name: "Autos",
          description: "Categoria que habla sobre autos"
        })
        .then(() => {
          return agent.get('/categories/1')
            .expect(200);
        })
      });
    })
  })
})
