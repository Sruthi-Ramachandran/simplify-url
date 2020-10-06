'use strict';

const expect = require('chai').expect;
const validUrl = require('valid-url');
const request = require('request');
const HttpStatus = require('http-status-codes')

describe('UNIT TEST: Check URL', () => {
    // Check if the given URL is a valid URL
    it('UNIT TEST: Is a valid url', () => {
        const url = 'http://github.com';
        let result = false;
        if (validUrl.isWebUri(url)) {
            result = true;
        }
        expect(result).to.be.true;
    });
    // Check if the given URL is not a valid URL
    it('UNIT TEST: Is not a valid url', () => {
        const url = 'abcd.xyz';
        let result = false;
        if (validUrl.isWebUri(url)) {
            result = true;
        }
        expect(result).to.be.false;
    });
    // Check if the short URL redirects to original URL
    it('UNIT TEST: Redirect route', (done) => {
        request.get(`http://localhost:4100/:short_id`, (err, res, body) => {
            expect(res.statusCode).to.equal(HttpStatus.OK);
            done();
        });
    }).timeout(5000);

});
