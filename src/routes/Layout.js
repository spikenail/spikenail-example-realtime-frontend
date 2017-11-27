import React from 'react';
import { Route, Switch } from 'react-router';
import routes from './index';

import UserSwitchPanel from '../components/UserSwitchPanel';

const Layout = () => (
  <div>
    <Route path="/" />
    <div>
      <UserSwitchPanel />
      <Switch>
        {routes.map(route => <Route key={`route-${route.name}`} {...route} />)}
      </Switch>
    </div>
  </div>
);

export default Layout;