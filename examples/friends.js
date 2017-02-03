const IPLDSelector = require('../src')
const IPLDResolver = require('ipld-resolver')
const series = require('async/series')
const dagCBOR = require('ipld-dag-cbor')

const resolver = new IPLDResolver()
const selector = new IPLDSelector(resolver)


// David
const david = {
  name: 'David'
}
let davidCID

// Jeremy
const jeremy = {
  name: 'Jeremy'
}
let jeremyCID

// Nicola
let nicola
let nicolaCID

series([
  (cb) => {
    dagCBOR.util.cid(david, (err, cid) => {
      davidCID = cid
      cb()
    })
  },
  (cb) => {
    dagCBOR.util.cid(jeremy, (err, cid) => {
      jeremyCID = cid
      cb()
    })
  },
  (cb) => {
    nicola = {
      friends: [{
        '/' : davidCID.toBaseEncodedString(),
        '/' : jeremyCID.toBaseEncodedString()
      }]
    }
    dagCBOR.util.cid(nicola, (err, cid) => {
      nicolaCID = cid
      cb()
    })
  },
  (cb) => {
    resolver.put({
      node: jeremy,
      cid: jeremyCID
    }, cb)
  },
  (cb) => {
    resolver.put({
      node: david,
      cid: davidCID
    }, cb)
  },
  (cb) => {
    resolver.put({
      node: nicola,
      cid: nicolaCID
    }, cb)
  }
], () => {
  console.log('added everything')


  selector.which('glob', nicolaCID, '**/*', (err, results) => {
    console.log('globbing:', results)
  })

  selector.which('regex', nicolaCID, '.*/*', (err, results) => {
    console.log('regex:', results)
  })

})