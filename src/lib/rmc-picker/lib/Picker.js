'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _crc = require("create-react-class");

var _NativePicker = require('./NativePicker');

var _NativePicker2 = _interopRequireDefault(_NativePicker);

var _isChildrenEqual = require('./isChildrenEqual');

var _isChildrenEqual2 = _interopRequireDefault(_isChildrenEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Item = _NativePicker2["default"].Item;
var Picker = _crc({
    displayName: 'Picker',
    getDefaultProps: function getDefaultProps() {
        return {
            pure: true,
            children: []
        };
    },
    getValue: function getValue() {
        return this.props.selectedValue || this.props.children && this.props.children[0] && this.props.children[0].value;
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
        return this.props.selectedValue !== nextProps.selectedValue || !(0, _isChildrenEqual2["default"])(this.props.children, nextProps.children, this.props.pure);
    },
    render: function render() {
        var children = this.props.children.map(function (c) {
            return _react2["default"].createElement(Item, (0, _extends3["default"])({}, c, { key: c.value + '' }));
        });
        return _react2["default"].createElement(
            _NativePicker2["default"],
            this.props,
            children
        );
    }
});
exports["default"] = Picker;
module.exports = exports['default'];