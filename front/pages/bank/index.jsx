import Layout from "../../components/layout"
import { BankByCustomerQuery } from "../../lib/graphql"


import {TableLoading} from '../../components/skeleton'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFileInvoice, faPaperclip } from '@fortawesome/free-solid-svg-icons'
// import { server } from '../../lib/settings'
import { useState,useEffect } from 'react'
import dynamic from 'next/dynamic'

const Sales = dynamic(()=>import('../../components/bank/sales'),{loading:()=><TableLoading />})
const Purchase = dynamic(()=>import('../../components/bank/purchase'),{loading:()=><TableLoading />})
const Contra = dynamic(()=>import('../../components/bank/expense'),{loading:()=><TableLoading />})
// const Personal = dynamic(()=>import('../../components/bank/personal'),{loading:()=><TableLoading />})


const Bank = () =>{
    const [text,setText] = useState("")
    const [tabs,setTabs] = useState("")
    useEffect(()=>{
        setTabs({"sales":true,"purchase":false,"expense":false})
        // searchData({variables:{"search":text}})
    },[])

    return <>
        <Layout title="Bank" text={text} setText={setText}>
            <div>
                <div className="topHeading">
                    <h2>Bank</h2>
                </div>

            </div>
            <div style={{background:'white',padding:'20px'}} className="card">
                <div>
                    <div className="tabs">
                        <ul>
                            <li className={`${tabs.sales==true && "is-active"}`}><a onClick={()=>setTabs({sales:true,purchase:false,expense:false})} >Sales</a></li>
                            <li className={`${tabs.purchase==true && "is-active"}`}><a onClick={()=>{setTabs({sales:false,purchase:true,expense:false})} } >Purchase</a></li>
                            <li className={`${tabs.expense==true && "is-active"}`}><a onClick={()=>setTabs({sales:false,purchase:false,expense:true})} >Contra</a></li>
                            {/* <li className={`${tabs.bank==true && "is-active"}`}><a onClick={()=>setTabs({sales:true,purchase:false,expense:false})} >Bank</a></li> */}
                        </ul>
                    </div>
                    {
                        tabs.sales &&
                        <Sales text={text} setText={setText}/>
                    }
                    {
                        tabs.purchase &&
                        <Purchase />
                    }
                    {
                        tabs.expense &&
                        <Contra />
                    }
                </div>
            </div>

            
        </Layout>
    </>

}

export default Bank;