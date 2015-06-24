var request = require('request'),
    sourcer = require('../src/sourcer'),
    xml2js = require('xml2js');

describe('sourcer', function() {
    describe('when sourcing a listing', function() {
        var getCallback,
            channel, 
            promise;
        beforeEach(function() {
            channel = 'bbc1';
            spyOn(request, 'get').and.callFake(function(url, cb) {
               getCallback = cb;
            });

            promise = sourcer.sourceListings(channel);
        });
        
        it('should get the listings from the correct source', function() {
            expect(request.get).toHaveBeenCalledWith(
                'http://bleb.org/tv/data/listings/0/'+channel+'.xml', jasmine.any(Function));
        });

        describe('but an error is thrown', function() {
            var error;
            beforeEach(function() {
                error = new Error('something bad happened');
                getCallback(error, null);
            });

            it('should callback the error', function(done) {
                promise.catch(function(e) {
                    expect(e.cause).toBe(error);
                    done();
                });
            });
        });
        
        describe('and a non-200 status code is returned', function() {
            var statusCode;
            beforeEach(function() {
                statusCode = 500;
                var res = {
                    statusCode: statusCode,
                    body: 'Errrrrrr!'
                };
                getCallback(null, res);
            });

            it('should resolve the promise with the body', function(done) {
                promise.catch(function(e) {
                    var expectedError = new Error('While sourcing listings for '+channel+', got statusCode: '+statusCode);
                    expect(e.cause).toEqual(expectedError);
                    done();
                });
            });
        });

        describe('and a 200 status code is returned', function() {
            var body, parseXmlCallback;
            beforeEach(function() {
                body = "<xml></xml>";
                var res = {
                    statusCode: 200,
                    body: body
                };
                spyOn(xml2js, 'parseString').and.callFake(function(xml, opts, cb) { parseXmlCallback = cb });
                getCallback(null, res);
            });
            
            it('should parse the resulting xml', function() {
                var expectedOptions = {
                    attrkey: '__metadata__',
                    explicitArray: false
                };
                expect(xml2js.parseString).toHaveBeenCalledWith(body, expectedOptions, jasmine.any(Function));
            });
            
            describe('and then xml parsing is NOT successful', function() {
                var parseError;
                beforeEach(function() {
                    parseError = new Error('invalid');
                    parseXmlCallback(parseError, null);

                });

                it('should resolve the promise with the body', function(done) {
                    promise.catch(function(e) {
                        expect(e.cause).toBe(parseError);
                        done();
                    });
                });
            });

            describe('and then xml parsing is successful', function() {
                var returnedListings;
                beforeEach(function() {
                    returnedListings = {channel: 'the right one'};
                    parseXmlCallback(null, returnedListings);
                });

                it('should resolve the promise with the body', function(done) {
                    promise.then(function(data) {
                        expect(data).toBe(returnedListings);
                        done();
                    });
                });
            });
            
        });
    });
});
