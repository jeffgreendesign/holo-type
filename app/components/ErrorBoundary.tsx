/**
 * Copyright 2026 Holo-Type Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 */
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error("[HoloType ErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="min-h-screen flex items-center justify-center px-6 text-center"
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >
          <div className="max-w-md space-y-6">
            <div className="text-xs tracking-[0.3em] opacity-60">
              [ TRANSMISSION_INTERRUPTED ]
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              The signal dropped.
            </h1>
            <p className="text-sm opacity-70">
              The holographic surface destabilized. Re-align to continue.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-6 py-2 border border-current rounded-sm text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity"
            >
              Re-align
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
