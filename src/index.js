const minimatch = require('minimatch')

const join = require('path').join
const series = require('async').series
const parallel = require('async').parallel
const Regex = require('regex')

module.exports = class IPLDSelector {
  constructor (ipldResolver) {
    this.resolver = ipldResolver
  }

  tree (cid, path, callback) {
    if (path === '') {
      this.resolver.get(cid, callback)
    } else {
      this.resolver.resolve(cid, path, callback)
    }
  }

  // TODO: note cid might be a path in first place!
  // TODO: doing this type of DFS is a bad idea
  treeAll (cid, path, callback) {
    let list = []

    this.tree(cid, path, (err, node) => {
      if (err) return callback(err)
      if (typeof node === 'undefined') {
        return callback(new Error("Path shouldn't reach here"))
      }

      const keys = Object.keys(node)

      keys
        .forEach(key => {
          list.push(join(path, key))
        })

      const exploreCallbacks = keys
        .filter(key => {
          return typeof node[key] === 'object' || node[key] === '/'
        })
        .map(key => {
          return (cb) => {
            this.treeAll(cid, join(path, key), (err, newList) => {
              if (err) return cb(err)

              list = list.concat(newList)
              cb(err, newList)
            })
          }
        })

      parallel(exploreCallbacks, (err) => {
        if (err) {
          return callback(err)
        }
        callback(null, list)
      })
    })
  }

  glob (cid, selector, callback) {
    this.treeAll(cid, '', (err, list) => {
      if (err) return callback(err)

      const matches = minimatch.match(
        list,
        selector,
        {matchBase: true}
      )

      callback(null, matches)
    })
  }

  regex (cid, selector, callback) {
    this.treeAll(cid, '', (err, list) => {
      if (err) return callback(err)

      var regex = new RegExp(selector)
      const matches = list.filter(path => regex.test(path))
      callback(null, matches)
    })
  }

  which (strategy, cid, selector, callback) {
    if (strategy === 'glob') {
      return this.glob(cid, selector, callback)
    }
    if (strategy === 'regex') {
      return this.regex(cid, selector, callback)
    }
  }
}
