import { useRouter } from 'next/router'
import Layout from '../../../components/layout'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faPlus} from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt,faEdit } from '@fortawesome/free-regular-svg-icons'
import {subCategoryById} from '../../../lib/graphql'
import {useQuery} from '@apollo/react-hooks'
import {TableLoading} from '../../../components/skeleton'
import Link from 'next/Link'

const Records=({rdata})=>{
    return(<div>
        <table className="table is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <th className="w30" > Name</th>
                    <th className="w10">HSN Code</th>
                    <th className="w10">GST</th>
                    <th className="w5"></th>
                    <th className="w5"></th>
                    <th className="w5"></th>
                </tr>
                </thead>
                <tbody>
                {rdata.map((e)=>{
                    return(<tr key={e.node.id}>
                        <td className="_heading w30">
                            {/* <Link href="category/[subcategory]" as={`category/${e.node.id}`}> */}
                                {/* <a> */}
                                    {e.node.name}
                                {/* </a> */}
                            {/* </Link> */}
                        </td>
                        <td>
                            {e.node.hsn}
                        </td>
                        <td>
                            {e.node.GST}
                        </td>
                        
                        <td className="hover" 
                        // onClick={()=>{setActive("is-active"),setName(e.node.name),setId(e.node.id)}}
                        >
                            <FontAwesomeIcon icon={faPen} color="#00d1b2" />
                        </td>
                        <td 
                        // onClick={()=>{setdelActive("is-active"),setName(e.node.name),setId(e.node.id)}}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} color="red"/>
                        </td>
                        <td className="hover">
                            
                            
                            <button className="button is-small is-rounded is-primary is-light"><FontAwesomeIcon icon={faPlus} /> <span style={{marginLeft:"3px"}}>Add</span></button>
                        
                        </td>

                    </tr>)
                })}
                </tbody>
        </table>
    </div>)
}







const SubCategory=()=>{
    const router = useRouter()
    const {query} = router
    const subCategoryId = query.subcategory
    const {data,loading} = useQuery(subCategoryById,{variables:{"id":subCategoryId}})
    // console.log(query.subcategory)

    console.log(router)
    console.log(data)
    return(
        <Layout title="Sub Category">
            <>
            <div className="topHeading">
                <div style={{width:"100%"}}>
                    <h2>{query.name}</h2>
                </div>
                <div>
                    <Link href="/category">
                        <a className="button is-rounded is-small is-bold is-primary" style={{fontWeight:"bold"}}>Add subcategory</a>
                    </Link>
                </div>            
            </div>
            {
                loading==true
                ?<TableLoading/>
                :<Records rdata={data.subcategoy.edges} />
            }
            </>
        </Layout>
    )

}

export default SubCategory;