import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
// import App from '../app/app';
import app from '../app/server'

chai.use(chaiHttp);
const expect = chai.expect;

describe('Hello API Request', () => {
  it('should return response on call', () => {
    return chai.request(api).get('/gateways')
      .then(res => {
        chai.expect(res.text).to.eql("how's it going?");
      })
  })
})