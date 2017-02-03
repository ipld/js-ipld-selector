# IPLD Selectors

**Warning**: this is a prototype far from being ready!

## Usage

This selector actually implements multiple `strategies`:
- `glob`
- `regex`

See the [examples](https://github.com/nicola/js-ipld-selector/tree/master/examples) for better introduction

### .which(strategy, cid, selector, callback)

Which returns which subsets of the graphs have been matched.

```
Qml1..
{ name: "Jeremy", nick: "whyrusleeping"}

Qml2
{ name: "Juan", nick: "jdag"}

Qml3
{
  name: "Nicola",
  friends: [
    {'/': "Qml1.."},
    {'/': "Qml2.."}
  ]
}
```

```
.which('regex', cid3, '.*/name', callback)
//[ 'friends/0/name', 'friends/1/name' ]
.which('glob', cid3, '**/name', callback)
//[ 'friends/0/name', 'friends/1/name' ]
```

## License

MIT
