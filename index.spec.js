/* jshint node: true, mocha: true, expr: true */

var faker = require('faker');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;

var channelEmitter = require('./');
var EventEmitter = require('events').EventEmitter;

chai.use(sinonChai);

describe('Module: channel-emitter', function () {
  var spyRootOn;
  var spyRootAddListener;
  var spyForEmit;
  var spyForBroadcast;

  before(function () {
    spyRootOn = sinon.spy();
    spyRootAddListener = sinon.spy();
    spyForEmit = sinon.spy(channelEmitter, 'emit');
    spyForBroadcast = sinon.spy(channelEmitter, 'broadcast');
    channelEmitter.on('rootOn', spyRootOn);
    channelEmitter.addListener('rootAddListner', spyRootAddListener);
  });

  afterEach(function () {
    spyRootOn.reset();
    spyRootAddListener.reset();
    spyForEmit.reset();
    spyForBroadcast.reset();
  });

  it('should be an instance of EventEmitter', function () {
    expect(channelEmitter).to.be.an.instanceof(EventEmitter);
  });

  it('should have a method `addChannel`', function () {
    expect(channelEmitter).to.have.property('addChannel').that.is.a('function');
  });

  it('should have a method `removeChannel`', function () {
    expect(channelEmitter).to.have.property('removeChannel').that.is.a('function');
  });

  it('should have a method `broadcast`', function () {
    expect(channelEmitter).to.have.property('broadcast').that.is.a('function');
  });

  it('should not add an undefined channel', function () {
    expect(channelEmitter.addChannel()).to.be.an.instanceof(EventEmitter);
  });

  it('should add a channel', function () {
    expect(channelEmitter.addChannel('Sub')).to.be.an.instanceof(EventEmitter);
    expect(channelEmitter).to.have.property('Sub').that.is.an.instanceof(EventEmitter);
  });

  it('should not remove an undefined channel', function () {
    expect(channelEmitter.removeChannel()).to.be.an.instanceof(EventEmitter);
  });

  it('should remove a channel', function () {
    expect(channelEmitter.removeChannel('Sub')).to.be.an.instanceof(EventEmitter);
    expect(channelEmitter).not.to.have.property('Sub');
  });

  describe('with `on`', function () {
    it('should emit on the current channel', function () {
      expect(channelEmitter.emit('rootOn', true)).to.be.true;
      expect(spyRootOn).to.have.been.calledOnce;
      expect(spyRootOn).to.have.been.calledWithExactly(true);

      expect(spyForEmit).to.have.been.calledOnce;
      expect(spyForEmit).to.have.been.calledWithExactly('rootOn', true);

      expect(spyForBroadcast).not.to.have.been.called;
      expect(spyRootAddListener).not.to.have.been.called;
    });

    it('should broadcast on the current channel', function () {
      expect(channelEmitter.broadcast('rootOn', true)).to.be.true;
      expect(spyRootOn).to.have.been.calledOnce;
      expect(spyRootOn).to.have.been.calledWithExactly(true);

      expect(spyForBroadcast).to.have.been.calledOnce;
      expect(spyForBroadcast).to.have.been.calledWithExactly('rootOn', true);

      expect(spyForEmit).not.to.have.been.called;
      expect(spyRootAddListener).not.to.have.been.called;
    });
  });

  describe('with `addListener`', function () {
    it('should emit on the current channel', function () {
      expect(channelEmitter.emit('rootAddListner', true)).to.be.true;
      expect(spyRootAddListener).to.have.been.calledOnce;
      expect(spyRootAddListener).to.have.been.calledWithExactly(true);

      expect(spyForEmit).to.have.been.calledOnce;
      expect(spyForEmit).to.have.been.calledWithExactly('rootAddListner', true);

      expect(spyForBroadcast).not.to.have.been.called;
      expect(spyRootOn).not.to.have.been.called;
    });

    it('should broadcast on the current channel', function () {
      expect(channelEmitter.broadcast('rootAddListner', true)).to.be.true;
      expect(spyRootAddListener).to.have.been.calledOnce;
      expect(spyRootAddListener).to.have.been.calledWithExactly(true);

      expect(spyForBroadcast).to.have.been.calledOnce;
      expect(spyForBroadcast).to.have.been.calledWithExactly('rootAddListner', true);

      expect(spyForEmit).not.to.have.been.called;
      expect(spyRootOn).not.to.have.been.called;
    });
  });

  describe('with channels (descendents)', function () {
    var spyForSubA;
    var spyForSubAEmit;
    var spyForSubABroadcast;
    var spyForSubB;
    var spyForSubBEmit;
    var spyForSubBBroadcast;
    var spyForSubASubA;
    var spyForSubASubAEmit;
    var spyForSubASubABroadcast;

    before(function () {
      spyForSubA = sinon.spy();
      channelEmitter.addChannel('SubA');
      channelEmitter.SubA.on('subA', spyForSubA);
      spyForSubAEmit = sinon.spy(channelEmitter.SubA, 'emit');
      spyForSubABroadcast = sinon.spy(channelEmitter.SubA, 'broadcast');
      expect(channelEmitter.SubA._events).to.have.all.keys('subA');

      spyForSubB = sinon.spy();
      channelEmitter.addChannel('SubB');
      channelEmitter.SubB.on('subB', spyForSubB);
      spyForSubBEmit = sinon.spy(channelEmitter.SubB, 'emit');
      spyForSubBBroadcast = sinon.spy(channelEmitter.SubB, 'broadcast');
      expect(channelEmitter.SubB._events).to.have.all.keys('subB');

      spyForSubASubA = sinon.spy();
      channelEmitter.SubA.addChannel('SubA');
      channelEmitter.SubA.SubA.on('subAsubA', spyForSubASubA);
      spyForSubASubAEmit = sinon.spy(channelEmitter.SubA.SubA, 'emit');
      spyForSubASubABroadcast = sinon.spy(channelEmitter.SubA.SubA, 'broadcast');
      expect(channelEmitter.SubA.SubA._events).to.have.all.keys('subAsubA');
    });

    afterEach(function () {
      spyForSubA.reset();
      spyForSubAEmit.reset();
      spyForSubABroadcast.reset();
      spyForSubB.reset();
      spyForSubBEmit.reset();
      spyForSubBBroadcast.reset();
      spyForSubASubA.reset();
      spyForSubASubAEmit.reset();
      spyForSubASubABroadcast.reset();
    });

    it('should be an instance of EventEmitter', function () {
      expect(channelEmitter.SubA).to.be.an.instanceof(EventEmitter);
      expect(channelEmitter.SubA.SubA).to.be.an.instanceof(EventEmitter);
    });

    it('should emit to direct ancestor channels', function () {
      expect(channelEmitter.SubA.SubA.emit('rootOn', true)).to.be.true;
      expect(spyForSubAEmit).to.have.been.calledOnce;
      expect(spyForSubAEmit).to.have.been.calledWithExactly('rootOn', true);
      expect(spyForSubABroadcast).not.to.have.been.called;

      expect(spyForEmit).to.have.been.calledOnce;
      expect(spyForEmit).to.have.been.calledWithExactly('rootOn', true);
      expect(spyForBroadcast).not.to.have.been.called;
    });

    it('should emit to only the intended event', function () {
      expect(channelEmitter.SubA.SubA.emit('rootOn', true)).to.be.true;

      expect(spyRootOn).to.have.been.calledOnce;
      expect(spyRootOn).to.have.been.calledWithExactly(true);

      expect(spyForSubA).not.to.have.been.called;
      expect(spyForSubB).not.to.have.been.called;
      expect(spyForSubASubA).not.to.have.been.called;
    });

    it('should not emit to non-direct ancestor channels', function () {
      expect(channelEmitter.SubA.SubA.emit('rootOn', true)).to.be.true;
      expect(spyForSubBEmit).not.to.have.been.called;
      expect(spyForSubBBroadcast).not.to.have.been.called;
    });

    it('should not emit to descendent channels', function () {
      expect(channelEmitter.emit('subAsubA', true)).to.be.false;
      expect(spyForSubAEmit).not.to.have.been.called;
      expect(spyForSubASubAEmit).not.to.have.been.called;

      expect(spyForSubABroadcast).not.to.have.been.called;
      expect(spyForSubASubABroadcast).not.to.have.been.called;
    });

    it('should broadcast to all descendent channels', function () {
      expect(channelEmitter.broadcast('subAsubA', true)).to.be.true;
      expect(spyForSubABroadcast).to.have.been.calledOnce;
      expect(spyForSubABroadcast).to.have.been.calledWithExactly('subAsubA', true);
      expect(spyForSubAEmit).not.to.have.been.called;

      expect(spyForSubBBroadcast).to.have.been.calledOnce;
      expect(spyForSubBBroadcast).to.have.been.calledWithExactly('subAsubA', true);
      expect(spyForSubBEmit).not.to.have.been.called;

      expect(spyForSubASubABroadcast).to.have.been.calledOnce;
      expect(spyForSubASubABroadcast).to.have.been.calledWithExactly('subAsubA', true);
      expect(spyForSubASubAEmit).not.to.have.been.called;
    });

    it('should broadcast to only the intended event', function () {
      expect(channelEmitter.broadcast('subAsubA', true)).to.be.true;

      expect(spyForSubASubA).to.have.been.calledOnce;
      expect(spyForSubASubA).to.have.been.calledWithExactly(true);

      expect(spyRootOn).not.to.have.been.called;
      expect(spyForSubA).not.to.have.been.called;
      expect(spyForSubB).not.to.have.been.called;
    });

    it('should not broadcast to ancestor channels', function () {
      expect(channelEmitter.SubA.SubA.broadcast('rootOn', true)).to.be.false;
      expect(spyForEmit).not.to.have.been.called;
      expect(spyForSubAEmit).not.to.have.been.called;

      expect(spyForBroadcast).not.to.have.been.called;
      expect(spyForSubABroadcast).not.to.have.been.called;
    });
  });

  describe('with name-spacing (shorthand for channels)', function () {
    var spyForNSubANSubA;
    var spyForNSubAEmit;
    var spyForNSubABroadcast;
    var spyForNSubANSubAEmit;
    var spyForNSubANSubABroadcast;

    before(function () {
      spyForNSubANSubA = sinon.spy();
      channelEmitter.on('NSubA.NSubA.nsubAnsubA', spyForNSubANSubA);

      expect(channelEmitter).to.have.property('NSubA').that.is.an.instanceof(EventEmitter);
      expect(channelEmitter.NSubA).to.have.property('NSubA').that.is.an.instanceof(EventEmitter);
      expect(channelEmitter.NSubA.NSubA._events).to.have.all.keys('nsubAnsubA');

      spyForNSubAEmit = sinon.spy(channelEmitter.NSubA, 'emit');
      spyForNSubABroadcast = sinon.spy(channelEmitter.NSubA, 'broadcast');
      spyForNSubANSubAEmit = sinon.spy(channelEmitter.NSubA.NSubA, 'emit');
      spyForNSubANSubABroadcast = sinon.spy(channelEmitter.NSubA.NSubA, 'broadcast');
    });

    afterEach(function () {
      spyForNSubANSubA.reset();
      spyForNSubAEmit.reset();
      spyForNSubABroadcast.reset();
      spyForNSubANSubAEmit.reset();
      spyForNSubANSubABroadcast.reset();
    });

    it('should emit to the intended event', function () {
      expect(channelEmitter.NSubA.NSubA.emit('nsubAnsubA', true)).to.be.true;

      expect(spyForEmit).to.have.been.calledOnce;
      expect(spyForEmit).to.have.been.calledWithExactly('nsubAnsubA', true);
      expect(spyForNSubABroadcast).not.to.have.been.called;

      expect(spyForNSubAEmit).to.have.been.calledOnce;
      expect(spyForNSubAEmit).to.have.been.calledWithExactly('nsubAnsubA', true);
      expect(spyForNSubABroadcast).not.to.have.been.called;

      expect(spyForNSubANSubAEmit).to.have.been.calledOnce;
      expect(spyForNSubANSubAEmit).to.have.been.calledWithExactly('nsubAnsubA', true);
      expect(spyForNSubANSubABroadcast).not.to.have.been.called;

      expect(spyForNSubANSubA).to.have.been.calledOnce;
      expect(spyForNSubANSubA).to.have.been.calledWithExactly(true);
    });

    it('should emit to the intended event from the name-spaced channel', function () {
      expect(channelEmitter.emit('NSubA.NSubA.nsubAnsubA', true)).to.be.true;

      // The spy records the initial emit from above (which is redicted to the
      //  intended channel)
      expect(spyForEmit).to.have.been.calledTwice;
      expect(spyForEmit.firstCall).to.have.been.calledWithExactly('NSubA.NSubA.nsubAnsubA', true);
      // This is the emit that bubbled up from the redirected emit
      expect(spyForEmit.secondCall).to.have.been.calledWithExactly('nsubAnsubA', true);
      expect(spyForNSubABroadcast).not.to.have.been.called;

      expect(spyForNSubAEmit).to.have.been.calledOnce;
      expect(spyForNSubAEmit).to.have.been.calledWithExactly('nsubAnsubA', true);
      expect(spyForNSubABroadcast).not.to.have.been.called;

      // The spy records this call as the initial emit recorded above but redirected
      //  to this channel
      expect(spyForNSubANSubAEmit).not.to.have.been.called;
      expect(spyForNSubANSubABroadcast).not.to.have.been.called;

      expect(spyForNSubANSubA).to.have.been.calledOnce;
      expect(spyForNSubANSubA).to.have.been.calledWithExactly(true);
    });

    it('should broadcast to the intended event', function () {
      expect(channelEmitter.broadcast('nsubAnsubA', true)).to.be.true;

      expect(spyForEmit).not.to.have.been.called;
      expect(spyForBroadcast).to.have.been.calledOnce;
      expect(spyForBroadcast).to.have.been.calledWithExactly('nsubAnsubA', true);

      expect(spyForNSubAEmit).not.to.have.been.called;
      expect(spyForNSubABroadcast).to.have.been.calledOnce;
      expect(spyForNSubABroadcast).to.have.been.calledWithExactly('nsubAnsubA', true);

      expect(spyForNSubANSubAEmit).not.to.have.been.called;
      expect(spyForNSubANSubABroadcast).to.have.been.calledOnce;
      expect(spyForNSubANSubABroadcast).to.have.been.calledWithExactly('nsubAnsubA', true);

      expect(spyForNSubANSubA).to.have.been.calledOnce;
      expect(spyForNSubANSubA).to.have.been.calledWithExactly(true);
    });

    it('should broadcast to the intended event from the name-spaced channel', function () {
      channelEmitter.broadcast('NSubA.NSubA.nsubAnsubA', true);
      //expect(channelEmitter.broadcast('NSubA.NSubA.nsubAnsubA', true)).to.be.true;

      expect(spyForEmit).not.to.have.been.called;
      // The spy records the initial broadcast from above (which is redicted to the
      //  intended channel)
      expect(spyForBroadcast).to.have.been.calledOnce;
      expect(spyForBroadcast).to.have.been.calledWithExactly('NSubA.NSubA.nsubAnsubA', true);

      expect(spyForNSubAEmit).not.to.have.been.called;
      expect(spyForNSubABroadcast).not.to.have.been.called;

      expect(spyForNSubANSubAEmit).not.to.have.been.called;
      // The spy records this call as the initial broadcast recorded above but redirected
      //  to this channel
      expect(spyForNSubANSubABroadcast).not.to.have.been.called;

      expect(spyForNSubANSubA).to.have.been.calledOnce;
      expect(spyForNSubANSubA).to.have.been.calledWithExactly(true);
    });
  });
});
