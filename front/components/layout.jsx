import Head from 'next/head'
import Link from 'next/link'
import {ApolloProvider} from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import client from '../lib/apolloClient';
// import Nav from './navbar';
import { withRouter, Router } from 'next/router'
// import Router:s from 'next/router'

import Navbar from './navbar';
import LoadingOverlay from 'react-loading-overlay'

// import SideBar from './sidebar'
import dynamic from 'next/dynamic'


const SideBar = dynamic(()=> import("./sidebar"),{ssr:false})

// import { Provider } from 'react-redux'
// import rootReducer from '../redux_function/reducers'
// import {createStore} from 'redux'

// const store = createStore(rootReducer)

class Layout extends React.Component{
    constructor(props) {
        super(props);
    }
    
    static async getInitialProps({ req }) {
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
    }
    
    
    

    render(){
        
        // const r = new Router()
        // console.log(r)
        
        // console.log(this.props.router.pathname)
        let route = this.props.router.pathname;
        const { children,active,loading,loadingText,title = "BACARDI",sidebar=true,navbar=true } = this.props;
        // const title = "Welcome to Nextjs";
        // console.log(active)
        return(
            // <Provider store={store}>

            <LoadingOverlay active={loading} spinner text={loadingText}> 

            <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
            <div>
                <Head>
                    <title>{title}</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                </Head>

                
                <main className="main">
                    
                    
                    <div class="es_" >
                        
                        {
                            sidebar===true?
                            <SideBar route={route} sidebar={sidebar}/>:
                            <div></div>
                        }
                        


                        <div className="container" style={{padding:'0'}}>
                            <header>
                                {navbar===true?
                                <Navbar/>
                                :""    
                                }
                                
                            </header>
                            <div className="main-container">
                                {children}
                            </div>
                            <div className="_foot">

                            </div>
                        </div>
                        
                    </div>
                    
                    
                </main>
            </div>
            </ApolloHooksProvider>
            </ApolloProvider>
            </LoadingOverlay>
            

        )
    }    
}

export default withRouter(Layout);