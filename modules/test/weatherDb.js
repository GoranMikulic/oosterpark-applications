var expect = require("chai").expect;

var weatherDb = require('../db/Weather.js');
describe('weatherDb', function() {

  it('should return weather information', function(done) {
    var dayToTest = "2015-12-24";
    weatherDb.getWeatherForPeriod(dayToTest +" 00:01:00", dayToTest + " 23:01:00", function(result) {
      expect(result).not.to.equal(null);
      expect(result.length).to.be.above(1);
      expect(result[0]).to.have.property('id');

      for(element in result) {
        expect(new Date(result[element].date).getDate()).to.equal(24);
      }

      done();
    })
  });

});
