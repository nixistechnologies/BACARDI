import Layout from '../components/layout'
import {useState} from 'react'
import { useQuery,useLazyQuery } from '@apollo/react-hooks'
import {reportByDateRangeQuery} from '../lib/graphql'
import {privateRoute} from '../lib/private_route'
import { server } from '../lib/settings'
import {TableLoading} from '../components/skeleton'

const ListofReport = ({min,max}) =>{
    const [getReprot, {loading,error,data}] = useLazyQuery(reportByDateRangeQuery,{variables:{"min":min,"max":max}})
    console.log(data)
    if(loading){
        return <div><TableLoading /></div>
    }
    if(error){
        return <div>Error</div>
    }
    return (
        <div>Data</div>        
    )
}






const Report = () =>{
    const [min,setMin] = useState("")
    const [max,setMax] = useState("")
    const [getReport, {loading,error,data}] = useLazyQuery(reportByDateRangeQuery,{variables:{"min":min,"max":max}})
    console.log(data)
    return(
        <Layout title="Reports">
            <style jsx>{`
             td,th{
                 font-size:15px;
             }
             .data{
                 margin-top:50px;
             }
             .is-small{
                 font-size:0.85rem;
             }
            `} 

            </style>
            <div>
                <div className="topHeading">
                    <h2>Reports</h2>
                </div>
                <div>
                    <div>
                        <div className="columns">
                            <div className="column">
                                <label className="label">From</label>
                                <input type="date" className="input is-small" value={min} onChange={e=>setMin(e.target.value)}/>
                            </div>
                            <div className="column">
                                <label className="label">To</label>
                                <input type="date" className="input is-small" min={min}  value={max} onChange={e=>setMax(e.target.value)}/> 
                            </div>

                            <div className="column is-2">
                                <label className="label" style={{visibility:'hidden'}}>To</label>
                                <button type="button" className="button is-primary is-small" onClick={()=>getReport()}>
                                    Report
                                </button>

                            </div>
                        </div>
                    </div>

                    <div className="data">
                    {loading===true
                    ?(<div style={{textAlign:'center',fontWeight:'bold',fontSize:'20px'}}><TableLoading /></div>):
                    data!=undefined?
                    data.report.edges.length?
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>SN.</th>
                                <th>Invoice Number</th>
                                <th>Date</th>
                                <th>Name</th>
                                {/* <th>Gross</th>
                                <th>Discount</th>
                                <th>CGST</th>
                                <th>SGST</th> */}
                                <th>Net Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.report.edges.map((item,i)=>{
                                return (<tr key={item.id}>
                                    <td>{i+1}</td>
                                    <td>
                                        <a href={`${server}/media/${item.node.invoice}`} target="_blank">
                                            {item.node.invoiceNumber}
                                        </a>
                                        </td>
                                    <td>{item.node.billingDate}</td>
                                    <td>{item.node.patient.name}</td>
                                    {/* <td>{item.node.grossAmount}</td>
                                    <td>{item.node.discount}</td>
                                    <td>{item.node.cgst}</td>
                                    <td>{item.node.sgst}</td> */}
                                    <td>{item.node.netAmount}</td>
                                </tr>)
                            })}
                        </tbody>
                    </table>:
                    <div style={{textAlign:'center',fontWeight:'bold',fontSize:'20px'}}>No Data Found</div>           
                    :<div></div>
                    }

                    </div>

                    {/* <ListofReport min={min} max={max}/> */}



                </div>
            </div>
        </Layout>
    )
}


export default privateRoute(Report);