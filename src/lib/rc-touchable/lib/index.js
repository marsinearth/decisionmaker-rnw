// inspired by react-native
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _crc = require("create-react-class");

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function keyMirror(obj) {
    Object.keys(obj).forEach(function (k) {
        return obj[k] = k;
    });
    return obj;
}
function copy(from, list) {
    var to = {};
    list.forEach(function (k) {
        to[k] = from[k];
    });
    return to;
}
function extractSingleTouch(nativeEvent) {
    var touches = nativeEvent.touches;
    var changedTouches = nativeEvent.changedTouches;
    var hasTouches = touches && touches.length > 0;
    var hasChangedTouches = changedTouches && changedTouches.length > 0;
    return !hasTouches && hasChangedTouches ? changedTouches[0] : hasTouches ? touches[0] : nativeEvent;
}
/**
 * Touchable states.
 */
var States = keyMirror({
    NOT_RESPONDER: null,
    RESPONDER_INACTIVE_PRESS_IN: null,
    RESPONDER_INACTIVE_PRESS_OUT: null,
    RESPONDER_ACTIVE_PRESS_IN: null,
    RESPONDER_ACTIVE_PRESS_OUT: null,
    RESPONDER_ACTIVE_LONG_PRESS_IN: null,
    RESPONDER_ACTIVE_LONG_PRESS_OUT: null,
    ERROR: null
});
/**
 * Quick lookup map for states that are considered to be "active"
 */
var IsActive = {
    RESPONDER_ACTIVE_PRESS_OUT: true,
    RESPONDER_ACTIVE_PRESS_IN: true
};
/**
 * Quick lookup for states that are considered to be "pressing" and are
 * therefore eligible to result in a "selection" if the press stops.
 */
var IsPressingIn = {
    RESPONDER_INACTIVE_PRESS_IN: true,
    RESPONDER_ACTIVE_PRESS_IN: true,
    RESPONDER_ACTIVE_LONG_PRESS_IN: true
};
var IsLongPressingIn = {
    RESPONDER_ACTIVE_LONG_PRESS_IN: true
};
/**
 * Inputs to the state machine.
 */
var Signals = keyMirror({
    DELAY: null,
    RESPONDER_GRANT: null,
    RESPONDER_RELEASE: null,
    RESPONDER_TERMINATED: null,
    ENTER_PRESS_RECT: null,
    LEAVE_PRESS_RECT: null,
    LONG_PRESS_DETECTED: null
});
/**
 * Mapping from States x Signals => States
 */
