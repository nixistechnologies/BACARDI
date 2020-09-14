import Layout from '../../components/layout'
import { useQuery, useLazyQuery } from 'react-apollo'
import {getLedgersQuery,getAllPaymentLedgerQuery} from '../../lib/graphql'
import {TableLoading} from '../../components/skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faFileInvoice, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { server } from '../../lib/settings'
import { useState,useEffect } from 'react'
import { NoPayment } from '../bank/purchase/[purchase]'

const Records = ({items}) =>{
    if(items.length == 0)
        return <NoPayment />
    return <>
    <table className="table is-fullwidth is-hoverable is-bordered">
        <thead>
            <tr>
                <th>SN.</th>
                <th className="_w10">Date</th>
                <th className="_w20">Particulars</th>
                
                <th className="_w10">Type</th>
                {/* <th className="_w20">Invoice Number</th> */}
                <th className="_w10">Credit</th>
                <th className="_w10">Debit</th>
                {/* <th className="_w10">File</th> */}
                {/* <th className="_w5" colSpan={2}></th> */}
            </tr>
            </thead>
            <tbody>
            {items.map((e,i)=>{
                return(
                
                <tr key={e.node.id}>
                    <td>{i+1}</td>
                    <td>
                        {/* {e.node.sale !=null ?e.node.sale.billingDate:e.node.purchase.createdDate} */}
                        {e.node.date}
                    </td>
                    <td className="_heading _w30">
                            {e.node.customer !=null ?e.node.customer.company:e.node.vendor.company}
                    </td>
                    
                    
                    <td>
                        {e.node.customer !=null ?"Sale":"Purchase"}
                    </td>
                    {/* <td>
                        {e.node.sale !=null ?e.node.sale.invoiceNumber:e.node.purchase.invoiceNumber}
                    </td> */}
                    
                    <td>
                        {e.node.customer !=null && e.node.paid}
                    </td>
                    <td>
                        {e.node.vendor !=null && e.node.paid}
                    </td>
                    {/* <td>
                        <a target="_blank" href={`${server}${e.node.sale !=null ?`/invoice/${e.node.sale.id}/${e.node.sale.user.id}`:`/media/${e.node.purchase.invoiceFile}`}`}>
                            <FontAwesomeIcon icon={faPaperclip} />
                        </a>
                    </td> */}

                </tr>
                
                )
            })}
            </tbody>
            
    </table>
    </>
}

const Ledger = () =>{
    const [text,setText] = useState("")
    // const {data,loading,fetchMore} = useQuery(getAllPaymentLedgerQuery,{variables:{"search":"","after":""}})
    const [searchData,{data,loading,fetchMore}] = useLazyQuery(getAllPaymentLedgerQuery)
    const [offset,setOffset] = useState([])
    const [endCursor,setEndcursor] = useState("")
    const [hasMore,setHasMore] = useState(true)
    useEffect(()=>{
        searchData({variables:{"search":text,after:""}})
    },[text])
    
    useEffect(()=>{
        if(data!=undefined){
            console.log(data.allPayment.pageInfo)
            setEndcursor(data.allPayment.pageInfo.endCursor)
            setHasMore(data.allPayment.pageInfo.hasNextPage)
            setOffset([...offset, ...data.allPayment.edges])
        }

    },[data])

    const LoadMore = () =>{
        console.log(endCursor)
        console.log("more..")
        fetchMore({
            query:getAllPaymentLedgerQuery,
            variables:{search:text,after:endCursor},
            
            updateQuery:(previous,{fetchMoreResult}) => {
                // console.log(c)
                // console.log(previous.allPayment.pageInfo.endCursor)
                // console.log(fetchMoreResult.allPayment.pageInfo.endCursor)

                // previous.allPayment.pageInfo = fetchMoreResult.allPayment.pageInfo


                const newEntry = fetchMoreResult.allPayment
                // console.log(newEntry)


                // setHasMore(newEntry.pageInfo.hasNextPage)
                // setEndcursor(newEntry.pageInfo.endCursor)
                // console.log()
                // console.log(previous)
                // console.log()

                previous.allPayment.pageInfo.hasNextPage = newEntry.pageInfo.hasNextPage
                previous.allPayment.pageInfo.endCursor = newEntry.pageInfo.endCursor


                // previous.allPayment.edges = [...previous.allPayment.edges,...newEntry.edges]
                // console.log(previous.allPayment.edges)
                
                // console.log(fetchMoreResult)
                // setEndcursor(newEntry.pageInfo.endCursor)
                // setHasMore(newEntry.pageInfo.hasNextPage)

                previous.allPayment.edges.push(...newEntry.edges)
                // console.log(previous.allPayment.edges)
                // setOffset([...offset,...newEntry.edges])
                // console.log(cac)
                // return previous.allPayment.edges
                // console.log(previous.allPayment.edges)
            },
            
        })
    }
    
    // console.log(data)
    
    // console.log(data)
    console.log(offset)

    return <>
        <Layout title="Ledger" text={text} setText={setText}>
            <div>
                <div className="topHeading">
                    <h2>Ledgers</h2>
                    <div>
                        <a target="_blank" href={`${server}/export/${text==""?"all":text}`} className="tag is-small is-rounded is-primary">Export To Excel</a>
                    </div>
                </div>

            </div>
            {
                loading || data ==undefined ?
                <TableLoading />
                :<>
                <Records items={offset} />
                {
                    // hasMore
                }
                {/* data.allPayment.pageInfo.endCursor */}
                {
                    hasMore &&
                    <span className="button is-primary" onClick={()=>LoadMore()}>More</span>    
                }
                
                </>    
            }
            

            
        </Layout>
    </>
}

export default Ledger