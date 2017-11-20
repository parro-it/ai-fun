# ai-fun

A collection of modules to easy deal with async iterables

# Modules list

* [asynciterable](https://github.com/parro-it/asynciterable) - Basic async iterable class with buffer.
* [ai-concat](https://github.com/parro-it/ai-concat) - Concat an async iterable into a promise.
* [ai-from-stream](https://github.com/parro-it/ai-from-stream) - create an async iterable from a stream.
* [ai-event](https://github.com/parro-it/ai-event) - Create an async iterable from an event emitter.
* [ai-filter](https://github.com/parro-it/ai-filter) - Filter over async iterables.
* [ai-lines](https://github.com/parro-it/ai-lines) - Split an async iterable into lines.
* [is-async-iterable](https://github.com/parro-it/is-async-iterable) - Checks if a given object is async iterable.
* [ai-reduce](https://github.com/parro-it/ai-reduce) - Reduce for async iterables.
* [ai-node](https://github.com/parro-it/ai-node) - Node wrappers that returns async iterables and promises.

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










