import { expect } from 'chai';
import server from '../../utils/server.mock';
import AccommodationType from '../../../app/models/accommodation_type';
import Item from '../../../app/models/item';
//import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/item-accommodationtype';

let savedAccommodationType
let savedItem

describe(`GET ${ENDPOINT}`, () => {
  
  before(() => {
    return AccommodationType.remove({})
      .then(() => AccommodationType.create({ name: "1 Estrella", order: 0 }))
      .then(u =>  {
        savedAccommodationType = u
        Item.create({
                    name: "Item 1",
                    _accommodationType: u._id
                  })
      })
      .then( i => savedItem = i );
  });

  describe('#200', () => {
    it('should return 1 Estrella accommodation type', done => {
      server.get(`${ENDPOINT}/`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body[0].name).to.equal(savedAccommodationType.name);
          expect(res.body[0].order).to.equal(savedAccommodationType.order);
          done();
        });
    });
  });

});
