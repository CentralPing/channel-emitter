channel-emitter
====================

[![Codeship Status for CentralPing/channel-emitter](https://codeship.com/projects/ec09ced0-ff30-0133-c4c4-0e8044b6a985/status)](https://codeship.com/projects/152745)
[![Build Status](https://travis-ci.org/CentralPing/channel-emitter.svg?branch=master)](https://travis-ci.org/CentralPing/channel-emitter)
[![Code Climate for CentralPing/channel-emitter](https://codeclimate.com/github/CentralPing/channel-emitter/badges/gpa.svg)](https://codeclimate.com/github/CentralPing/channel-emitter)
[![Dependency Status for CentralPing/channel-emitter](https://david-dm.org/CentralPing/channel-emitter.svg)](https://david-dm.org/CentralPing/channel-emitter)

## Installation

`npm i --save channel-emitter`

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
Wrapper for the `EventEmitter.removeListener` method that will auto-remove channels
 if the specified delimiter is used in the name.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the event |
| listener | <code>function</code> | the listener for the event |

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

### channel-emitter~emit(eventName, arguments) ⇒ <code>Boolean</code>
EventEmitter wrapper that emits an event to siblings and direct ancestor
 channels.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the registered event |
| arguments | <code>arguments</code> | arguments to emit to the event |

<a name="module_channel-emitter..broadcast"></a>

### channel-emitter~broadcast(eventName, arguments) ⇒ <code>Boolean</code>
Emits an event to siblings and descendent channels.

**Kind**: inner method of <code>[channel-emitter](#module_channel-emitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | the name for the registered event |
| arguments | <code>arguments</code> | arguments to emit to the event |


## Examples

### With Strings
```js
var channelEmitter = require('channel-emitter');

```

# License

Apache 2.0
