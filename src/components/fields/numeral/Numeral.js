import React from 'react'
import autobind from 'autobind-decorator'
import isNumber from 'lodash/isNumber'
import PropTypes from 'prop-types'
import isNil from 'lodash/isNil'

const numeral = global.numeral
if (!numeral) {
  throw new Error('Numeral is required in global variable')
}

export default class NComponent extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    useHint: PropTypes.bool,
    label: PropTypes.any,
    errorMessage: PropTypes.string,
    disabled: PropTypes.bool,
    passProps: PropTypes.object,
    description: PropTypes.node
  }

  state = {}

  componentDidMount() {
    if (!isNil(this.props.value)) {
      const label = this.formatValue(this.props.value)
      this.setState({label})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.value !== this.props.value) {
      if (!isNil(this.props.value)) {
        const label = this.formatValue(this.props.value)
        this.setState({label, value: this.props.value})
      } else {
        this.setState({label: '', value: this.props.value})
      }
    }
  }

  unformatValue(label) {
    return label === '' ? undefined : numeral._.stringToNumber(label)
  }

  formatValue(real) {
    return isNumber(real) ? numeral(real).format('$0,0[.]00') : ''
  }

  @autobind
  onChange(event) {
    const label = event.target.value
    if (!label) {
      this.setState({label: ''})
      this.props.onChange(null)
      return
    }
    const value = this.unformatValue(label)
    const formatted = this.formatValue(event.target.value)
    if (formatted) {
      this.setState({label: formatted, value})
    } else {
      this.setState({label, value})
    }
    this.props.onChange(value)
  }

  getValue() {
    if (this.state.label) return this.state.label
    if (isNil(this.props.value)) return ''
    const label = this.formatValue(this.props.value)
    return label
  }

  @autobind
  onBlur(event) {
    if (!event.target.value) return
    const real = this.formatValue(event.target.value)
    this.setState({label: real})
  }

  @autobind
  onKeyDown(event) {
    if (event.keyCode === 8) {
      if (String(this.props.value).length <= 1 || this.props.value === 0) {
        this.setState({label: ''})
        this.props.onChange(null)
      }
    }
  }

  render() {
    return (
      <div>
        <div className="label">{this.props.label}</div>
        <div className="os-input-container">
          <input
            className="os-input-text"
            ref="input"
            value={this.getValue()}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onBlur={this.onBlur}
            {...this.props.passProps}
          />
        </div>
        <div className="description">{this.props.description}</div>
        <div className="os-input-error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
