import Layout from '../../components/layout'
import {useRouter} from 'next/router'
import CreateProduct from '../../components/productForm'
import SnackbarProvider,{ useSnackbar } from 'react-simple-snackbar'
const ProductDetail = () =>{
    const router = useRouter()
    const {query} = router
    console.log(query)
    return(
        
        // <CreateProduct productId={query.product} name={query.name}/>
        <Layout>
            <SnackbarProvider>
                <CreateProduct productId={query.product} name={query.name}/>
            </SnackbarProvider>
        </Layout>
        // <Layout>
        //     Edit
        // </Layout>
    )
}
export default ProductDetail;