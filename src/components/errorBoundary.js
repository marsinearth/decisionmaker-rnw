import React, {
  PropsWithChildren,
  PureComponent,
} from 'react';

export default class ErrorBoundary extends PureComponent<PropsWithChildren<unknown>> {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log('error: ', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>{'Something went wrong!'}</h1>;
    }
    return this.props.children;
  }
}