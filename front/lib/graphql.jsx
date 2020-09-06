import gql from 'graphql-tag';

export const getAllCustomersQuery = gql`
query($search:String!){
  customers(search:$search){
    edges{
      node{
        id
        name
        address
        email
        mobile
        gstNumber
        state
        addharNo
        company
        zipcode
        city        
      }
    }
  }
}
`

export const lastBillNumber = gql`
query x($id:String!){
  lastNumber(id:$id){
    exist
    lastNumber
  }
}
`

export const customerSuggestion = gql`
query x($suggestion:String!){
  customerSuggestion(suggestion:$suggestion,first:5)
  {
		edges{
      node{
          id
          name
          address
          mobile
          email
          state
          city
          addharNo
          company
      }
    }
  }
}
`

export const createOrUpdateCustomerQuery = gql`
mutation x($city:String!,$state:String!$addhar:String!,$name:String!,$id:String!, $mobile:String!$gst:String!,$address:String!,$email:String!,$isNew:Boolean!,$zipcode:String!,$company:String!){
  createCustomer(id:$id,name:$name,mobile:$mobile,gst:$gst,address:$address,email:$email,isNew:$isNew,city:$city,state:$state,addhar:$addhar,zipcode:$zipcode,company:$company)
  {
    customer{
      id
      name
      mobile
      gstNumber
      address
      email
      state
      city
      addharNo 
      company
      zipcode
    }
  }
}
`


export const getAllProductQuery = gql`
query x($search:String!){
  allProducts(search:$search){
    edges{
      node{
        id
        name
        taga
        price
        cost
        grossm
        less
        netm
      }
    }
  }
}
`;

export const updateAddressQuery = gql`
mutation x($state:String!,$city:String!,$zipcode:String!,$address:String!){
  updateAddress(state:$state,city:$city,zipcode:$zipcode,address:$address)
  {
    user{
      id
      profile{
        id
        state
        city
        zipcode
        address
      }
    }
  }
}
`

export const updateFirmQuery = gql`
mutation x($firm:String!,$gst:String!){
  updateFirm(firmName:$firm,gst:$gst)
  {
    user{
      id
      profile{
        id
        firmName,
        GSTNo
      }
    }
  }
}
`

export const getPersonalQuery = gql`
query{
  user{
    id
    firstName
    lastName
    username
    email
    profile{
      id
      contactNumber
      image
    }
  }
}
`

export const getBankQuery = gql`
{
  user{
    id
    bank{
      id
      accountNo
      name
      bankName
      branch
      ifscCode
    }
  }
}
`
export const bankPurchaseDetailQuery = gql`
query x($id:ID!){
  vendor(id:$id,){
    id
    company
    paritalpaymentSet{
      edges{
        node{
          id
          paid
          outstanding
          date
        }
      }
    }
  }
}
`

export const bankDetailQuery = gql`
query x($id:ID!){
  customer(id:$id,){
    id
    company
    paritalpaymentSet{
      edges{
        node{
          id
          paid
          outstanding
          date
        }
      }
    }
  }
}
`

export const BankByCustomerQuery = gql`
query{
  customers(search:""){
    edges{
      node{
        sales
        outstanding
        paid
        id
        name
        company
      }
    }
  }
}
`
export const BankByVendorQuery = gql`
{
  vendors(search:"")
  {
    edges{
      node{
        id
        paid
        outstanding
        purchase
        name
        company
      }
    }
  }
}
`

export const getLedgersQuery = gql`
query x($search:String!){
  ledgers(search:$search,first:10)
   {
     edges{
       node{
         id
         sale{
           id
           invoiceNumber
           billingDate
           invoice
           netAmount
           user{
            id
            }
           customer{
             id
             name
             company
           }
         }        
         purchase{
           id
           invoiceFile
           createdDate
           invoiceNumber
           totalBill
           vendor{
             id
             company
             name
           }
         }
       }
     }
   }
 }
`

