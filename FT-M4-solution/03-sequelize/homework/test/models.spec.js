const { db } = require('../models');
const { Page, User, Category } = require('../models');
const expect = require('chai').expect;

describe('Model Testing', function() {
  afterAll(async function() {
    await db.sync({ force: true });
    db.close();
  })
  describe('Page model', function () {
    beforeEach(async function() {
      await Page.sync({ force: true });
    });
    describe('Validations', function () {
      it('error sin title', function(done) {
         Page.create({
          content: 'Hola',
         })
          .then(() => done('No debería haberse creado'))
          .catch(() => done());
      });
      it('error sin content', function(done) {
        Page.create({
          title: 'hola',
        })
        .then(() => done('No deberia haberse creado'))
        .catch(() => done());
      });
      it('error con un status invalido', function(done) {
        Page.create({
          title: 'hola',
          content: 'hola',
          status: 'esto no es un status valido'
        })
          .then(() => done('No debería haberse creado'))
          .catch(() => done());
      });
    });
    describe('Virtuals', function () {
      let page;
      // before(function(){
        page = Page.build({
          title: 'hola',
          content: 'hola **chau**',
          urlTitle: 'hola',
        });
      // })
      describe('route', function () {
        it('devuelve el url_name anexado a "/pages/"', function (){
          expect(page.route).to.equal('/pages/'+page.urlTitle);
        });
      });
    });

    describe('Hooks', function () {
      it('setea urlTitle basado en title antes de validar ', function() {
        return Page.create({
          title: 'hola chau',
          content: 'hola',
        })
          .then(page => {
            expect(page.urlTitle).to.equal('hola_chau');
          })
      });
    });
  });

  describe('User Model', function () {
    beforeEach(function() {
      return User.sync({ force: true });
    })
    describe('Validations', function () {
      it('error sin name', function(done) {
         User.create({
          email: 'valid@gmail.com',
         })
          .then(() => done('No debería haberse creado'))
          .catch(() => done());
      });
      it('error sin email', function(done) {
        User.create({
          name: 'hola',
        })
        .then(() => done('No deberia haberse creado'))
        .catch(() => done());
      });
      it('error con un email inválido', function(done) {
        User.create({
          nombre: 'hola',
          email: 'esto no es un email valido'
        })
          .then(() => done('No debería haberse creado'))
          .catch(() => done());
      });
    });
  });

  describe('Category model', function () {
    beforeEach(function() {
      return Category.sync({ force: true });
    })
    describe('Validations', function () {
      it('error sin name', function(done) {
         Category.create({
          description: 'Hola',
         })
          .then(() => done('No debería haberse creado'))
          .catch(() => done());
      });
    });
  });
})
