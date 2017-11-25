import HomePage from './HomePage';
import BoardPage from './BoardPage'
import NotFoundPage from './NotFoundPage';

const routes = [
  {
    path: '/',
    name: 'home',
    exact: true,
    component: HomePage,
  },
  {
    path: '/board/:id',
    name: 'board',
    component: BoardPage,
  },
  {
    path: '*',
    name: 'notfound',
    component: NotFoundPage,
  }
];

export default routes;