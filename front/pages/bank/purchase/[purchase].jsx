// import Layout from '../../../components/layoutout'
import Layout from '../../../components/layout'
import { useRouter } from 'next/router'
import { useQuery } from 'react-apollo'
import { TableLoading } from '../../../components/skeleton'
import {bankPurchaseDetailQuery} from '../../../lib/graphql'

const Records = ({items}) =>{
    return <>
    <table className="table is-fullwidth is-hoverable is-bordered">
        <thead>
            <tr>
                <th>SN.</th>
                <th className="_w20">Date</th>
                <th className="_w10">Paid</th>
                <th className="_w10">OutStanding</th>
                {/* <th className="_w5" colSpan={1}></th> */}

                {/* <th className="_w10">File</th> */}
                {/* <th className="_w5" colSpan={2}></th> */}
            </tr>
            </thead>
            <tbody>
            {items.map((e,i)=>{
                return(
                
                <tr key={e.node.id}>
                    <td>{i+1}</td>
                    <td className="_heading _w30">
                        {e.node.date}
                            {/* {e.node.sale !=null ?e.node.sale.customer.name:e.node.purchase.vendor.name} */}
                    </td>
                    <td>
                        {e.node.paid}
                    </td>
                    <td>
                        {e.node.outstanding}
                    </td>
                    {/* <td>
                        0
                    </td> */}
                    
                    {/* <td>
                        <Link href={`bank/[detail]?name=${e.node.company}`} as={`bank/${e.node.id}?name=${e.node.company}`}>
                            <FontAwesomeIcon icon={faList} />
                        </Link>
                        
                    </td> */}
                </tr>
                
                )
            })}
            </tbody>
            
    </table>
    </>
}
export const NoPayment = () =>{
    return <>
    <div>
        <h1 style={{fontFamily:'nfont',fontSize:'1.5em',textAlign:'center',marginTop:'15%'}}>
            No Payment Found
        </h1>
    </div>
    </>
}

const PurchaseDetail=()=>{
    const router = useRouter()
    
    const {query} = router
    const id = query.purchase
    const {data,loading} = useQuery(bankPurchaseDetailQuery,{variables:{"id":id}})
    console.log(query)
    return <>
        <Layout>
            <div>
                <nav className="breadcrumb" aria-label="breadcrumbs">
                    <ul>
                        <li><a onClick={()=>router.back()}>Bank</a></li>
                        <li className="is-active">
                            <a href="#" aria-current="page">{query.name}</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div>
                <div className="topHeading">
                    <h2>{query.name}</h2>
                    <div>
                        <button type="button" className="button is-rounded is-small is-primary">Add Payment</button>
                    </div>
                </div>
                <div>
                </div>
                {
                    loading ?
                    <TableLoading />:
                    data.vendor.paritalpaymentSet.edges.length == 0?
                        <NoPayment />
                    :
                    <Records items ={
                        data.vendor.paritalpaymentSet.edges
                    } />
                }
            </div>
            
        </Layout>
    
    </>
}
export default PurchaseDetail;