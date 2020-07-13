import { ApolloProvider } from 'react-apollo'
import client from '../lib/apolloClient'
import 'bulma/css/bulma.css'
import '../components/sidebar.css'
import '../components/main.css'

import React from 'react';
import App, {AppInitialProps, AppContext} from 'next/app';
import {store} from '../redux_function/stores';
import {MakeStore, createWrapper, Context, HYDRATE} from 'next-redux-wrapper';
// import reducer from '../redux_function/reducers'
// import {createStore, AnyAction} from 'redux';

// import {wrapper} from '../components/store';
// import {State} from '../components/reducer';




class MyApp extends App<AppInitialProps> {

    public static getInitialProps = async ({Component, ctx}: AppContext) => {

        // ctx.store.dispatch({type: 'TOE', payload: 'was set in _app'});

        return {
            pageProps: {
                // Call page-level getInitialProps
                ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
                // Some custom thing for all pages
                pathname: ctx.pathname,
            },
        };

    };

    public render() {
        const {Component, pageProps} = this.props;

        return (
          <ApolloProvider client={client}>
            {/* <Provider store={store}>  */}
              <Component {...pageProps} />
              {/* </Provider> */}
          </ApolloProvider>
            // <Component {...pageProps} />
        );
    }
}

export interface State {
  
}


const makeStore: MakeStore<State> = (context: Context) => store;

export const wrapper = createWrapper<State>(makeStore, {debug: true});

export default wrapper.withRedux(MyApp);
