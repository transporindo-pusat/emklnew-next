/* Manual mock for react-input-mask (incompatible with React 19 / jsdom:
 * it calls findDOMNode and reads selectionStart on null, causing crashes and
 * infinite update loops in tests). Jest applies this automatically for the
 * node module. Renders a plain input and supports the children-as-function API. */
const React = require('react');

const InputMask = React.forwardRef(function InputMask(props, ref) {
  const {
    children,
    mask,
    maskChar,
    maskPlaceholder,
    alwaysShowMask,
    beforeMaskedStateChange,
    formatChars,
    value,
    onChange,
    onBlur,
    onFocus,
    disabled,
    name,
    placeholder,
    readOnly,
    className
  } = props;

  const inputProps = {
    ref,
    value: value ?? '',
    onChange,
    onBlur,
    onFocus,
    disabled,
    name,
    placeholder,
    readOnly,
    className
  };

  if (typeof children === 'function') {
    return children(inputProps);
  }
  return React.createElement('input', inputProps);
});

module.exports = InputMask;
module.exports.default = InputMask;
module.exports.__esModule = true;