export const updateBankQuery = gql`
mutation x($ifsc:String!,$bank:String!,$name:String!,$branch:String!,$account:String!){
  updateBank(ifscCode:$ifsc,bankName:$bank,name:$name,branch:$branch,account:$account){
    user{
      id
      bank{
        id
        ifscCode
        bankName
        name
        branch
        accountNo
      }
    }
  }
}
`
export const getAddressQuery = gql`
{
  user{
    id
    profile{
      id
      state
      city
      zipcode
      address
    }
  }
}
`

export const getFirmQuery = gql`
{
  user{
    id
    profile{
      id
      firmName
      GSTNo
    }
  }
}
`

export const updatePersonalQuery = gql`
mutation x($firstname:String!,$lastname:String!,$phone:String!,$email:String!){
  updatePersonal(firstname:$firstname,lastname:$lastname,phone:$phone,email:$email)
  {
    user{
			firstName
      lastName
      email
      username
      profile{
        contactNumber
      }
    }
  }
}
`

export const updateCurrentUserQuery = gql`
mutation x($gst:String!,$firstName:String!,$lastName:String!,$phone:String!,$email:String!,$firm:String!,$address:String!,$state:String!,$city:String!,$zipcode:String!){
  updateUser(gst:$gst,firstname:$firstName,lastname:$lastName,phone:$phone,email:$email,firmName:$firm,address:$address,city:$city,state:$state,zipcode:$zipcode)
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
        state
        city
        zipcode
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
      address
      contactNumber
      state
      city
      zipcode
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


export const vendorSuggestionQuery = gql`
query x($name:String!){
  vendors(nameContains:$name,search:"")
  {
    edges{
      node{
        id
        name
        gst
        email
      }
    }
  }
}
`

export const purchaseProductQuery = gql`
query x($purchaseId:ID!){
  purchaseProduct(purchaseId:$purchaseId)
  {
    edges{
      node{
        id
        product{
          id
          name
        }
        listPrice
        discount
        grossm
        netm
        less
        cost
      }
    }
  }
}
`

export const addPurchaseQuery = gql`
  mutation($products:[PurchaseInput],$date:String!,$invoiceNumber:String!,$vendorId:ID!,$file:Upload!){
    addPurchase(products:$products,invoiceDate:$date,invoiceNumber:$invoiceNumber,vendorId:$vendorId,invoice:$file)
    {
      purchase{
        originalId
        products
        id
        invoiceNumber
        invoiceDate
        vendor{
          name
          company
        }
      }
    }
  }
`


// {
//   "products": [{
//     "productId": "UHJvZHVjdE5vZGU6MTU=","price": 2000,"mrp": 3000,"cost": 2800,"qty": 10,"discount": 4 
//   },{"productId": "UHJvZHVjdE5vZGU6NA==","price": 66,"mrp": 90,"cost": 60,"qty": 5,"discount": 1 
//   }],
//   "date": "2020-08-01",
//   "invoiceNumber": "LSKC#121",
//   "vendorId": "VmVuZG9yTm9kZToxNg=="
// }


export const purchaseHistoryDateQuery = gql`
query x($dateGte:Date!,$dateLte:Date!){
  purchases(slug:"",dateGte:$dateGte,dateLte:$dateLte)
  {
    edges{
      node{
        products
        id
        date
        invoiceDate
        invoiceNumber
        invoiceFile
        vendor{
          name
          company
        }
      }
    }
  }
}`

export const purchaseHistoryQuery = gql`
query x($slug:String!){
  purchases(slug:$slug)
  {
    edges{
      node{
        products
        id
        
        invoiceDate
        invoiceNumber
        invoiceFile
        vendor{
          name
          company
        }
      }
    }
  }
}
`

export const productStartsWithQuery = gql`
query ($name:String!){
  allProducts(search:$name,first:10){
    edges{
      node{
        id
        name
        
        price
        cost
        less
        grossm
        netm
        
      }
    }
  }
}
`

export const dashboardQuery = gql `
{
  dashboard{
    sales
    purchase
  }
}
`

export const historyBySlugQuery = gql`
query x($slug:String!){
  history(slug:$slug,first:20){
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
        outstanding
        paidAmount
        user{
          id
        }
        customer{
          id
          name
        }
      }
    }
  }
}`

export const cityByStateQuery = gql`
query x($id:ID!)
{
  city(stateId:$id)
  {
    edges{
      node{
        id
        name
      }
    }
  }
}
`

export const stateQuery = gql`
query {
  states{
    edges{
      node{
        id
        name
      }
    }
  }
}
`


export const createVendorQuery = gql`
mutation x($isNew:Boolean!, $name:String!,$email:String!,$mobile:String!,$company:String!,$address:String!,$city:String!,$state:String!,$zip:String!,$gst:String!,$id:String!){
  createVendor(name:$name,email:$email,mobile:$mobile,company:$company,address:$address,city:$city,state:$state,zipcode:$zip,gst:$gst,id:$id,isNew:$isNew){
    vendor{
      id
      name
      email
      mobile
      company
      address
      city{
        id
        name
      }
      state{
        id
        name
      }
      zipCode
      gst
    }
  }
}

