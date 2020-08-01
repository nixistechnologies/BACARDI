import Layout from '../../components/layout'

// import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
// import { createProductQuery,productSuggetionQueryC,categorySuggestionQuery,allCategory,subCategoryById,getAllProductQuery } from '../../lib/graphql';
// import { useState, useEffect } from 'react';
// import { connect } from 'react-redux'
// import {createProduct} from '../../redux_function/actions'
// import {useForm} from 'react-hook-form'
// import client from '../../lib/apolloClient';
// import { gql } from 'apollo-boost';
// import { useStore,useDispatch, useSelector } from 'react-redux'
// import { FullPageLoading } from '../../components/skeleton';

import CreateProduct from '../../components/productForm'
import SnackbarProvider,{ useSnackbar } from 'react-simple-snackbar'





const X=()=>{
    return(
        <Layout>
            <SnackbarProvider>
                <CreateProduct/>
            </SnackbarProvider>
        </Layout>
    )
}

export default X;