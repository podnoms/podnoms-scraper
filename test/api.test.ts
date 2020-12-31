process.env.NODE_ENV = 'test';

import chai = require('chai');
import chaiHttp = require('chai-http');
import { assert } from 'console';

import server = require('../src/server');

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('Parser Tests', () => {

    describe('#checkPageTitle', () => {
        it('it should correctly read the page title', (done) => {
            chai.request(server)
                .get('/get-page-title?url=https://podnomscdn.blob.core.windows.net/testing/pageparser/shallow-parser.html')
                .end((err, res) => {
                    if (err) {
                        assert(false, err);
                    }
                    chai.expect(res.status).to.eql(200);
                    chai.expect(res.body.data).to.eql('PodNoms Test - Shallow Parser');
                    done();
                }).timeout(0);
        });
    });

    describe('#checkMetaTags', () => {
        it('it should correctly read the meta head tags', (done) => {
            chai.request(server)
                .get('/get-head-meta-tags?url=https://podnomscdn.blob.core.windows.net/testing/pageparser/shallow-parser.html')
                .end((err, res) => {
                    if (err) {
                        assert(false, err);
                    }
                    chai.expect(res.status).to.eql(200);
                    chai.expect(JSON.parse(res.text).data.length).to.eql(4);
                    done();
                }).timeout(0);
        });
    });

    describe('#checkShallowParser', () => {
        it('it should parse html page correctly', (done) => {
            chai.request(server)
                .get('/check-url?url=https://podnomscdn.blob.core.windows.net/testing/pageparser/shallow-parser.html')
                .end((err, res) => {
                    if (err) {
                        assert(false, err);
                    }
                    chai.expect(res.status).to.eql(200);
                    chai.expect(JSON.parse(res.text).data.length).to.eql(6);
                    done();
                }).timeout(0);
        });
    });

    describe('#checkDeepParser', () => {
        it('it should parse SPA page correctly', (done) => {
            chai.request(server)
                .get('/deep-check-url?url=https://podnomscdn.blob.core.windows.net/testing/pageparser/deep-parser.html')
                .end((err, res) => {
                    if (err) {
                        assert(false, err);
                    }
                    chai.expect(res.status).to.eql(200);
                    chai.expect(JSON.parse(res.text).data.length).to.eql(6);
                    done();
                }).timeout(0);
        });
    });
});