`

export const allVendorQuery = gql`
query x($search:String!){
  vendors(search:$search){
    edges{
      node{
        id
        name
        company
        gst
        email
        mobile
        address
        state{
          id
          name
        }
        city{
          id
          name
        }
        zipCode
      }
    }
  }
}
`

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
        outstanding
        paidAmount
        user{
          id
        }
        customer{
          id
          name
        }
      }
    }
  }
}
`


export const generateBillQueryOld = gql`
mutation x($paid:Float!, $products:[MInput!],$remarks:String!,$customerId:ID!,$date:String!,$payment:String!){
  generateBill(payment:$paid, billingDate:$date,products:$products,paymentMode:$payment,customerId:$customerId,remarks:$remarks)
  {
    bill{
      invoice
      invoiceNumber
    }
  }
}
`

export const generateBillQuery = gql`
mutation x($products:[MInput!],$remarks:String!,$customerId:ID!,$date:String!,$payment:String!,$invoice_number:String!){
  generateBill(billingDate:$date,products:$products,paymentMode:$payment,customerId:$customerId,remarks:$remarks,invoiceNumber:$invoice_number)
  {
    bill{
      id
      invoice
      invoiceNumber
      billingDate
      user{
        id
      }
      netAmount
      paymentMode
      customer{
        id
        name
      }
    }
    ledger{
      id
      sale{
        id
        invoiceNumber
        billingDate
        invoice
        netAmount
        user{
          id
          }
        customer{
          id
         name
        }
      }
      purchase{
        id
      }
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

export const deleteVendor = gql`
  mutation x($id:String!){
    deleteVendor(id:$id)
    {
      success
    }
  }
`

export const deleteCustomer = gql`
  mutation x($id:String!){
    deleteCustomer(id:$id)
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
query x($id:ID!,$search:String!)
{
  subcategoy(id:$id,search:$search)
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
query x($search:String!){
  categories(search:$search){
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
    grossm
    less
    netm
    price
    cost
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
mutation x($isNew:Boolean!,$pid:String!,$name:String!,$taga:Float!,$listPrice:Float!,$costPrice:Float!,$exp:String!,$hsn:String!,$grossm:Float!,$less:Float!,$netm:Float!){
  createProduct(isNew:$isNew,pid:$pid,name:$name,taga:$taga,listPrice:$listPrice,costPrice:$costPrice,exp:$exp,hsn:$hsn,grossm:$grossm,less:$less,netm:$netm)
  {
    product{
      id
      name
      taga
      price
      cost
      hsn
      grossm
      less
      netm
    }
    isNew
  }
}
`;


export const deleteProductQuery = gql`
mutation X($id:String!){
  deleteProduct(id:$id){
    success
  }
}
`

export const getProductByIdQuery = gql`
query x($id:ID!){
  productById(id:$id)
  {
    id
    name
    taga
    price
    cost
    hsn
    expiryDate
    grossm
    less
    netm
  }
}
`;

// export getAllProductQuery;