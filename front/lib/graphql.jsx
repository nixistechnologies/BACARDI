import gql from 'graphql-tag';

export const getAllProductQuery = gql`
{
    allProducts{
      edges{
        node{
          id
          name
          purchaseFrom
          price
          qty
          typeOfPacking
        }
      }
    }
  }
`;


export const updateCurrentUserQuery = gql`
mutation x($gst:String!,$tin:String!,$firstName:String!,$lastName:String!,$phone:String!,$email:String!,$firm:String!,$address:String!){
  updateUser(gst:$gst,tin:$tin,firstname:$firstName,lastname:$lastName,phone:$phone,email:$email,firmName:$firm,address:$address)
  {
    user{
      id
      username
      firstName
      lastName
      email
      profile{
        firmName
        GSTNo
        TINNo
        address
        contactNumber
      }
    }
  }
}
`

export const currentUserQuery = gql`
query x{
  user{
    id
    username
    firstName
    lastName
    email
    profile{
      firmName
      GSTNo
      TINNo
      address
      contactNumber
    }
  }
}
`

export const getTokenQuery = gql`
mutation($username:String!,$password:String!){
  tokenAuth(username:$username,password:$password)
  {
    token
  }
}
`


export const createUserQuery = gql`
mutation x($username:String!$password:String!,$firstName:String!,$lastName:String!,$email:String!,$phone:String!,$gst:String!,$tin:String!,$firm:String!,$address:String!){
  createUser(
    username:$username,address:$address,password:$password,firstname:$firstName,lastname:$lastName,email:$email,phone:$phone,gst:$gst,tin:$tin,firmName:$firm
  ){
    user{
      id
      username
      profile{
        id
        GSTNo
        firmName
      }
    }
  }
}
`

export const historyBySlugQuery = gql`
query x($slug:String!){
  history(slug:$slug){
    edges{
      node{
				discount
        cgst
        sgst
        id
        invoiceNumber
        invoice
        grossAmount
        netAmount
        paymentMode
        billingDate
        patient{
          name
          age
          sex
        }
      }
    }
  }
}`


export const reportByDateRangeQuery = gql`
query x($min:String!,$max:String!){
  report(min:$min,max:$max){
    edges{
      node{
        discount
        cgst
        sgst
        id
        invoiceNumber
        invoice
        grossAmount
        netAmount
        paymentMode
        billingDate
        patient{
          name
          age
          sex
        }
      }
    }
  }
}
`


export const generateBillQuery = gql`
mutation x($medicines:[MInput!],$name:String!,$age:String!,$gender:String!, $date:String!,$gst:Float!,$payment:String!){
  generateBill(billingDate:$date,gst:$gst,medicines:$medicines,paymentMode:$payment,name:$name,age:$age,gender:$gender)
  {
    bill{
      invoice
      invoiceNumber
    }
  }
}
`

export const createUpdateCategorySubCategoryQuery = gql`
  mutation x($category:String!,$subcategory:String!,$hsn:String!,$gst:Float!){
    updateCategory(category:$category,subcategory:$subcategory,hsn:$hsn,gst:$gst){
      isNew
      category{
        id
        name
        subcategorySet{
          edges{
            node{
              id
              name
              GST
              hsn
              image
            }
          }
        }
      }
      subCategory{
        id
        name
        GST
        hsn
      }
      
    }
  }
`

export const getCateogryQuery = gql`
{
  categories{
    edges{
      node{
        id
        name
        subcategorySet{
          edges{
            node{
              id
              name
              GST
              hsn
              image
            }
          }
        }
      }
    }
  }
}
`

export const deleteSubCategoryQuery = gql`
  mutation x($id:ID!){
    deleteSubcategory(id:$id)
    {
      success
    }
  }
`

export const createSubCategoryQuery = gql`
  mutation x($id:String!,$category:String!,$name:String!,$hsn:String!,$gst:Int!,$isUpdate:Boolean!){
    updateSubcategory(id:$id,category:$category,name:$name,hsn:$hsn,gst:$gst,isUpdate:$isUpdate)
    {
      success
      subCategory{
        __typename
        name
        id
        product
        hsn
        GST
      }
    }
  }
`

export const subCategoryById = gql`
query x($id:ID!)
{
  subcategoy(id:$id)
  {
    edges{
      node{
        product
        id
        name
        hsn
        GST
      }
    }
  }
}
`

export const createCategoryQuery=gql`
mutation x($name:String!)
{
  createCategory(name:$name)
  {
    category{
      id
      name
      product
      subCategory
    }
  }
}
`

export const renameCategory = gql`
mutation x($id:ID!,$isUpdate:Boolean!,$name:String!){
  renameCategory(id:$id,isUpdate:$isUpdate,name:$name){
    success
  	category{
      subCategory
      product
      id
      name
    }
  }
}
`

export const allCategory=gql`
{
  categories{
    edges{
      node{
        subCategory
        product
        id
        name
      }
    }
  }
}
`

export const categorySuggestionQuery = gql`
query x($suggestion:String!){
  categorySuggestion(suggestion:$suggestion){
    name
    id
    subcategorySet{
      edges{
        node{
          id
          name
        }
      }
    }
  }
}
`

export const productSuggetionQueryC = gql`
query x($suggestion:String!){
  productSuggestion(suggestion:$suggestion){
    id
    name
    qty
    expiryDate
    expiryTime
    mrp
    cost
    price
    typeOfPacking
    discount
    image
    batch
    mfg
    remarks
    data
  }
}
`;

export const productSuggetionQuery = gql`
query x($suggestion:String!){
  productSuggestion(suggestion:$suggestion){
    id
    name
    qty
    price
    discount
    expiryDate
  }
}
`;

export const getAllPatient = gql`
{
  allCustomer{
    id
    name
  	email
    mobile
    address
  }
}
`;

export const createProductQuery = gql`
mutation x($name:String!,$qty:Int!,$typeofpack:String!,$mrp:Float!,$list:Float!,$cost:Float!, $exp:String!,$exp_time:Int!,$mfg:String!,$discount:Float!,$hsn:String!,$batch:String!)
{
  createProduct(name:$name,qty:$qty, mrp:$mrp,typeofpacking:$typeofpack,exp:$exp,hsn:$hsn,mfg:$mfg,discount:$discount,batch:$batch,expTime:$exp_time,listPrice:$list,costPrice:$cost)
  {
    product{
        id
				name
      	mrp
      	price
      	cost
    }
    isNew
  }
}
`;

export const getProductByIdQuery = gql`
query x($id:ID!){
    productById(id:$id)
    {
      id
      name
      price
      expiryDate
      purchaseFrom
      GST
    }
  }
`;

// export getAllProductQuery;