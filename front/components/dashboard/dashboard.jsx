import Layout from '../layout'
import {XYPlot, LineSeries,VerticalBarSeries,HorizontalGridLines,XAxis,YAxis,Hint,VerticalGridLines,LabelSeries} from 'react-vis'
import { historyBySlugQuery,dashboardQuery } from '../../lib/graphql'
import { useQuery } from 'react-apollo'
import { TableLoading,DashboadGridLoad } from '../skeleton'
import { server } from '../../lib/settings'
import Link from 'next/link'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faPlus, faEllipsisV, faDolly,faLuggageCart, faRupeeSign, faCoins} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

const SalesTable = ()=>{
    const {data:pageData,loading:pageLoading} = useQuery(historyBySlugQuery,{variables:{"slug":""}})
    return <>
    {pageLoading===true? <TableLoading/>:
    <>
    <style jsx>{`
    th,td{
        font-size:0.8em;
        border:1px solid #f7f5f5;
        border-width:0 0 1px;
    }
    .s-head{
        margin-bottom:20px;
        display:flex;
        align-items:center;
    }
    .s-head h2{
        width:100%;
        font-size:20px;
        font-family:nfontb;
    }
    
    `}</style>
    <div className="s-head">
        <h2>Recent Sales</h2>
        <Link href="/sales/history">
            <a className="tag is-primary">View All</a>
        </Link>
        
    </div>
    <table className="table is-fullwidth is-hoverable">
        <thead style={{background:'transparent !important'}}>
            <tr>
                {/* <th>SN.</th> */}
                {/* <th>Invoice Number</th> */}
                <th>Name</th>
                <th>Date</th>
                <th>Net Amount</th>
                {/* <th>Paid</th>
                <th>Outstanding</th> */}
                
            </tr>
        </thead>
        <tbody>
            {pageData.history.edges.map((item,i)=>{
                return (<tr key={item.node.id}>
                    {/* <td>{i+1}</td> */}
                    {/* <td>
                        <a href={`${server}/media/${item.node.invoice}`} target="_blank">
                            {item.node.invoiceNumber}
                        </a>
                    </td> */}
                    <td style={{fontFamily:'nfontb'}}>{item.node.customer.name}</td>
                    <td>{item.node.billingDate}</td>
                    <td>{item.node.netAmount}</td>
                    {/* <td style={{color:'green',fontWeight:'bold'}}>{item.node.paidAmount}</td>
                    <td>{item.node.outstanding}</td> */}
                    {/* <td onClick={()=>{setActive("is-active"),setPaid(item.node.paidAmount),setOutstanding(item.node.outstanding)}}>
                        
                        <FontAwesomeIcon icon={faEllipsisV} 
                        
                        color="grey"
                        
                        /> 
                        
                        </td> */}
                </tr>)
            })}
        </tbody>
        </table>
        </>
    }

    </>
}

const Graph=()=>{
    const [value,setValue] = useState(null)
    const data = [
        {x: "Jan", y: 2},
        {x: "Feb", y: 5},
        {x: "Mar", y: 4},
        {x: "Apr", y: 9},
        {x: "May", y: 1},
        {x: "Jun", y: 7},
        {x: "Jul", y: 6},
        {x: "Aug", y: 3},
        {x: "Sep", y: 2},
        {x: "Nov", y: 3},
        {x: "Dec", y: 5}
      ];
    return <>
    <style jsx>{`
    .s-head{
        margin-bottom:20px;
    }
    .s-head h2{
        font-size:20px;
        font-family:nfontb;
    }
    .sh{
        box-shadow:1px 1px 2px 0px rgba(0,0,0,0.2)
    }
    `}

    </style>
    <div style={{marginTop:"50px"}}>
        <div className="columns">
            <div className="column sh" style={{background:'white',marginRight:'5px',borderRadius:'3px'}}>
            <div className="s-head">
                <h2>Sales</h2>
            </div>
            
                <XYPlot height={300} width={500} color="#00c4a7" stackBy="y" xType="ordinal">
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    {/* <LabelSeries /> */}
                    <VerticalBarSeries 
                    
                    onValueMouseOver={(datapoint,event)=>{
                        console.log(datapoint)
                        setValue(datapoint);
                    }}
                    onSeriesMouseOut={v=>setValue(null)}
                    
                    // animation 
                    opacity={0.8} stroke="#00c4a7" style={{strokeLinejoin: "round"}} data={data} />
                    <XAxis />
                    <YAxis />
                    {
                        value &&
                        <Hint value={value} />

                    }
                    
                    {/* <Hint className="first-hint" data={data}/> */}
                    {/* <Hint className="second-hint"/> */}
                </XYPlot>
            </div>
            <div className="column sh" style={{background:'white',marginLeft:'5px',borderRadius:'3px'}}>
                <SalesTable />
            </div>
        </div>



    </div>

    </>
}


