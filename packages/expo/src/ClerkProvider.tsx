import './polyfills';

import {
  __internal__setErrorThrowerOptions,
  ClerkProvider as ClerkReactProvider,
  ClerkProviderProps as ClerkReactProviderProps,
} from '@clerk/clerk-react';
import React from 'react';

import type { TokenCache } from './cache';
import { isReactNative } from './runtime';
import { buildClerk } from './singleton';

__internal__setErrorThrowerOptions({
  packageName: '@clerk/expo',
});

export type ClerkProviderProps = ClerkReactProviderProps & {
  children: React.ReactNode;
  tokenCache?: TokenCache;
};

export function ClerkProvider(props: ClerkProviderProps): JSX.Element {
  const { children, tokenCache, frontendApi, publishableKey, ...rest } = props;
  const key =
    publishableKey || process.env.CLERK_PUBLISHABLE_KEY || frontendApi || process.env.CLERK_FRONTEND_API || '';

  return (
    //@ts-expect-error
    <ClerkReactProvider
      {...rest}
      Clerk={buildClerk({ key, tokenCache })}
      standardBrowser={!isReactNative()}
    >
      {children}
    </ClerkReactProvider>
  );
}
