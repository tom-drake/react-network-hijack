# React Network Hijack

The aim for this library is to provide an easy way to mock network requests in a browser while using React components. This was originally developed with the intent of being used as part of your stories in [Storybook](https://github.com/storybooks/storybook) but there is no reason it shouldn't work with a framework which runs in the browser.

## Getting Started

To use this in your stories or other browser tests you can specify a set of urls, their methods to mock and what data to return as options to the HoC and then pass your own component in.

```js
import withNetworkMock from "react-network-hijack";

const NetworkMocked = withNetworkMock({
  GET: {
    "https://jsonplaceholder.typicode.com/todos/1": {
      body: {
        ...
      },
      status: 200,
      delay: 200
    }
  },
  POST: {
    ...
  }
})(MyComponent);
```

The top level object contains the methods to mock. For each of these methods you can mock individual urls with a set of options.

- body:
  - Type: Object or String
  - Required: Yes
  - Usage: The body content to return. If an object is passed it will be stringified as JSON else the String will be passed along.
- status:
  - Type: Number
  - Required: No (default: 200)
  - Usage: The response status to return.
- delay:
  - Type: Number
  - Required: No (default: 50ms)
  - Usage: The amount of delay a network request should have.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