const TopGrid=()=>{
    const {data,loading} = useQuery(dashboardQuery)
    return <>
    <style jsx>{`
    .top-item{
        color:white;
        font-family:nfontb;
        // height:100px;
        // background:grey;
        margin:auto 5px;
        box-shadow:1px 1px 2px 0px rgba(0,0,0,0.2);
        border-radius:2px;
    }
    .top-item .up{
        font-weight:bold;
        font-size:11px;
        text-transform:uppercase;
    }
    .top-item .u_num{
        font-weight:bold;
        font-size:20px;
        // font-weight:bold;   
    }
    .top-item h5{
        font-size:0.7em;
        font-family:nfont;
        margin-top:10px;
    }

    
    `}</style>
    
    <div>

        {
            
        
        
        <div className="columns top">
            {loading==true?
            <div className="column">
                <DashboadGridLoad />
            </div>
            :
            <div className="column is-card top-item" style={{position:"relative", background:"linear-gradient(to right,#FF8872,#FF6E97)"}}> 
                
                <>
                    <h3 className="up ">Sales</h3>
                        <h2 className="u_num">&#8377; {data.dashboard.sales}</h2>
                    <h5>Since last month</h5>
                    <div style={{position:'absolute',top:'25%',right:'5%'}}>
                        <FontAwesomeIcon size="3x" icon={faDolly} color="rgba(255,255,255,0.2)" />
                    </div>

                </>
                
                
                

                
            </div>
            }
            
            
                {loading===true?
                    <div className="column">
                    <DashboadGridLoad />
                    </div>
                    :
                    <>
                    <div className="column is-card top-item" style={{position:"relative",background:"linear-gradient(to right,#33CBC1, #18A9CB)"}}> 
                    <h3 className="up ">Purchase</h3>
                    <h2 className="u_num">&#8377; {data.dashboard.purchase}</h2>
                    <h5>Since last month</h5>
                    <div style={{position:'absolute',top:'25%',right:'5%'}}>
                        <FontAwesomeIcon size="3x" icon={faLuggageCart} color="rgba(255,255,255,0.2)" />
                    </div>
                    </div>
                    </>
                
                }
                    
                
                
            
            
                {loading===true?
                    <div className="column">
                        <DashboadGridLoad />
                    </div>
                    :
                    <>
                    <div className="column is-card top-item" style={{position:"relative",background:"linear-gradient(to right,#57A0DE,#7F85EB)"}}> 
                        <h3 className="up ">Revenue</h3>
                        <h2 className="u_num">&#8377; 1,21,000</h2>
                        <h5>Since last month</h5>
                        <div style={{position:'absolute',top:'25%',right:'5%'}}>
                            <FontAwesomeIcon size="3x" icon={faRupeeSign} color="rgba(255,255,255,0.2)" />
                        </div>
                    </div>
                    </>

                }
                
            
            
                {loading===true?
                    <div className="column">
                <DashboadGridLoad />
                </div>
                :
                <>
                <div className="column is-card top-item" style={{position:"relative",background:"linear-gradient(to right,#ED7AED, #8D69E4)"}}> 
                    <h3 className="up ">Profit</h3>
                    <h2 className="u_num">&#8377; 50,000</h2>
                    <h5>Since last month</h5>
                    <div style={{position:'absolute',top:'25%',right:'5%'}}>
                        <FontAwesomeIcon size="3x" icon={faCoins} color="rgba(255,255,255,0.2)" />
                    </div>
                </div>
                </>
                }
                
            
        </div>
        }
    </div>

    </>    
}



const Dashboard = ()=>{
    return <>
        <Layout>
            <>
            <div>
                <div className="topHeading">
                    <h2>Dashboard</h2>
                {/* <div>
                    <button type="button" onClick={()=>setActive("is-active")} className="button is-rounded is-small is-primary">Add customer</button>
                </div> */}
                </div>
                <TopGrid />
                <Graph />
            </div>
            </>
        </Layout>
    </>
}

export default Dashboard;