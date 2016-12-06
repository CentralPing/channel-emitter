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
    expect(channelEmitter.addChannel('RemoveMe')).to.be.an.instanceof(EventEmitter);
    expect(channelEmitter).to.have.property('RemoveMe').that.is.an.instanceof(EventEmitter);
  });

  it('should not remove an undefined channel', function () {
    expect(channelEmitter.removeChannel()).to.be.an.instanceof(EventEmitter);
  });

  it('should remove a channel', function () {
    expect(channelEmitter.removeChannel('RemoveMe')).to.be.an.instanceof(EventEmitter);
    expect(channelEmitter).not.to.have.property('RemoveMe');
  });

  describe('with instance', function () {
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
      expect(channelEmitter.listenerCount('rootOn')).to.equal(1);
      channelEmitter.addListener('rootAddListner', spyRootAddListener);
      expect(channelEmitter.listenerCount('rootAddListner')).to.equal(1);
    });

    afterEach(function () {
      spyRootOn.reset();
      spyRootAddListener.reset();
      spyForEmit.reset();
      spyForBroadcast.reset();
    });

    if (channelEmitter.eventNames) {
      describe('with `eventNames`', function () {
        it('should list all the event names registered on the current channel', function () {
          expect(channelEmitter.eventNames()).to.have.all.members(['rootOn', 'rootAddListner']);
        });
      });
    }

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

    describe('with `removeListener`', function () {
      var spyRemoveMeListener;

      before(function () {
        spyRemoveMeListener = sinon.spy();
      });

      beforeEach(function () {
        channelEmitter.addListener('removeMe', spyRemoveMeListener);
        expect(channelEmitter.listenerCount('removeMe')).to.equal(1);
      });

      afterEach(function () {
        spyRemoveMeListener.reset();
      });

      it('should not have a listener for an emit', function () {
        expect(channelEmitter.removeListener('removeMe', spyRemoveMeListener)).to.be.an.instanceof(EventEmitter);
        expect(channelEmitter.listenerCount('removeMe')).to.equal(0);

        expect(channelEmitter.emit('removeMe', true)).to.be.false;
        expect(spyRemoveMeListener).not.to.have.been.called;
      });

      it('should not have a listener for a broadcast', function () {
        expect(channelEmitter.removeListener('removeMe', spyRemoveMeListener)).to.be.an.instanceof(EventEmitter);
        expect(channelEmitter.listenerCount('removeMe')).to.equal(0);

        expect(channelEmitter.broadcast('removeMe', true)).to.be.false;
        expect(spyRemoveMeListener).not.to.have.been.called;
      });

      it('should not remove listener if wrong channel specified', function () {
        expect(channelEmitter.removeListener('foo.removeMe', spyRemoveMeListener)).to.be.an.instanceof(EventEmitter);
        expect(channelEmitter.listenerCount('removeMe')).to.equal(1);

        expect(channelEmitter.emit('removeMe', true)).to.be.true;
        expect(spyRemoveMeListener).to.have.been.calledOnce;
      });
    });

    describe('with `once`', function () {
      var spyOnceListener;

      before(function () {
        spyOnceListener = sinon.spy();
      });

      beforeEach(function () {
        channelEmitter.once('once', spyOnceListener);
        expect(channelEmitter.listenerCount('once')).to.equal(1);
      });

      afterEach(function () {
        spyOnceListener.reset();
      });

      it('should emit once and be removed', function () {
        expect(channelEmitter.emit('once', true)).to.be.true;
        expect(channelEmitter.listenerCount('once')).to.equal(0);

        expect(channelEmitter.emit('once', true)).to.be.false;

        expect(spyOnceListener).to.have.been.calledOnce;
        expect(spyOnceListener.firstCall).to.have.been.calledWithExactly(true);
      });

      it('should broadcast once and be removed', function () {
        expect(channelEmitter.broadcast('once', true)).to.be.true;
        expect(channelEmitter.listenerCount('once')).to.equal(0);

        expect(channelEmitter.broadcast('once', true)).to.be.false;

        expect(spyOnceListener).to.have.been.calledOnce;
        expect(spyOnceListener.firstCall).to.have.been.calledWithExactly(true);
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
        expect(channelEmitter.SubA.listenerCount('subA')).to.equal(1);

        spyForSubB = sinon.spy();
        channelEmitter.addChannel('SubB');
        channelEmitter.SubB.on('subB', spyForSubB);
        spyForSubBEmit = sinon.spy(channelEmitter.SubB, 'emit');
        spyForSubBBroadcast = sinon.spy(channelEmitter.SubB, 'broadcast');
        expect(channelEmitter.SubB.listenerCount('subB')).to.equal(1);

        spyForSubASubA = sinon.spy();
        channelEmitter.SubA.addChannel('SubA');
        channelEmitter.SubA.SubA.on('subAsubA', spyForSubASubA);
        spyForSubASubAEmit = sinon.spy(channelEmitter.SubA.SubA, 'emit');
        spyForSubASubABroadcast = sinon.spy(channelEmitter.SubA.SubA, 'broadcast');
        expect(channelEmitter.SubA.SubA.listenerCount('subAsubA')).to.equal(1);
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

      if (channelEmitter.eventNames) {
        it('should list all the event names registered on the current channel', function () {
          expect(channelEmitter.SubA.eventNames()).to.have.all.members(['subA']);
          expect(channelEmitter.SubB.eventNames()).to.have.all.members(['subB']);
          expect(channelEmitter.SubA.SubA.eventNames()).to.have.all.members(['subAsubA']);
        });
      }
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
        expect(channelEmitter.NSubA.NSubA.listenerCount('nsubAnsubA')).to.equal(1);

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

      it('should count listeners for the intended event', function () {
        expect(channelEmitter.listenerCount('NSubA.NSubA.nsubAnsubA')).to.equal(1);
      });

      it('should return 0 without an event name', function () {
        expect(channelEmitter.listenerCount('NSubA.NSubA')).to.equal(0);
      });

      it('should return 0 from a non-existent event', function () {
        expect(channelEmitter.listenerCount('NSubA.NSubA.nsubB')).to.equal(0);
      });

      it('should return 0 from a non-existent channel', function () {
        expect(channelEmitter.listenerCount('NSubA.NSubB.nsubAnsubA')).to.equal(0);
      });

      it('should return listeners from the intended event', function () {
        expect(channelEmitter.listeners('NSubA.NSubA.nsubAnsubA')).to.deep.equal([spyForNSubANSubA]);
      });

      it('should return an empty array without an event name', function () {
        expect(channelEmitter.listeners('NSubA.NSubA')).to.be.an('array');
        expect(channelEmitter.listeners('NSubA.NSubA')).to.be.empty;
      });

      it('should return an empty array from a non-existent event', function () {
        expect(channelEmitter.listeners('NSubA.NSubA.nsubB')).to.be.an('array');
        expect(channelEmitter.listeners('NSubA.NSubA.nsubB')).to.be.empty;
      });

      it('should return an empty array from a non-existent channel', function () {
        expect(channelEmitter.listeners('NSubA.NSubB.nsubAnsubA')).to.be.an('array');
        expect(channelEmitter.listeners('NSubA.NSubB.nsubAnsubA')).to.be.empty;
      });

      it('should remove all listeners from a channel', function () {
        var spy = sinon.spy();

        channelEmitter.on('removeMe.foo', spy);
        channelEmitter.on('removeMe.foo', spy);
        channelEmitter.on('removeMe.bar', spy);

        expect(channelEmitter.listenerCount('removeMe.foo')).to.equal(2);
        expect(channelEmitter.listenerCount('removeMe.bar')).to.equal(1);

        expect(channelEmitter.removeAllListeners('removeMe.bar')).to.be.an.instanceof(EventEmitter);

        expect(channelEmitter.listenerCount('removeMe.foo')).to.equal(2);
        expect(channelEmitter.listenerCount('removeMe.bar')).to.equal(0);

        expect(channelEmitter.removeAllListeners('removeMe')).to.be.an.instanceof(EventEmitter);

        expect(channelEmitter.listenerCount('removeMe.foo')).to.equal(0);
        expect(channelEmitter.listenerCount('removeMe.bar')).to.equal(0);

        channelEmitter.emit('removeMe.foo', true);
        expect(spy).not.to.have.been.called;

        // Cleanup
        channelEmitter.removeChannel('removeMe');
      });

      it('should return the channel even if channel/event does not exist', function () {
        expect(channelEmitter.removeAllListeners('removeMe.bar')).to.be.an.instanceof(EventEmitter);
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

      it('should not emit to/from non-existent channels', function () {
        expect(channelEmitter.emit('foo.rootOn', true)).to.be.false;
        expect(spyRootOn).not.to.have.been.called;
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

      it('should not broadcast to/from non-existent channels', function () {
        expect(channelEmitter.broadcast('foo.rootOn', true)).to.be.false;
      });

      if (channelEmitter.eventNames) {
        it('should list all the event names registered on the specified channel', function () {
          expect(channelEmitter.eventNames('NSubA.NSubA')).to.have.all.members(['nsubAnsubA']);
        });
      }

      describe('with relative names (default)', function () {
        var spyForNSubANSubB;

        before(function () {
          spyForNSubANSubB = sinon.spy();
        });

        it('should add a listener relative to the current channel', function () {
          channelEmitter.NSubA.addListener('NSubB.nsubAnsubB', spyForNSubANSubB);

          expect(channelEmitter.NSubA).to.have.property('NSubB').that.is.an.instanceof(EventEmitter);
          expect(channelEmitter.NSubA.NSubB.listenerCount('nsubAnsubB')).to.equal(1);
        });

        it('should remove a listener relative to the current channel', function () {
          channelEmitter.NSubA.removeListener('NSubB.nsubAnsubB', spyForNSubANSubB);

          expect(channelEmitter.NSubA).to.have.property('NSubB').that.is.an.instanceof(EventEmitter);
          expect(channelEmitter.NSubA.NSubB.listenerCount('nsubAnsubB')).to.equal(0);
        });

        if (channelEmitter.eventNames) {
          it('should list all the event names registered on the relative to the current channel', function () {
            expect(channelEmitter.NSubA.eventNames('NSubA')).to.have.all.members(['nsubAnsubA']);
          });
        }
      });

      describe('with absolute names (starts with "^")', function () {
        var spyForNSubB;

        before(function () {
          spyForNSubB = sinon.spy();
        });

        it('should add a listener to the specified channel', function () {
          channelEmitter.NSubA.addListener('^NSubB.nsubB', spyForNSubB);

          expect(channelEmitter).to.have.property('NSubB').that.is.an.instanceof(EventEmitter);
          expect(channelEmitter.NSubB.listenerCount('nsubB')).to.equal(1);
        });

        it('should remove a listener from the specified channel', function () {
          channelEmitter.NSubA.removeListener('^NSubB.nsubB', spyForNSubB);

          expect(channelEmitter).to.have.property('NSubB').that.is.an.instanceof(EventEmitter);
          expect(channelEmitter.NSubB.listenerCount('nsubB')).to.equal(0);
        });

        if (channelEmitter.eventNames) {
          it('should list all the event names registered on the specified channel', function () {
            expect(channelEmitter.NSubB.eventNames('^NSubA.NSubA')).to.have.all.members(['nsubAnsubA']);
          });
        }
      });
    });
  });
});
