'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _crc = require('create-react-class');

var PropTypes = require('prop-types');

var _ChildrenUtils = require('./ChildrenUtils');

var _AnimateChild = require('./AnimateChild');

var _AnimateChild2 = _interopRequireDefault(_AnimateChild);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultKey = 'rc_animate_' + Date.now();


function getChildrenFromProps(props) {
  var children = props.children;
  if (_react2["default"].isValidElement(children)) {
    if (!children.key) {
      return _react2["default"].cloneElement(children, {
        key: defaultKey
      });
    }
  }
  return children;
}

function noop() {}

var Animate = _crc({
  displayName: 'Animate',

  propTypes: {
    component: PropTypes.any,
    componentProps: PropTypes.object,
    animation: PropTypes.object,
    transitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    transitionEnter: PropTypes.bool,
    transitionAppear: PropTypes.bool,
    exclusive: PropTypes.bool,
    transitionLeave: PropTypes.bool,
    onEnd: PropTypes.func,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    onAppear: PropTypes.func,
    showProp: PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      animation: {},
      component: 'span',
      componentProps: {},
      transitionEnter: true,
      transitionLeave: true,
      transitionAppear: false,
      onEnd: noop,
      onEnter: noop,
      onLeave: noop,
      onAppear: noop
    };
  },
  getInitialState: function getInitialState() {
    this.currentlyAnimatingKeys = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
    return {
      children: (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(this.props))
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var showProp = this.props.showProp;
    var children = this.state.children;
    if (showProp) {
      children = children.filter(function (child) {
        return !!child.props[showProp];
      });
    }
    children.forEach(function (child) {
      if (child) {
        _this.performAppear(child.key);
      }
    });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this2 = this;

    this.nextProps = nextProps;
    var nextChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(nextProps));
    var props = this.props;
    // exclusive needs immediate response
    if (props.exclusive) {
      Object.keys(this.currentlyAnimatingKeys).forEach(function (key) {
        _this2.stop(key);
      });
    }
    var showProp = props.showProp;
    var currentlyAnimatingKeys = this.currentlyAnimatingKeys;
    // last props children if exclusive
    var currentChildren = props.exclusive ? (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props)) : this.state.children;
    // in case destroy in showProp mode
    var newChildren = [];
    if (showProp) {
      currentChildren.forEach(function (currentChild) {
        var nextChild = currentChild && (0, _ChildrenUtils.findChildInChildrenByKey)(nextChildren, currentChild.key);
        var newChild = void 0;
        if ((!nextChild || !nextChild.props[showProp]) && currentChild.props[showProp]) {
          newChild = _react2["default"].cloneElement(nextChild || currentChild, _defineProperty({}, showProp, true));
        } else {
          newChild = nextChild;
        }
        if (newChild) {
          newChildren.push(newChild);
        }
      });
      nextChildren.forEach(function (nextChild) {
        if (!nextChild || !(0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, nextChild.key)) {
          newChildren.push(nextChild);
        }
      });
    } else {
      newChildren = (0, _ChildrenUtils.mergeChildren)(currentChildren, nextChildren);
    }

    // need render to avoid update
    this.setState({
      children: newChildren
    });

    nextChildren.forEach(function (child) {
      var key = child && child.key;
      if (child && currentlyAnimatingKeys[key]) {
        return;
      }
      var hasPrev = child && (0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, key);
      if (showProp) {
        var showInNext = child.props[showProp];
        if (hasPrev) {
          var showInNow = (0, _ChildrenUtils.findShownChildInChildrenByKey)(currentChildren, key, showProp);
          if (!showInNow && showInNext) {
            _this2.keysToEnter.push(key);
          }
        } else if (showInNext) {
          _this2.keysToEnter.push(key);
        }
      } else if (!hasPrev) {
        _this2.keysToEnter.push(key);
      }
    });

    currentChildren.forEach(function (child) {
      var key = child && child.key;
      if (child && currentlyAnimatingKeys[key]) {
        return;
      }
      var hasNext = child && (0, _ChildrenUtils.findChildInChildrenByKey)(nextChildren, key);
      if (showProp) {
        var showInNow = child.props[showProp];
        if (hasNext) {
          var showInNext = (0, _ChildrenUtils.findShownChildInChildrenByKey)(nextChildren, key, showProp);
          if (!showInNext && showInNow) {
            _this2.keysToLeave.push(key);
          }
        } else if (showInNow) {
          _this2.keysToLeave.push(key);
        }
      } else if (!hasNext) {
        _this2.keysToLeave.push(key);
      }
    });
  },
  componentDidUpdate: function componentDidUpdate() {
    var keysToEnter = this.keysToEnter;
    this.keysToEnter = [];
    keysToEnter.forEach(this.performEnter);
    var keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  },
  performEnter: function performEnter(key) {
    // may already remove by exclusive
    if (this.refs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.refs[key].componentWillEnter(this.handleDoneAdding.bind(this, key, 'enter'));
    }
  },
  performAppear: function performAppear(key) {
    if (this.refs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.refs[key].componentWillAppear(this.handleDoneAdding.bind(this, key, 'appear'));
    }
  },
  handleDoneAdding: function handleDoneAdding(key, type) {
    var props = this.props;
    delete this.currentlyAnimatingKeys[key];
    // if update on exclusive mode, skip check
    if (props.exclusive && props !== this.nextProps) {
      return;
    }
    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
    if (!this.isValidChildByKey(currentChildren, key)) {
      // exclusive will not need this
      this.performLeave(key);
    } else {
      if (type === 'appear') {
        if (_util2["default"].allowAppearCallback(props)) {
          props.onAppear(key);
          props.onEnd(key, true);
        }
      } else {
        if (_util2["default"].allowEnterCallback(props)) {
          props.onEnter(key);
          props.onEnd(key, true);
        }
      }
    }
  },
  performLeave: function performLeave(key) {
    // may already remove by exclusive
    if (this.refs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.refs[key].componentWillLeave(this.handleDoneLeaving.bind(this, key));
    }
  },
  handleDoneLeaving: function handleDoneLeaving(key) {
    var props = this.props;
    delete this.currentlyAnimatingKeys[key];
    // if update on exclusive mode, skip check
    if (props.exclusive && props !== this.nextProps) {
      return;
    }
    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
    // in case state change is too fast
    if (this.isValidChildByKey(currentChildren, key)) {
      this.performEnter(key);
    } else {
      var end = function end() {
        if (_util2["default"].allowLeaveCallback(props)) {
          props.onLeave(key);
          props.onEnd(key, false);
        }
      };
      /* eslint react/no-is-mounted:0 */
      if (!(0, _ChildrenUtils.isSameChildren)(this.state.children, currentChildren, props.showProp)) {
        this.setState({
          children: currentChildren
        }, end);
      } else {
        end();
      }
    }
  },
  isValidChildByKey: function isValidChildByKey(currentChildren, key) {
    var showProp = this.props.showProp;
    if (showProp) {
      return (0, _ChildrenUtils.findShownChildInChildrenByKey)(currentChildren, key, showProp);
    }
    return (0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, key);
  },
  stop: function stop(key) {
    delete this.currentlyAnimatingKeys[key];
    var component = this.refs[key];
    if (component) {
      component.stop();
    }
  },
  render: function render() {
    var props = this.props;
    this.nextProps = props;
    var stateChildren = this.state.children;
    var children = null;
    if (stateChildren) {
      children = stateChildren.map(function (child) {
        if (child === null || child === undefined) {
          return child;
        }
        if (!child.key) {
          throw new Error('must set key for <rc-animate> children');
        }
        return _react2["default"].createElement(
          _AnimateChild2["default"],
          {
            key: child.key,
            ref: child.key,
            animation: props.animation,
            transitionName: props.transitionName,
            transitionEnter: props.transitionEnter,
            transitionAppear: props.transitionAppear,
            transitionLeave: props.transitionLeave
          },
          child
        );
      });
    }
    var Component = props.component;
    if (Component) {
      var passedProps = props;
      if (typeof Component === 'string') {
        passedProps = _extends({
          className: props.className,
          style: props.style
        }, props.componentProps);
      }
      return _react2["default"].createElement(
        Component,
        passedProps,
        children
      );
    }
    return children[0] || null;
  }
});

exports["default"] = Animate;
module.exports = exports['default'];
