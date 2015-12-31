var expect = require("chai").expect;
var connection = require('../utils/MySql').connection();

describe('dbConnection', function() {
  it('should connect to db', function(done) {

    connection.connect(function(err){
          expect(connection.state).to.equal("authenticated");
          done();
     });
  });
});
