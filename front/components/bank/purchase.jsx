import { useQuery, useLazyQuery } from 'react-apollo'
import {useEffect,useState} from 'react'
import {BankByVendorQuery} from '../../lib/graphql'
import { TableLoading } from '../skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignCenter, faList } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
const Records = ({items}) =>{
    return <>
    <table className="table is-fullwidth is-hoverable is-bordered">
        <thead>
            <tr>
                <th>SN.</th>
                <th className="_w20">Name</th>
                <th className="_w10">Amount</th>
                <th className="_w10">Paid</th>
                <th className="_w10">OutStanding</th>
                <th className="_w5"></th>
            </tr>
            </thead>
            <tbody>
            {items.map((e,i)=>{
                return(
                
                <tr key={e.node.id}>
                    <td>{i+1}</td>
                    <td className="_heading _w30">
                        {e.node.company}
                    </td>
                    <td>
                        {e.node.purchase}
                    </td>
                    <td>
                        {e.node.paid}
                    </td>
                    <td>
                        {e.node.purchase - e.node.paid}
                    </td>
                    
                    
                        <Link href={`bank/purchase/[purchase]?name=${e.node.company}`} as={`bank/purchase/${e.node.id}?name=${e.node.company}`}>
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


const Purchase = ({text,setText}) =>{
    const {data:odata,loading:oloading} = useQuery(BankByVendorQuery)
    const [searchData,{data,loading}] = useLazyQuery(BankByVendorQuery)
    useEffect(()=>{
        searchData({variables:{"search":text}})
    },[text])

    if(loading || oloading){
        return <TableLoading />
    }
    return <>
        <Records items ={
            odata!=undefined ?odata.vendors.edges:data.vendors.edges
        } />
    </>
}
export default Purchase