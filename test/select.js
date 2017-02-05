'use strict'

const expect = require('chai').expect
const IPLDResolver = require('ipld-resolver')
const series = require('async/series')
const NameStore = require('./utils').NameStore
const IPLDSelector = require('../src')

describe('IPLD Selectors', () => {
  const resolver = new IPLDResolver()
  const selector = new IPLDSelector(resolver)
  const store = new NameStore(resolver)

  // Creating Data
  before((done) => {
    series([
      (cb) => {
        const nicola = {
          name: 'Nicola',
          friends: [
            {name: 'Jeromy'},
            {name: 'Juan'}
          ]
        }
        store.add('nicola', nicola, cb)
      },
      (cb) => {
        const david = {
          name: 'David',
          friends: [
            {'/': store.get('nicola').toBaseEncodedString() },
            {name: 'Juan'}
          ]
        }
        store.add('david', david, cb)
      }
    ], done)
  })

  // Writing repeating tests
  const tests = [
    {
      title: 'should match all',
      selectors: {glob: '**/name', regex: '(.*/)?name'},
      node: 'nicola',
      test: (results, done) => {
        expect(results).to.include('name')
        expect(results).to.include('friends/0/name')
        expect(results).to.include('friends/1/name')
        done()
      }
    },
    {
      title: 'should match all across link',
      selectors: {glob: '**/name', regex: '(.*/)?name'},
      node: 'david',
      test: (results, done) => {
        expect(results).to.include('name')
        expect(results).to.include('friends/1/name')
        expect(results).to.include('friends/0/name')
        expect(results).to.include('friends/0/friends/0/name')
        expect(results).to.include('friends/0/friends/1/name')
        done()
      }
    }]

  function whichTests (strategy) {
    tests.forEach((test) => {
      const matchString = test.selectors[strategy]
      const title = test.title + ' (' + matchString + ')'

      it(title, (done) => {
        const cid = store.get(test.node)
        selector.which(strategy, cid, matchString, (err, results) => {
          if (err) return done(err)
          test.test(results, done)
        })
      })
    })
  }

  describe('.which', () => {
    describe('strategy: glob', () => {
      whichTests('glob')
    })

    describe('strategy: regex (expensive)', () => {
      whichTests('regex')
    })
  })
})
