import React, { ReactNode } from 'react';
import { Page } from './Page';
import { useAuth } from './Auth';

type authorizedPageProps ={
  children: ReactNode
}

export const AuthorizedPage: React.FC<authorizedPageProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Page title="You do not have access to this page">{null}</Page>;
  }
};
