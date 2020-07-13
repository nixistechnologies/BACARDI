import Layout from '../components/layout'
import {useState} from 'react'
import { useQuery,useLazyQuery } from '@apollo/react-hooks'
import {historyBySlugQuery} from '../lib/graphql'
import {privateRoute} from '../lib/private_route'
import { server } from '../lib/settings'
import {TableLoading} from '../components/skeleton'
const Result = ({loading,data})=>{
    return(
        <div className="data">
            <style jsx>{`
             td,th{
                 font-size:15px;
             }
             .data{
                 margin-top:50px;
             }
            `} </style>
            {loading===true
            ?(<div style={{textAlign:'center',fontWeight:'bold',fontSize:'20px'}}><TableLoading /></div>):
            data!=undefined?
            data.history.edges.length?
            <table className="table is-fullwidth">
                <thead>
                    <tr>
                        <th>SN.</th>
                        <th>Invoice Number</th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Net Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.history.edges.map((item,i)=>{
                        return (<tr key={item.id}>
                            <td>{i+1}</td>
                            <td>
                                <a href={`${server}/media/${item.node.invoice}`} target="_blank">
                                    {item.node.invoiceNumber}
                                </a>
                                </td>
                            <td>{item.node.billingDate}</td>
                            <td>{item.node.patient.name}</td>
                            <td>{item.node.netAmount}</td>
                        </tr>)
                    })}
                </tbody>
            </table>:
            <div style={{textAlign:'center',fontWeight:'bold',fontSize:'20px'}}>No Data Found</div>           
            :<div></div>
            }

            </div>
    )
}



const History =() =>{
    const [slug,setSlug] = useState("")
    const [getHistory, {loading,error,data}] = useLazyQuery(historyBySlugQuery)    
    return (
        <Layout title="History">
            <div>
                {/* <div className="columns">
                    <input type="text" className="input is-small" placeholder="Search Invoice/Name"/>
                </div> */}
            <div>
                <div className="topHeading">
                    <h2>History</h2>
                </div>
                <div>
                    <form>
                    <div>
                        <div className="columns">
                            <div className="column">
                                <label className="label">Invoice/Name</label>
                                <input type="text" className="input is-small" placeholder="Search Invoice,name"
                                onChange={e=>setSlug(e.target.value)}
                                />
                            </div>
                            <div className="column is-3">
                                <label className="label" style={{visibility:'hidden'}}>Invoice/Name</label>
                                <input type="button" className="is-small button is-primary" value="Search"
                                onClick={()=>getHistory({variables:{"slug":slug}})}
                                />
                            </div>
                        </div>
                    </div>
                    </form>
                    <Result loading={loading} data={data}/>
                </div>
            </div>
            </div>
        </Layout>
    )
}

export default privateRoute(History);