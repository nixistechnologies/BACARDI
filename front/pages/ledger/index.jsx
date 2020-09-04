import Layout from '../../components/layout'
import { useQuery, useLazyQuery } from 'react-apollo'
import {getLedgersQuery} from '../../lib/graphql'
import {TableLoading} from '../../components/skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faFileInvoice, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { server } from '../../lib/settings'
import { useState,useEffect } from 'react'

const Records = ({items}) =>{
    return <>
    <table className="table is-fullwidth is-hoverable is-bordered">
        <thead>
            <tr>
                <th>SN.</th>
                <th className="_w20">Name</th>
                <th className="_w20">Invoice Number</th>
                <th className="_w10">Type</th>
                <th className="_w10">Date</th>
                <th className="_w10">Amount</th>
                <th className="_w10">File</th>
                {/* <th className="_w5" colSpan={2}></th> */}
            </tr>
            </thead>
            <tbody>
            {items.map((e,i)=>{
                return(
                
                <tr key={e.node.id}>
                    <td>{i+1}</td>
                    <td className="_heading _w30">
                            {/* {e.node.name} */}
                            {e.node.sale !=null ?e.node.sale.customer.name:e.node.purchase.vendor.name}
                    </td>
                    <td>
                        {e.node.sale !=null ?e.node.sale.invoiceNumber:e.node.purchase.invoiceNumber}
                    </td>
                    
                    <td>
                        {e.node.sale !=null ?"Sale":"Purchase"}
                    </td>
                    <td>
                        {
                        e.node.sale !=null ?e.node.sale.billingDate:e.node.purchase.createdDate}
                    </td>
                    <td>
                        {e.node.sale !=null ?e.node.sale.netAmount:e.node.purchase.totalBill}
                    </td>
                    <td>
                    {/* {e.node.sale !=null ?e.node.sale.invoice:e.node.purchase.invoiceFile} */}
                        <a target="_blank" href={`${server}${e.node.sale !=null ?`/invoice/${e.node.sale.id}/${e.node.sale.user.id}`:`/media/${e.node.purchase.invoiceFile}`}`}>
                            <FontAwesomeIcon icon={faPaperclip} />
                        </a>
                    </td>

                </tr>
                
                )
            })}
            </tbody>
            
    </table>
    </>
}

const Ledger = () =>{
    const [text,setText] = useState("")
    const {data:odata,loading:oloading} = useQuery(getLedgersQuery,{variables:{"search":""}})
    const [searchData,{data,loading}] = useLazyQuery(getLedgersQuery)
    useEffect(()=>{
        searchData({variables:{"search":text}})
    },[text])
    
    
    // console.log(data)
    return <>
        <Layout title="Ledger" text={text} setText={setText}>
            {/* <div>Ledger</div> */}
            <div>
                {/* < Modal active={active} setActive={setActive} isNew={true} /> */}
                <div className="topHeading">
                    <h2>Ledgers</h2>
                {/* <div>
                    <button type="button" onClick={()=>setActive("is-active")} className="button is-rounded is-small is-primary">Add customer</button>
                </div> */}
                </div>

            </div>
            {
                oloading || loading ?
                <TableLoading />
                // :<Records items={data.ledgers.edges} />    
                :<Records items={data==undefined ? odata.ledgers.edges : data.ledgers.edges} />    
            }

            
        </Layout>
    </>
}

export default Ledger