import Layout from '../../components/layout'
import CreateProduct from '../../components/productForm'

const NewPurchase = () =>{
    return <>
        {/* <Layout> */}
            <CreateProduct purchase={true}/>
        {/* </Layout> */}
    </>
}

export default NewPurchase;