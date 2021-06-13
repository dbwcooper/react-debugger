/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import {Component, Suspense} from 'react';
import Store from 'react-devtools-shared/src/devtools/store';
import ErrorView from './ErrorView';
import SearchingGitHubIssues from './SearchingGitHubIssues';
import SuspendingErrorView from './SuspendingErrorView';

type Props = {|
  children: React$Node,
  store: Store,
|};

type State = {|
  callStack: string | null,
  componentStack: string | null,
  errorMessage: string | null,
  hasError: boolean,
|};

const InitialState: State = {
  callStack: null,
  componentStack: null,
  errorMessage: null,
  hasError: false,
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = InitialState;

  static getDerivedStateFromError(error: any) {
    const errorMessage =
      typeof error === 'object' &&
      error !== null &&
      error.hasOwnProperty('message')
        ? error.message
        : '' + error;

    const callStack =
      typeof error === 'object' &&
      error !== null &&
      error.hasOwnProperty('stack')
        ? error.stack
            .split('\n')
            .slice(1)
            .join('\n')
        : null;

    return {
      callStack,
      errorMessage,
      hasError: true,
    };
  }

  componentDidCatch(error: any, {componentStack}: any) {
    this.setState({
      componentStack,
    });
  }

  componentDidMount() {
    this.props.store.addListener('error', this._onStoreError);
  }

  componentWillUnmount() {
    this.props.store.removeListener('error', this._onStoreError);
  }

  render() {
    const {children} = this.props;
    const {callStack, componentStack, errorMessage, hasError} = this.state;

    if (hasError) {
      return (
        <ErrorView
          callStack={callStack}
          componentStack={componentStack}
          errorMessage={errorMessage}>
          <Suspense fallback={<SearchingGitHubIssues />}>
            <SuspendingErrorView
              callStack={callStack}
              componentStack={componentStack}
              errorMessage={errorMessage}
            />
          </Suspense>
        </ErrorView>
      );
    }

    return children;
  }

  _onStoreError = (error: Error) => {
    if (!this.state.hasError) {
      this.setState(ErrorBoundary.getDerivedStateFromError(error));
    }
  };
}
