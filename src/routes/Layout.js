import React from 'react';
import { Route, Switch } from 'react-router';
import routes from './index';

const Layout = () => (
  <div>
    <Route path="/" />
    <div className="container">
      <Switch>
        {routes.map(route => <Route key={`route-${route.name}`} {...route} />)}
      </Switch>
    </div>
  </div>
);

export default Layout;