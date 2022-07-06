import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  state: { hasError: boolean } = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError ? (
      <p>The application is temporarily unavailable</p>
    ) : (
      this.props.children
    );
  }
}
