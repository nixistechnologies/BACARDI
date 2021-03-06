
import Skeleton from 'react-loading-skeleton'
export const FullPageLoading = () =>{
    return(
        <div >
            <div style={{ marginTop:"13px",marginLeft:"10px",marginBottom:"20px"}}>
            <Skeleton height={50} width={100}/>
            </div>
            <div>
                <Skeleton height={20} count={4} style={{marginBottom:"5px"}}/>
            </div>
        
    </div>
    )
}


export const BillPageLoading = () =>{
    return(
        <div >
            <div style={{ marginTop:"13px",marginLeft:"10px",marginBottom:"20px"}}>
            <Skeleton height={50} width={100}/>
            </div>
        <div style={{marginTop:"10px",marginBottom:"20px"}}>
            <Skeleton height={20} count={2}/>
        </div>
        <div style={{marginTop:"10px",marginBottom:"20px"}}>
            <Skeleton height={20} count={2}/>
        </div>
        <div style={{marginTop:"10px",marginBottom:"20px"}}>
            <Skeleton height={20} count={2}/>
        </div>
        
    </div>
    )
}

export const DashboadGridLoad = () =>{
    return <div>
        <div>
            <Skeleton height={5} width={"30%"}/>
        </div>

        <div>
        <Skeleton height={13} width={"50%"} />
        </div>    
        <div style={{marginTop:'10px'}}>
            <Skeleton height={5} width={"20%"} />
        </div>
        
        </div>
}

export const TableLoading = () =>{
    return(
        <Skeleton count={5} />
    )
}