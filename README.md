# IPLD Selectors

**Warning**: this is a prototype far from being ready!

## Usage

This selector actually implements multiple `strategies`:
- `glob`
- `regex`

See the [examples](https://github.com/nicola/js-ipld-selector/tree/master/examples) for better introduction

### `.which`

Which returns which subsets of the graphs have been matched.

```
.which(strategy, cid, selector, callback)
//[ 'friends', 'friends/0', 'friends/0/name' ]
```

```
```
