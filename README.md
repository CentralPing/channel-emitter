channel-emitter
====================

[![Codeship Status for CentralPing/channel-emitter](https://codeship.com/projects/ec09ced0-ff30-0133-c4c4-0e8044b6a985/status)](https://codeship.com/projects/152745)
[![Build Status](https://travis-ci.org/CentralPing/channel-emitter.svg?branch=master)](https://travis-ci.org/CentralPing/channel-emitter)
[![Code Climate for CentralPing/channel-emitter](https://codeclimate.com/github/CentralPing/channel-emitter/badges/gpa.svg)](https://codeclimate.com/github/CentralPing/channel-emitter)
[![Dependency Status for CentralPing/channel-emitter](https://david-dm.org/CentralPing/channel-emitter.svg)](https://david-dm.org/CentralPing/channel-emitter)

## Installation

`npm i --save channel-emitter`

## What is ChannelEmitter?
  * **A "singleton" EventEmitter** - at its core it is a pseudo-singleton (it relies on the node module cache) [EventEmitter](https://nodejs.org/api/events.html). Every module within a process that requires ChannelEmitter will recieve the same cached object.
  * **A multi-channel emitter** - ChannelEmitter supports channels as well as sub-channels. This allows listeners for an event on specific channels as well as emitting up to parent channels and broadcasting down to sub-channels.

## Features
  * Provides a "singleton" (a node module cached object).
  * Allows name-spacing of events through "channels".
  * Every channel can have multiple sub-channels.
  * A channel can emit to all events on the channel as well as up to all parent channels.
  * A channel can broadcast to all events on the channel as well as down to all sub-channels.

## Examples

### Basic Usage
#### As a singleton
```js
/* a.js */
var channelEmitter = require('channel-emitter');
channelEmitter.on('foo', function () { console.log(arguments); });

/* b.js */
var channelEmitter = require('channel-emitter');
channelEmitter.emit('foo', true, {foo: []}, 123);

/* c.js */
require('./a');
require('./b');
// outputs: { '0': true, '1': { foo: [] }, '2': 123 }
```

#### With channels
```js
/* a.js */
var channelEmitter = require('channel-emitter');
channelEmitter.on('foobar', function () { console.log('foobar: ', arguments); });
channelEmitter.on('foo.bar', function () { console.log('foo.bar: ', arguments); });

channelEmitter.emit('foobar', 'hi');
// returns true;
// outputs: foobar: { 0: 'hi' }

channelEmitter.emit('bar', 'hello');
// returns false;
// outputs:

channelEmitter.emit('foo.foobar', 'hi');
// returns true;
// outputs: foobar: { 0: 'hi' }

channelEmitter.emit('foo.bar', 'hello');
// returns true;
// outputs: foo.bar: { 0: 'hello' }

channelEmitter.broadcast('foobar', 'hi');
// returns true;
// outputs: foobar: { 0: 'hi' }

channelEmitter.broadcast('bar', 'hello');
// returns true;
// outputs: foo.bar: { 0: 'hello' }

channelEmitter.broadcast('foo.foobar', 'hi');
// returns false;
// outputs:

channelEmitter.broadcast('foo.bar', 'hello');
// returns true;
// outputs: foo.bar: { 0: 'hello' }
```

## API Reference
**Example**  
```js
var channel_emitter = require('channel-emitter');
```
<a name="module_channel-emitter..addListener"></a>

### channel-emitter~addListener(eventName, listener) ⇒ <code>ChannelEmitter</code>
Wrapper for the `EventEmitter.addListener` method that will auto-add channels
 if the specified delimiter is used in the name.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the event |
| listener | <code>function</code> | the listener for the event |

<a name="module_channel-emitter..removeListener"></a>

### channel-emitter~removeListener(eventName, listener) ⇒ <code>ChannelEmitter</code>
Wrapper for the `EventEmitter.removeListener` method that will remove
 events from a specified channl if the specified delimiter is used in the name.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the event |
| listener | <code>function</code> | the listener for the event |

<a name="module_channel-emitter..removeAllListeners"></a>

### channel-emitter~removeAllListeners([eventName]) ⇒ <code>ChannelEmitter</code>
Wrapper for the `EventEmitter.removeAllListeners` method that will remove
 if the specified delimiter is used in the name.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [eventName] | <code>string</code> | the name for the event |

<a name="module_channel-emitter..listenerCount"></a>

### channel-emitter~listenerCount(eventName) ⇒ <code>ChannelEmitter</code>
Wrapper for the `EventEmitter.listenerCount` method that will return the
 listener count on a channel (including name-spaced events).

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the event |

<a name="module_channel-emitter..listeners"></a>

### channel-emitter~listeners(eventName) ⇒ <code>ChannelEmitter</code>
Wrapper for the `EventEmitter.listeners` method that will return the
 listeners on a channel (including name-spaced events).

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the event |

<a name="module_channel-emitter..on"></a>

### channel-emitter~on(eventName, listener) ⇒ <code>ChannelEmitter</code>
Wrapper for the `EventEmitter.on` method that will auto-add channels
 if the specified delimiter is used in the name.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the event |
| listener | <code>function</code> | the listener for the event |

<a name="module_channel-emitter..addChannel"></a>

### channel-emitter~addChannel(channelName) ⇒ <code>ChannelEmitter</code>
Adds a sub-channel to the current channel.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| channelName | <code>string</code> | the name for the channel |

<a name="module_channel-emitter..removeChannel"></a>

### channel-emitter~removeChannel(channelName) ⇒ <code>ChannelEmitter</code>
Removes the sub-channel from the current channel.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| channelName | <code>string</code> | the name for the channel |

<a name="module_channel-emitter..emit"></a>

### channel-emitter~emit(eventName, [...args]) ⇒ <code>Boolean</code>
EventEmitter wrapper that emits an event to siblings and direct ancestor
 channels.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the registered event |
| [...args] | <code>\*</code> | arguments to emit to the event |

<a name="module_channel-emitter..broadcast"></a>

### channel-emitter~broadcast(eventName, [...args]) ⇒ <code>Boolean</code>
Broadcasts an event to siblings and descendent channels.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the registered event |
| [...args] | <code>\*</code> | arguments to broadcast to the event |


# License

Apache 2.0
