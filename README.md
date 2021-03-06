# ai-fun

A collection of modules to easy deal with async iterables

# Modules list

* [ai-event](https://github.com/parro-it/ai-event#readme) - Create an async iterable from an event emitter.
* [ai-node](https://github.com/parro-it/ai-node#readme) - Node wrappers that returns async iterables and promises.
* [ai-asfullfills](https://github.com/parro-it/ai-asfullfills#readme) - Return an aync iterable that emit a series promises as they fullfills
* [ai-merge](https://github.com/parro-it/ai-merge#readme) - Parallel merge of multiple async iterable.
* [ai-filter](https://github.com/parro-it/ai-filter#readme) - Filter over async iterables.
* [ai-lines](https://github.com/parro-it/ai-lines#readme) - Split an async iterable into lines.
* [ai-map](https://github.com/parro-it/ai-map#readme) - Map over async iterables
* [ai-sequence](https://github.com/parro-it/ai-sequence#readme) - Serial  merge of multiple async iterable.
* [ai-concat](https://github.com/parro-it/ai-concat#readme) - Concat an async iterable into a promise
* [ai-reduce](https://github.com/parro-it/ai-reduce#readme) - Reduce for async iterables.
* [asynciterable](https://github.com/parro-it/asynciterable#readme) - Async iterable class
* [ai-from-stream](https://github.com/parro-it/ai-from-stream#readme) - create an async iterable from a stream
* [ai-log](https://github.com/parro-it/ai-log#readme) - Tap into an async iterable pipeline and log all chunks passing through
* [ai-tap](https://github.com/parro-it/ai-tap#readme) - Tap into an async iterable chain without affecting its value or state.
* [is-async-iterable](https://github.com/parro-it/is-async-iterable#readme) - Checks if a given object is async iterable.



# Common conventions

All ai-fun modules follows a set of common conventions to improve interoperability within the modules.

* _Currying_

Currying is a common functional tecnique made popular by early functional languages.
It allow to transform a function with arity > 1 in a unary function, by partially applying a set of argument to the function:

```js
curriedFunction(a)(b)(c) === curriedFunction(a, b, c)
```

The advantage of using unary functions is that you can use it
as arguments in higher order function:

```js
const fetchUrl = curried((options, url) => {})
const docs = urlArr.map(fetchUrl({method: post}))
```

Within the javascript community, currying was popularized by
libraries like [ramda](https://github.com/ramda/ramda), but as
[explained by Dr. Axel Rauschmayer](http://2ality.com/2017/11/currying-in-js.html) with his consuete deepness, it has some
drawbacks.

Normal currying has another characteritic that greatly
effect async functions: if you return a function in a async function,
the caller get a promise of a function, making the caller site syntax
ugly:

```
const fetchUrl = curried(async (options, url) => {})
const docs = urlArr.map(await fetchUrl({method: post}))
```

And things get worse if the function is an async generator:

```
const fetchUrl = await curried(async function * (options, url) => {})
const docs = urlArr.map((await fetchUrl({method: post}).next()).value)
```


So, ai-fun modules take a different approach: each function
has an `with` method that partially apply it's arguments to the main
function, returning a unary function that accept the data
(or context, or main) parameter.

For example, to transform the `reduce` function in unary
one:

```js
const sum = reduce.with((acc, val) => acc + val, 0)
console.log(await sum([1, 2 ,3]))
// output 6
```

* _Versioning_

All `ai-fun` modules started with version 1 and follows [semantic versioning](https://semver.org/).
All major version bumping will happen at the same time for all of the modules.

* _Iteration lazyness_

for await vs map -> lower order iterables are iterated only when needed
(optionally?)



