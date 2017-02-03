'use strict'

const expect = require('chai').expect
const IPLDResolver = require('ipld-resolver')
const series = require('async/series')
const dagCBOR = require('ipld-dag-cbor')

const IPLDSelector = require('../src')

describe('IPLD Selectors', () => {
  const resolver = new IPLDResolver()
  const selector = new IPLDSelector(resolver)

  let node1
  let cid1

  before((done) => {
    node1 = {
      friends: [
        {name: 'Nicola'},
        {name: 'Juan'}
      ]
    }

    series([
      (cb) => {
        dagCBOR.util.cid(node1, (err, cid) => {
          cid1 = cid
          cb()
        })
      },
      (cb) => {
        resolver.put({
          node: node1,
          cid: cid1
        }, cb)
      }
    ], done)
  })

  describe('.which', () => {
    describe('strategy: glob (expensive)', () => {
      it('should match everything **/*', (done) => {
        selector.which('glob', cid1, '**/name', (err, results) => {
          if (err) return done(err)
          expect(results).to.have.lengthOf(2)
          done()
        })
      })
    })

    describe('strategy: regex (expensive)', () => {
      it('should match everything **/*', (done) => {
        selector.which('regex', cid1, '.*/name', (err, results) => {
          if (err) return done(err)
          expect(results).to.have.lengthOf(2)

          done()
        })
      })
    })
  })
})
