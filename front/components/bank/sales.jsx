import { useQuery, useLazyQuery } from 'react-apollo'
import {useEffect,useState} from 'react'
import {BankByCustomerQuery} from '../../lib/graphql'
import { TableLoading } from '../skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignCenter, faList } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { NoPayment } from '../../pages/bank/purchase/[purchase]'
const Records = ({items}) =>{
    if(items.length == 0)
        return <NoPayment />
        
    return <>
    <table className="table is-fullwidth is-hoverable is-bordered">
        <thead>
            <tr>
                <th>SN.</th>
                <th className="_w20">Name</th>
                <th className="_w10">Amount</th>
                <th className="_w10">Paid</th>
                <th className="_w10">OutStanding</th>
                <th className="_w5" colSpan={1}></th>
            </tr>
            </thead>
            <tbody>
            {items.map((e,i)=>{
                return(
                // e.node.csales !=null &&
                <tr key={e.node.id}>
                    <td>{i+1}</td>
                    <td className="_heading _w30">
                        {e.node.customer.company}
                    </td>
                    <td>
                        {e.node.sales}
                    </td>
                    <td>
                        {e.node.paid}
                    </td>
                    <td>
                        {e.node.sales - e.node.paid}
                    </td>
                    
                    
                        <Link href={`bank/[sales]?name=${e.node.customer.company}`} as={`bank/${e.node.customer.id}?name=${e.node.customer.company}`}>
                            <td style={{cursor:'pointer'}}>
                                <FontAwesomeIcon icon={faList} />
                            </td>
                        </Link>    
                        
                    
                </tr>
                
                )
            })}
            </tbody>
            
    </table>
    </>
}


const Sales = ({text,setText}) =>{
    // const {data:odata,loading:oloading} = useQuery(BankByCustomerQuery,{variables:{search:""}})
    const [searchData,{data,loading}] = useLazyQuery(BankByCustomerQuery)
    useEffect(()=>{
        searchData({variables:{"search":text}})
    },[text])

    if(loading || data==undefined){
        return <TableLoading />
    }
    else{
        return <>
            <Records items ={
                data.customersByCompany.edges
            } />
        </>
    }

}
export default Sales