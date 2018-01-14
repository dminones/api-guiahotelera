import { expect } from 'chai';
import server from '../../utils/server.mock';
import Site from '../../../app/models/site';
//import PostFactory from '../../factories/post.factory';

const ENDPOINT = '/sites';
let testSite1;
let testSite2;

describe(`GET ${ENDPOINT}/:slug`, () => {
  
  before(() => (
    Site.remove({})
    .then(() => Site.create({
      name: 'Guia Hotelera Bolivia',
      slug: 'bolivia',
      logo: 'imagen.jpg'
    }))
    .then(t => { 
      testSite1 = t
      return Site.create({
        name: 'Guia Hotelera Argentina',
        slug: 'argentina',
        logo: 'imagen.jpg'
      })
    })
    .then(t => testSite2 = t)
  ));

  describe('#200', () => {
    it('should return the site with the supplied id', (done) => {
      server.get(`${ENDPOINT}/${testSite1.slug}`)
        .end((err, res) => {
          const { body } = res;

          expect(res).to.have.status(200);
          expect(body.name).to.eql(testSite1.name);
          expect(body.name).to.not.be.eql(testSite2.name);

          done();
        });
    });
  });

  describe('#404', () => {
    it('should send back not found if inexistent id is provided', (done) => {
      server.get(`${ENDPOINT}/NotExistent`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
  
});
