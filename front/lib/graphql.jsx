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


export const productSuggetionQueryC = gql`
query x($suggestion:String!){
  productSuggestion(suggestion:$suggestion){
    id
    name
    qty
    price
    expiryDate
    mfg
    purchaseFrom
    typeOfPacking
    hsn
    GST
    batch
    discount
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
  allPatient{
   id
   name
   age
   sex
 } 
}
`;

export const createProductQuery = gql`
mutation x($medicine:String!,$qty:Int!,$mrp:Int!$purchase:String!,$typeofpack:String!,$gst:String!,$exp:String!,$mfg:String!,$discount:Float!,$hsn:String!,$batch:String!)
{
  createProduct(medicine:$medicine,qty:$qty,mrp:$mrp,purchaseFrom:$purchase,typeofpacking:$typeofpack,gst:$gst,exp:$exp,hsn:$hsn,mfg:$mfg,discount:$discount,batch:$batch)
  {
    product{
        id
        name
        purchaseFrom
        price
        qty
        typeOfPacking
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