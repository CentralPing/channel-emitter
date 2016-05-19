/* jshint node: true */

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Emitter;

var rootChar = '^';
var rootCharRegexp = /^\^/;
var nameDelim = '.';
var nameDelimRegexp = /\./;

/**
 * @module channel-emitter
 * @example
```js
var channel_emitter = require('channel-emitter');
```
*/

util.inherits(ChannelEmitter, EventEmitter);
// Override built-in methods
ChannelEmitter.prototype._addListener = ChannelEmitter.prototype.addListener;
ChannelEmitter.prototype.addListener = addListener;
ChannelEmitter.prototype._on = ChannelEmitter.prototype.on;
ChannelEmitter.prototype.on = on;
ChannelEmitter.prototype._emit = ChannelEmitter.prototype.emit;
ChannelEmitter.prototype.emit = emit;
// Add extension methods
ChannelEmitter.prototype.broadcast = broadcast;
ChannelEmitter.prototype.addChannel = addChannel;
ChannelEmitter.prototype.removeChannel = removeChannel;

Emitter = module.exports = new ChannelEmitter();

/**
* @function addListener
* @desc Wrapper for the `EventEmitter.addListener` method that will auto-add channels
*  if the specified delimiter is used in the name.
* @param {string} eventName - the name for the event
* @param {function} listener - the listener for the event
* @return {ChannelEmitter}
*/
function addListener(eventName, listener) {
  return onOrAddListener(this, '_addListener', eventName, listener);
}

/**
* @function removeListener
* @desc Wrapper for the `EventEmitter.removeListener` method that will auto-remove channels
*  if the specified delimiter is used in the name.
* @param {string} eventName - the name for the event
* @param {function} listener - the listener for the event
* @return {ChannelEmitter}
*/
function removeListener(eventName, listener) {
  var channelAndEventName = getChannelAndEventName(this, eventName);

  if (channelAndEventName.channel) {
    channelAndEventName.channel._removeListener(channelAndEventName.eventName, listener);
  }

  return this;
}

/**
* @function on
* @desc Wrapper for the `EventEmitter.on` method that will auto-add channels
*  if the specified delimiter is used in the name.
* @param {string} eventName - the name for the event
* @param {function} listener - the listener for the event
* @return {ChannelEmitter}
*/
function on(eventName, listener) {
  return onOrAddListener(this, '_on', eventName, listener);
}

/**
* @function addChannel
* @desc Adds a sub-channel to the current channel.
* @param {string} channelName - the name for the channel
* @return {ChannelEmitter}
*/
function addChannel(channelName) {
  if (channelName && this[channelName] === undefined) {
    this[channelName] = new ChannelEmitter(this);
    this._channels.push(channelName);
  }

  return this;
}

/**
* @function removeChannel
* @desc Removes the sub-channel from the current channel.
* @param {string} channelName - the name for the channel
* @return {ChannelEmitter}
*/
function removeChannel(channelName) {
  var index = this._channels.indexOf(channelName);

  if (index > -1) {
    this._channels.splice(index, 1);
    delete this[channelName];
  }

  return this;
}

/**
* @function emit
* @desc EventEmitter wrapper that emits an event to siblings and direct ancestor
*  channels.
* @param {string} eventName - the name for the registered event
* @param {arguments} arguments - arguments to emit to the event
* @return {Boolean}
*/
function emit() {
  var channelAndEventName = getChannelAndEventName(this, arguments[0]);
  var channel = channelAndEventName.channel;
  var emittedOnChannel = false;
  var emittedToParent = false;

  if (channel) {
    // Replace the event name with the name-spaced name
    Array.prototype.splice.call(arguments, 0, 1, channelAndEventName.eventName);

    emittedOnChannel = channel._emit.apply(channel, arguments);
    emittedToParent = channel._parent && channel._parent.emit.apply(channel._parent, arguments) || false;
  }

  return emittedOnChannel || emittedToParent;
}

/**
* @function broadcast
* @desc Emits an event to siblings and descendent channels.
* @param {string} eventName - the name for the registered event
* @param {arguments} arguments - arguments to emit to the event
* @return {Boolean}
*/
function broadcast() {
  var channelAndEventName = getChannelAndEventName(this, arguments[0]);
  var curChannel = channelAndEventName.channel;
  var emittedOnChannel = false;
  var emittedToSubChannels = false;
  var args = arguments;

  if (curChannel) {
    // Replace the event name with the name-spaced name
    // `args` is a reference to `arguments` so any changes to either affect both
    Array.prototype.splice.call(arguments, 0, 1, channelAndEventName.eventName);

    emittedOnChannel = curChannel._emit.apply(curChannel, arguments);
    emittedToSubChannels = curChannel._channels.reduce(function emitToSubChannel(received, channel) {
      var emittedToSubChannel = curChannel[channel].broadcast.apply(curChannel[channel], args);

      return received || emittedToSubChannel;
    }, emittedToSubChannels);
  }

  return emittedOnChannel || emittedToSubChannels;
}

/*****************/
// Constructor function
/*****************/
function ChannelEmitter(parent) {
  EventEmitter.call(this);

  this._channels = [];

  if (parent) {
    this._parent = parent;
  }
}

/*****************/
// Helper functions
/*****************/

function addChannelsFromEventName(curChannel, eventName) {
  return processChannelsFromEventName(curChannel, eventName, function (cur, channel) {
    cur.addChannel(channel);

    return cur[channel];
  });
}

function getChannelAndEventName(curChannel, eventName) {
  return processChannelsFromEventName(curChannel, eventName, function (cur, channel) {
    return cur && cur[channel];
  });
}

function processChannelsFromEventName(curChannel, eventName, reduceFn) {
  var channels;

  if (nameDelimRegexp.test(eventName)) {
    channels = eventName.split(nameDelim);
    eventName = channels.pop();

    // Start from root if eventName begins with a '^''
    if (rootCharRegexp.test(channels[0])) {
      channels[0] = channels[0].slice(1);

      while (curChannel._parent) {
        curChannel = curChannel._parent;
      }
    }

    curChannel = channels.reduce(reduceFn, curChannel);
  }

  return { channel: curChannel, eventName: eventName};
}

function onOrAddListener(channel, method, eventName, listener) {
  var channelAndEventName = addChannelsFromEventName(channel, eventName);

  channelAndEventName.channel[method](channelAndEventName.eventName, listener);

  return channel;
}

function removeIfChannelEmpty(channel) {
  var parent = channel._parent;

  if (parent && channel.listenerCount === 0 && channel._channels.length === 0) {
    return parent.removeChannel();
  }
}
