import Head from 'next/head'
import Link from 'next/link'
import {ApolloProvider} from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import client from '../lib/apolloClient';
// import Nav from './navbar';
import { withRouter, Router } from 'next/router'
// import Router:s from 'next/router'

import {connect} from 'react-redux'

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
        // console.log(this.props.side_bar.sidebar)
        // const r = new Router()
        // console.log(r)
        
        // console.log(this.props.router.pathname)
        let route = this.props.router.pathname;
        const { children,active,loading,loadingText,title = "BACARDI",sidebar=true,navbar=true,text,setText,login,side_bar,body_color } = this.props;
        // const title = "Welcome to Nextjs";
        // console.log(active)
        // console.log(setText)
        // console.log(side_bar)
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
                    {/* <style jsx>{`
                        body{
                            background-color: #EDEDEE !important;
                        }
                        `}</style> */}
                </Head>

                {login===true?
                    children

                :

                
                <main className="main">
                    <div className="es_" >
                        
                        {
                            // this.props.side_bar.side_bar == true &&
                            sidebar===true?
                            <SideBar route={route} sidebar={sidebar}/>:
                            <div></div>
                        }
                        


                        <div className="container" style={{padding:'0',maxWidth:`${side_bar.sidebar==true?'82%':'95%'}`}}>
                            <header>
                                
                                {/* {navbar===true?
                                <Navbar/>
                                :""    
                                } */}
                                
                            </header>
                            <div>
                                
                                {navbar===true?
                                    <Navbar text={text} setText={setText} />:""
                                }
                                <div className="main-container">
                                    
                                    {children}
                                </div>
                            </div>
                            <div className="_foot">

                            </div>
                        </div>
                        
                    </div>
                    
                    
                </main>
        }
            </div>
            </ApolloHooksProvider>
            </ApolloProvider>
            </LoadingOverlay>
            

        )
    }    
}

const mapStateToProps=(state,props)=>{
    return {
        side_bar:state.width
    }
}

const mapDispatchToProps=(dispatch,props)=>({
    toggleSideBar:()=>{
        console.log(props)
        // dispatch(togglebar())
    }   
})

export default withRouter(
    connect(mapStateToProps,mapDispatchToProps)
    (Layout)
    );