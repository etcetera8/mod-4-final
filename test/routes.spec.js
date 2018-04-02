const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200)
    })
  })
});

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done();
              })
          })
      })
  })

  describe('GET /api/v1/items', () => {
    it('should return all of the items', () => {
      return chai.request(server)
      .get('/api/v1/items')
      .then( response => {
        response.should.have.status(200)
        response.should.be.json;
        response.body.should.be.a('array')
        response.body.length.should.equal(2)
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1)
        response.body[0].should.have.property('item');
        response.body[0].item.should.equal('toothbrush');
        response.body[0].should.have.property('packed');
        response.body[0].packed.should.equal(false);
      })
      .catch( error => {
        throw error;
      })
    })
  })

  describe('POST /api/v1/items/', () => {
    it('should create a new item', () => {
      return chai.request(server)
      .post('/api/v1/items')
      .send({
        item: "return ticket"
      })
      .then( response => {
        response.status.should.equal(201)
        response.body.should.be.a('object')
        response.body.should.have.property('id')
        response.body.id.should.equal(3)
      })
    })

    it('should return a 422 error if no param is givern ', () => {
      return chai.request(server)
      .post('/api/v1/items')
      .then( response => {
        response.status.should.equal(422)
        response.body.should.have.property('error')
      })
    })
  })

  describe('PATCH /api/v1/items/:id', () => {
    it('should update whether an item is packed', () => {
      return chai.request(server)
      .patch('/api/v1/items/1')
      .send({packed: true})
      .then( response => {
        response.should.have.status(200)
        response.body.should.have.property('id')
        response.body.id.should.equal('1')
      })
      .catch(error => {
        throw error;
      })
    })
    it('should return an error if no item with that id', () => {
      return chai.request(server)
      .patch('/api/v1/items/200')
      .send({packed: true})
      .then( response => {
        response.should.have.status(404)
        response.body.should.have.property('error');
        response.body.error.should.equal('No item with that id');
      })
      .catch(error => {
        throw error;
      })

    })
  })

  describe('DELETE /api/v1/items/:id', () => {
    it('should delete a item from the db', () => {
      return chai.request(server)
      .delete('/api/v1/items/1')
      .then(response => {
        response.should.have.status(202)
      })
      .catch(error => {
        throw error;
      })
    })
    
    it('should give an error if no item with that id exists', () => {
      return chai.request(server)
      .delete('/api/v1/items/200')
      .then(response => {
        response.should.have.status(404)
        response.body.should.have.property('error');
        response.body.error.should.equal('No list item matching that id');
      })
    })
    
  })
});