var Transitions = {
    NOT_RESPONDER: {
        DELAY: States.ERROR,
        RESPONDER_GRANT: States.RESPONDER_INACTIVE_PRESS_IN,
        RESPONDER_RELEASE: States.ERROR,
        RESPONDER_TERMINATED: States.ERROR,
        ENTER_PRESS_RECT: States.ERROR,
        LEAVE_PRESS_RECT: States.ERROR,
        LONG_PRESS_DETECTED: States.ERROR
    },
    RESPONDER_INACTIVE_PRESS_IN: {
        DELAY: States.RESPONDER_ACTIVE_PRESS_IN,
        RESPONDER_GRANT: States.ERROR,
        RESPONDER_RELEASE: States.NOT_RESPONDER,
        RESPONDER_TERMINATED: States.NOT_RESPONDER,
        ENTER_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_IN,
        LEAVE_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_OUT,
        LONG_PRESS_DETECTED: States.ERROR
    },
    RESPONDER_INACTIVE_PRESS_OUT: {
        DELAY: States.RESPONDER_ACTIVE_PRESS_OUT,
        RESPONDER_GRANT: States.ERROR,
        RESPONDER_RELEASE: States.NOT_RESPONDER,
        RESPONDER_TERMINATED: States.NOT_RESPONDER,
        ENTER_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_IN,
        LEAVE_PRESS_RECT: States.RESPONDER_INACTIVE_PRESS_OUT,
        LONG_PRESS_DETECTED: States.ERROR
    },
    RESPONDER_ACTIVE_PRESS_IN: {
        DELAY: States.ERROR,
        RESPONDER_GRANT: States.ERROR,
        RESPONDER_RELEASE: States.NOT_RESPONDER,
        RESPONDER_TERMINATED: States.NOT_RESPONDER,
        ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_IN,
        LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_OUT,
        LONG_PRESS_DETECTED: States.RESPONDER_ACTIVE_LONG_PRESS_IN
    },
    RESPONDER_ACTIVE_PRESS_OUT: {
        DELAY: States.ERROR,
        RESPONDER_GRANT: States.ERROR,
        RESPONDER_RELEASE: States.NOT_RESPONDER,
        RESPONDER_TERMINATED: States.NOT_RESPONDER,
        ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_IN,
        LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_PRESS_OUT,
        LONG_PRESS_DETECTED: States.ERROR
    },
    RESPONDER_ACTIVE_LONG_PRESS_IN: {
        DELAY: States.ERROR,
        RESPONDER_GRANT: States.ERROR,
        RESPONDER_RELEASE: States.NOT_RESPONDER,
        RESPONDER_TERMINATED: States.NOT_RESPONDER,
        ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_IN,
        LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_OUT,
        LONG_PRESS_DETECTED: States.RESPONDER_ACTIVE_LONG_PRESS_IN
    },
    RESPONDER_ACTIVE_LONG_PRESS_OUT: {
        DELAY: States.ERROR,
        RESPONDER_GRANT: States.ERROR,
        RESPONDER_RELEASE: States.NOT_RESPONDER,
        RESPONDER_TERMINATED: States.NOT_RESPONDER,
        ENTER_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_IN,
        LEAVE_PRESS_RECT: States.RESPONDER_ACTIVE_LONG_PRESS_OUT,
        LONG_PRESS_DETECTED: States.ERROR
    },
    error: {
        DELAY: States.NOT_RESPONDER,
        RESPONDER_GRANT: States.RESPONDER_INACTIVE_PRESS_IN,
        RESPONDER_RELEASE: States.NOT_RESPONDER,
        RESPONDER_TERMINATED: States.NOT_RESPONDER,
        ENTER_PRESS_RECT: States.NOT_RESPONDER,
        LEAVE_PRESS_RECT: States.NOT_RESPONDER,
        LONG_PRESS_DETECTED: States.NOT_RESPONDER
    }
};
// ==== Typical Constants for integrating into UI components ====
// const HIT_EXPAND_PX = 20;
// const HIT_VERT_OFFSET_PX = 10;
var HIGHLIGHT_DELAY_MS = 130;
var PRESS_EXPAND_PX = 20;
var LONG_PRESS_THRESHOLD = 500;
var LONG_PRESS_DELAY_MS = LONG_PRESS_THRESHOLD - HIGHLIGHT_DELAY_MS;
var LONG_PRESS_ALLOWED_MOVEMENT = 10;
var lastClickTime = 0;
var pressDelay = 200;
function isAllowPress() {
    // avoid click penetration
    return Date.now() - lastClickTime >= pressDelay;
}
var Touchable = _crc({
    displayName: 'Touchable',
    getDefaultProps: function getDefaultProps() {
        return {
            disabled: false,
            delayPressIn: HIGHLIGHT_DELAY_MS,
            delayLongPress: LONG_PRESS_DELAY_MS,
            delayPressOut: 100,
            pressRetentionOffset: {
                left: PRESS_EXPAND_PX,
                right: PRESS_EXPAND_PX,
                top: PRESS_EXPAND_PX,
                bottom: PRESS_EXPAND_PX
            },
            hitSlop: undefined,
            longPressCancelsPress: true
        };
    },
    getInitialState: function getInitialState() {
        return {
            active: false
        };
    },
    componentWillMount: function componentWillMount() {
        this.touchable = { touchState: undefined };
    },
    componentDidMount: function componentDidMount() {
        this.root = _reactDom2["default"].findDOMNode(this);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // disabled auto clear active state
        if (nextProps.disabled && this.state.active) {
            this.setState({
                active: false
            });
        }
    },
    componentDidUpdate: function componentDidUpdate() {
        this.root = _reactDom2["default"].findDOMNode(this);
    },
    componentWillUnmount: function componentWillUnmount() {
        if (this.releaseLockTimer) {
            clearTimeout(this.releaseLockTimer);
        }
        if (this.touchableDelayTimeout) {
            clearTimeout(this.touchableDelayTimeout);
        }
        if (this.longPressDelayTimeout) {
            clearTimeout(this.longPressDelayTimeout);
        }
        if (this.pressOutDelayTimeout) {
            clearTimeout(this.pressOutDelayTimeout);
        }
    },
    callChildEvent: function callChildEvent(event, e) {
        var childHandle = this.props.children.props[event];
        if (childHandle) {
            childHandle(e);
        }
    },
    onTouchStart: function onTouchStart(e) {
        this.callChildEvent('onTouchStart', e);
        this.lockMouse = true;
        if (this.releaseLockTimer) {
            clearTimeout(this.releaseLockTimer);
        }
        this.touchableHandleResponderGrant(e.nativeEvent);
    },
    onTouchMove: function onTouchMove(e) {
        this.callChildEvent('onTouchMove', e);
        this.touchableHandleResponderMove(e.nativeEvent);
    },
    onTouchEnd: function onTouchEnd(e) {
        var _this = this;

        this.callChildEvent('onTouchEnd', e);
        this.releaseLockTimer = setTimeout(function () {
            _this.lockMouse = false;
        }, 300);
        this.touchableHandleResponderRelease(e.nativeEvent);
    },
    onTouchCancel: function onTouchCancel(e) {
        var _this2 = this;

        this.callChildEvent('onTouchCancel', e);
        this.releaseLockTimer = setTimeout(function () {
            _this2.lockMouse = false;
        }, 300);
        this.touchableHandleResponderTerminate(e.nativeEvent);
    },
    onMouseDown: function onMouseDown(e) {
        this.callChildEvent('onMouseDown', e);
        if (this.lockMouse) {
            return;
        }
        this.touchableHandleResponderGrant(e.nativeEvent);
        document.addEventListener('mousemove', this.touchableHandleResponderMove, false);
        document.addEventListener('mouseup', this.onMouseUp, false);
    },
    onMouseUp: function onMouseUp(e) {
        document.removeEventListener('mousemove', this.touchableHandleResponderMove, false);
        document.removeEventListener('mouseup', this.onMouseUp, false);
        this.touchableHandleResponderRelease(e);
    },
    _remeasureMetricsOnInit: function _remeasureMetricsOnInit(e) {
        var root = this.root;

        var touch = extractSingleTouch(e);
        var boundingRect = root.getBoundingClientRect();
        this.touchable = {
            touchState: this.touchable.touchState,
            startMouse: {
                pageX: touch.pageX,
                pageY: touch.pageY
            },
            positionOnGrant: {
                left: boundingRect.left + window.pageXOffset,
                top: boundingRect.top + window.pageYOffset,
                width: boundingRect.width,
                height: boundingRect.height,
                clientLeft: boundingRect.left,
                clientTop: boundingRect.top
            }
        };
    },
    touchableHandleResponderGrant: function touchableHandleResponderGrant(e) {
        var _this3 = this;

        this.touchable.touchState = States.NOT_RESPONDER;
        if (this.pressOutDelayTimeout) {
            clearTimeout(this.pressOutDelayTimeout);
            this.pressOutDelayTimeout = null;
        }
        if (this.props.fixClickPenetration && !isAllowPress()) {
            return;
        }
        this._remeasureMetricsOnInit(e);
        this._receiveSignal(Signals.RESPONDER_GRANT, e);
        var delayMS = this.props.delayPressIn;
        if (delayMS) {
            this.touchableDelayTimeout = setTimeout(function () {
                _this3._handleDelay(e);
            }, delayMS);
        } else {
            this._handleDelay(e);
        }
        var longDelayMS = this.props.delayLongPress;
        this.longPressDelayTimeout = setTimeout(function () {
            _this3._handleLongDelay(e);
        }, longDelayMS + delayMS);
    },
    checkScroll: function checkScroll(e) {
        var positionOnGrant = this.touchable.positionOnGrant;
        // container or window scroll
        var boundingRect = this.root.getBoundingClientRect();
        if (boundingRect.left !== positionOnGrant.clientLeft || boundingRect.top !== positionOnGrant.clientTop) {
            this._receiveSignal(Signals.RESPONDER_TERMINATED, e);
            return false;
        }
    },
    touchableHandleResponderRelease: function touchableHandleResponderRelease(e) {
        if (!this.touchable.startMouse) {
            return;
        }
        var touch = extractSingleTouch(e);
        if (Math.abs(touch.pageX - this.touchable.startMouse.pageX) > 30 || Math.abs(touch.pageY - this.touchable.startMouse.pageY) > 30) {
            this._receiveSignal(Signals.RESPONDER_TERMINATED, e);
            return;
        }
        if (this.checkScroll(e) === false) {
            return;
        }
        this._receiveSignal(Signals.RESPONDER_RELEASE, e);
    },
    touchableHandleResponderTerminate: function touchableHandleResponderTerminate(e) {
        if (!this.touchable.startMouse) {
            return;
        }
        this._receiveSignal(Signals.RESPONDER_TERMINATED, e);
    },
    checkTouchWithinActive: function checkTouchWithinActive(e) {
        var positionOnGrant = this.touchable.positionOnGrant;
        var _props = this.props,
            pressRetentionOffset = _props.pressRetentionOffset,
            hitSlop = _props.hitSlop;

        var pressExpandLeft = pressRetentionOffset.left;
        var pressExpandTop = pressRetentionOffset.top;
        var pressExpandRight = pressRetentionOffset.right;
        var pressExpandBottom = pressRetentionOffset.bottom;
        if (hitSlop) {
            pressExpandLeft += hitSlop.left;
            pressExpandTop += hitSlop.top;
            pressExpandRight += hitSlop.right;
            pressExpandBottom += hitSlop.bottom;
        }
        var touch = extractSingleTouch(e);
        var pageX = touch && touch.pageX;
        var pageY = touch && touch.pageY;
        return pageX > positionOnGrant.left - pressExpandLeft && pageY > positionOnGrant.top - pressExpandTop && pageX < positionOnGrant.left + positionOnGrant.width + pressExpandRight && pageY < positionOnGrant.top + positionOnGrant.height + pressExpandBottom;
    },
    touchableHandleResponderMove: function touchableHandleResponderMove(e) {
        if (!this.touchable.startMouse) {
            return;
        }
        // Measurement may not have returned yet.
        if (!this.touchable.dimensionsOnActivate || this.touchable.touchState === States.NOT_RESPONDER) {
            return;
        }
        // Not enough time elapsed yet, wait for highlight -
        // this is just a perf optimization.
        if (this.touchable.touchState === States.RESPONDER_INACTIVE_PRESS_IN) {
            return;
        }
        var touch = extractSingleTouch(e);
        var pageX = touch && touch.pageX;
        var pageY = touch && touch.pageY;
        if (this.pressInLocation) {
            var movedDistance = this._getDistanceBetweenPoints(pageX, pageY, this.pressInLocation.pageX, this.pressInLocation.pageY);
            if (movedDistance > LONG_PRESS_ALLOWED_MOVEMENT) {
                this._cancelLongPressDelayTimeout();
            }
        }
        if (this.checkTouchWithinActive(e)) {
            this._receiveSignal(Signals.ENTER_PRESS_RECT, e);
            var curState = this.touchable.touchState;
            if (curState === States.RESPONDER_INACTIVE_PRESS_IN) {
                this._cancelLongPressDelayTimeout();
            }
        } else {
            this._cancelLongPressDelayTimeout();
            this._receiveSignal(Signals.LEAVE_PRESS_RECT, e);
        }
    },
    callProp: function callProp(name, e) {
        if (this.props[name] && !this.props.disabled) {
            this.props[name](e);
        }
    },
    touchableHandleActivePressIn: function touchableHandleActivePressIn(e) {
        this.setActive(true);
        this.callProp('onPressIn', e);
    },
    touchableHandleActivePressOut: function touchableHandleActivePressOut(e) {
        this.setActive(false);
        this.callProp('onPressOut', e);
    },
    touchableHandlePress: function touchableHandlePress(e) {
        this.callProp('onPress', e);
        lastClickTime = Date.now();
    },
    touchableHandleLongPress: function touchableHandleLongPress(e) {
        this.callProp('onLongPress', e);
    },
    setActive: function setActive(active) {
        if (this.props.activeClassName || this.props.activeStyle) {
            this.setState({
                active: active
            });
        }
    },
    _remeasureMetricsOnActivation: function _remeasureMetricsOnActivation() {
        this.touchable.dimensionsOnActivate = this.touchable.positionOnGrant;
    },
    _handleDelay: function _handleDelay(e) {
        this.touchableDelayTimeout = null;
        this._receiveSignal(Signals.DELAY, e);
    },
    _handleLongDelay: function _handleLongDelay(e) {
        this.longPressDelayTimeout = null;
        var curState = this.touchable.touchState;
        if (curState !== States.RESPONDER_ACTIVE_PRESS_IN && curState !== States.RESPONDER_ACTIVE_LONG_PRESS_IN) {
            console.error('Attempted to transition from state `' + curState + '` to `' + States.RESPONDER_ACTIVE_LONG_PRESS_IN + '`, which is not supported. This is ' + 'most likely due to `Touchable.longPressDelayTimeout` not being cancelled.');
        } else {
            this._receiveSignal(Signals.LONG_PRESS_DETECTED, e);
        }
    },
    _receiveSignal: function _receiveSignal(signal, e) {
        var curState = this.touchable.touchState;
        var nextState = Transitions[curState] && Transitions[curState][signal];
        if (!nextState) {
            return;
        }
        if (nextState === States.ERROR) {
            return;
        }
        if (curState !== nextState) {
            this._performSideEffectsForTransition(curState, nextState, signal, e);
            this.touchable.touchState = nextState;
        }
    },
    _cancelLongPressDelayTimeout: function _cancelLongPressDelayTimeout() {
        if (this.longPressDelayTimeout) {
            clearTimeout(this.longPressDelayTimeout);
            this.longPressDelayTimeout = null;
        }
    },
    _isHighlight: function _isHighlight(state) {
        return state === States.RESPONDER_ACTIVE_PRESS_IN || state === States.RESPONDER_ACTIVE_LONG_PRESS_IN;
    },
    _savePressInLocation: function _savePressInLocation(e) {
        var touch = extractSingleTouch(e);
        var pageX = touch && touch.pageX;
        var pageY = touch && touch.pageY;
        this.pressInLocation = { pageX: pageX, pageY: pageY };
    },
    _getDistanceBetweenPoints: function _getDistanceBetweenPoints(aX, aY, bX, bY) {
        var deltaX = aX - bX;
        var deltaY = aY - bY;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },
    _performSideEffectsForTransition: function _performSideEffectsForTransition(curState, nextState, signal, e) {
        var curIsHighlight = this._isHighlight(curState);
        var newIsHighlight = this._isHighlight(nextState);
        var isFinalSignal = signal === Signals.RESPONDER_TERMINATED || signal === Signals.RESPONDER_RELEASE;
        if (isFinalSignal) {
            this._cancelLongPressDelayTimeout();
        }
        if (!IsActive[curState] && IsActive[nextState]) {
            this._remeasureMetricsOnActivation();
        }
        if (IsPressingIn[curState] && signal === Signals.LONG_PRESS_DETECTED) {
            this.touchableHandleLongPress(e);
        }
        if (newIsHighlight && !curIsHighlight) {
            this._startHighlight(e);
        } else if (!newIsHighlight && curIsHighlight) {
            this._endHighlight(e);
        }
        if (IsPressingIn[curState] && signal === Signals.RESPONDER_RELEASE) {
            var hasLongPressHandler = !!this.props.onLongPress;
            var pressIsLongButStillCallOnPress = IsLongPressingIn[curState] && (!hasLongPressHandler || !this.props.longPressCancelsPress // or we're told to ignore it.
            );
            var shouldInvokePress = !IsLongPressingIn[curState] || pressIsLongButStillCallOnPress;
            if (shouldInvokePress) {
                if (!newIsHighlight && !curIsHighlight) {
                    // we never highlighted because of delay, but we should highlight now
                    this._startHighlight(e);
                    this._endHighlight(e);
                }
                this.touchableHandlePress(e);
            }
        }
        if (this.touchableDelayTimeout) {
            clearTimeout(this.touchableDelayTimeout);
            this.touchableDelayTimeout = null;
        }
    },
    _startHighlight: function _startHighlight(e) {
        this._savePressInLocation(e);
        this.touchableHandleActivePressIn(e);
    },
    _endHighlight: function _endHighlight(e) {
        var _this4 = this;

        if (this.props.delayPressOut) {
            this.pressOutDelayTimeout = setTimeout(function () {
                _this4.touchableHandleActivePressOut(e);
            }, this.props.delayPressOut);
        } else {
            this.touchableHandleActivePressOut(e);
        }
    },
    render: function render() {
        var _props2 = this.props,
            children = _props2.children,
            disabled = _props2.disabled,
            activeStyle = _props2.activeStyle,
            activeClassName = _props2.activeClassName;

        var events = disabled ? undefined : copy(this, ['onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel', 'onMouseDown']);
        var child = _react2["default"].Children.only(children);
        if (!disabled && this.state.active) {
            var _child$props = child.props,
                style = _child$props.style,
                className = _child$props.className;

            if (activeStyle) {
                style = (0, _objectAssign2["default"])({}, style, activeStyle);
            }
            if (activeClassName) {
                if (className) {
                    className += ' ' + activeClassName;
                } else {
                    className = activeClassName;
                }
            }
            return _react2["default"].cloneElement(child, (0, _objectAssign2["default"])({
                className: className,
                style: style
            }, events));
        }
        return _react2["default"].cloneElement(child, events);
    }
});
exports["default"] = Touchable;
module.exports = exports['default'];