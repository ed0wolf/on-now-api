var db = require('../src/database'),
    repo = require('../src/repository';
describe('repository', function() {
    describe('when getting listings for channel', function() {
        var expectedPromise, id;
        beforeEach(function() {
            expectedPromise = {then: true};
            spyOn(db, 'get').and.returnValue(returnedPromise);
            
            id = 'bbc5';
            repo.getChannelListings(id)
        });

        it('should get the correct id from the db', function() {
            expect(db.get).toHaveBeenCalledWith()
    }):
});
