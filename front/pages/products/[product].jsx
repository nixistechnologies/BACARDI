import Layout from '../../components/layout'
import {useRouter} from 'next/router'
import CreateProduct from '../../components/productForm'
const ProductDetail = () =>{
    const router = useRouter()
    const {query} = router
    console.log(query)
    return(
        
        <CreateProduct productId={query.product} name={query.name}/>
        // <Layout>
        //     Edit
        // </Layout>
    )
}
export default ProductDetail;