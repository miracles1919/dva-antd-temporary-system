import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    {
      path: '/modify',
      models: () => [import('./models/setting')],
      component: () => import('./routes/setting/modify/'),
    }, {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/register',
      models: () => [import('./models/login')],
      component: () => import('./routes/register/'),
    }, {
      path: '/review',
      models: () => [import('./models/setting')],
      component: () => import('./routes/review/'),
    }, {
      path: '/add',
      models: () => [import('./models/shop')],
      component: () => import('./routes/shop/Add'),
    }, {
      path: '/list',
      models: () => [import('./models/shop')],
      component: () => import('./routes/shop/List'),
    }, {
      path: '/list2',
      models: () => [import('./models/shop')],
      component: () => import('./routes/shop/UserList'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/login" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
