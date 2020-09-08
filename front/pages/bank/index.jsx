import Layout from "../../components/layout"
import { BankByCustomerQuery } from "../../lib/graphql"


import {TableLoading} from '../../components/skeleton'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFileInvoice, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { server } from '../../lib/settings'
import { useState,useEffect } from 'react'
import dynamic from 'next/dynamic'
import {useSelector,useDispatch} from 'react-redux'
import { change_bank_tab } from "../../redux_function/actions"

const Sales = dynamic(()=>import('../../components/bank/sales'),{loading:()=><TableLoading />})
const Purchase = dynamic(()=>import('../../components/bank/purchase'),{loading:()=><TableLoading />})
const Contra = dynamic(()=>import('../../components/bank/expense'),{loading:()=><TableLoading />})
// const Personal = dynamic(()=>import('../../components/bank/personal'),{loading:()=><TableLoading />})


const Bank = () =>{
    const [text,setText] = useState("")
    const [tabs,setTabs] = useState("")
    const bankTab = useSelector(state=>state.bankTab)
    const dispatch = useDispatch()
    // useEffect(()=>{
    //     setTabs({"sales":true,"purchase":false,"expense":false})
    // },[])
    console.log(bankTab)
    return <>
        <Layout title="Bank" text={text} setText={setText}>
            <div>
                <div className="topHeading">
                    <h2>Bank</h2>
                    <div>
                        <a target="_blank" href={`${server}/export/${bankTab.sale==true?"sales":"purchase"}/${text==""?"all":text}`} className="tag is-small is-rounded is-primary">Export To Excel</a>
                    </div>
                </div>

            </div>
            <div style={{background:'_white_',padding:'0px'}} className="card_">
                <div>
                    <div className="tabs">
                        <ul>
                            <li className={`${bankTab.sale==true && "is-active"}`}><a onClick={()=>dispatch(change_bank_tab("sale"))} >Sales</a></li>
                            <li className={`${bankTab.purchase==true && "is-active"}`}><a onClick={()=>dispatch(change_bank_tab("purchase")) } >Purchase</a></li>
                            <li className={`${bankTab.expense==true && "is-active"}`}><a onClick={()=>dispatch(change_bank_tab("contra"))} >Contra</a></li>
                            {/* <li className={`${tabs.bank==true && "is-active"}`}><a onClick={()=>setTabs({sales:true,purchase:false,expense:false})} >Bank</a></li> */}
                        </ul>
                    </div>
                    {
                        bankTab.sale &&
                        <Sales text={text} setText={setText}/>
                    }
                    {
                        bankTab.purchase &&
                        <Purchase />
                    }
                    {
                        bankTab.contra &&
                        <Contra />
                    }
                </div>
            </div>

            
        </Layout>
    </>

}

export default Bank;