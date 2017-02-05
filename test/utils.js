const series = require('async/series')
const dagCBOR = require('ipld-dag-cbor')

exports.NameStore = class NameStore {
  constructor (resolver) {
    this.resolver = resolver
    this.store = {}
  }
  add (name, node, done) {
    let cid
    series([
      (cb) => {
        dagCBOR.util.cid(node, (err, res) => {
          if (err) return cb(err)
          cid = res
          cb()
        })
      },
      (cb) => {
        this.resolver.put({
          node: node,
          cid: cid
        }, cb)
      }
    ], (err, res) => {
      if (err) return done(err)
      this.store[name] = cid
      done(err)
    })
  }
  get (name) {
    return this.store[name]
  }
}
