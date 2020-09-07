import graphene
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from app.models import *
from graphene import relay
from django.contrib.auth.models import User
from graphene.relay.node import from_global_id
import datetime
from django.contrib.auth import get_user_model
from django.core.files import File
from django.template.loader import get_template 
from django.template import Context
import pdfkit
import os
from fpdf import FPDF
import django_filters
from django_filters import FilterSet
from graphene_file_upload.scalars import Upload
from django.db.models import Q

class Dashboard(graphene.ObjectType):
    sales = graphene.Int()
    purchase = graphene.Int()

    def resolve_sales(parent,info):
        print(parent)

        return parent['sales']
    
    def resolve_purchase(parent,info):
        return parent['purchase']

class InvoiceNumber(graphene.ObjectType):
    last_number = graphene.Int()
    exist = graphene.Boolean()
    def resolve_last_number(parent,info):
        return parent["last_number"]
    def resolve_exist(parent,info):
        return parent["exist"]

# class LedgerCustom(graphene.ObjectType):


class BankNode(DjangoObjectType):
    class Meta:
        model = Bank
        filter_fields=()
        interfaces = (relay.Node,)

class LedgerNode(DjangoObjectType):
    class Meta:
        model = Ledgers
        filter_fields=()
        interfaces = (relay.Node,)


class UserNode(DjangoObjectType):
    class Meta:
        model = User
        filter_fields=()
        interfaces = (graphene.Node,)
        # interfaces = (relay.Node,)
# class PurchaseProductFilter(FilterSet):
#     purchase_id = django_filters.NumberFilter(field_name="purchase__id",lookup_expr="exact")
#     class Meta:
#         model = PurchaseProduct
#         fields = ["purchase__id"]


class PurchaseProductNode(DjangoObjectType):
    class Meta:
        model = PurchaseProduct
        filter_fields=()
        # filterset_class = PurchaseProductFilter
        interfaces = (relay.Node,)


class PurchaseFilter(FilterSet):
    vendor__iexact = django_filters.CharFilter(field_name="vendor__name",lookup_expr="iexact")
    date_gte = django_filters.DateFilter(field_name="date",lookup_expr="gte")
    date_lte = django_filters.DateFilter(field_name="date",lookup_expr="lte")
    class Meta:
        model = Purchase
        fields = ["vendor__name","date_gte","date_lte"]
        
        filter_fields={
            # "vendor__name":["iexact"],
            "date":["lte","gte"],
        }
    @property
    def qs(self):
        return super(PurchaseFilter,self).qs.filter(user_id = self.request.user.id) 

class PurchaseNode(DjangoObjectType):
    class Meta:
        model = Purchase
        # filter_fields=()
        

        filterset_class = PurchaseFilter
        interfaces = (relay.Node,)
    products = graphene.Int()
    originalId = graphene.Int()
    def resolve_products(self,info):
        return len(PurchaseProduct.objects.filter(purchase_id = self.id))
    def resolve_originalId(self,info):
        return self.id

class ProductFilter(FilterSet):
    name_startswith = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    class Meta:
        model = Product
        fields = ["name",]
    @property
    def qs(self):
        return super(ProductFilter,self).qs.filter(user_id = self.request.user.id)


class ProductNode(DjangoObjectType):
    class Meta:
        model = Product
        filterset_class = ProductFilter
        # filter_fields=()
        interfaces = (relay.Node,)
        
class CategoryNode(DjangoObjectType):
    subCategory = graphene.Int()
    product = graphene.Int()
    class Meta:
        model = Category
        filter_fields = ()
        interfaces = (relay.Node,)
    def resolve_subCategory(self,info):
        return len(SubCategory.objects.filter(category_id=self.id))
    def resolve_product(self,info):
        return len(Product.objects.filter(subcategory_id__in=[i.id for i in SubCategory.objects.filter(category_id=self.id)]))

class SubCategoryNode(DjangoObjectType):
    product = graphene.Int()
    class Meta:
        model = SubCategory
        filter_fields = ()
        interfaces = (relay.Node,)
    def resolve_product(self,info):
        return len(Product.objects.filter(subcategory_id=self.id))

class ProfileNode(DjangoObjectType):
    class Meta:
        model = Profile
        filter_fields=()
        interfaces = (relay.Node,)

class BillingFilter(FilterSet):
    # customer__name = django_filters.CharFilter(lookup_expr=["iexact"])
    customer__iexact = django_filters.CharFilter(field_name="customer__name",lookup_expr="in")

    # INV#8-6
    class Meta:
        model = Billing
        fields = ["customer__name","invoice_number"]
    @property
    def qs(self):
        return super(BillingFilter,self).qs.filter(user_id = self.request.user.id).order_by("-id")

class PartialPaymentNode(DjangoObjectType):
    class Meta:
        model = ParitalPayment
        filter_fields =()
        interfaces = (relay.Node,)

class BillingNode(DjangoObjectType):
    class Meta:
        model = Billing
        # filter_fields = ["customer__name",]
        filterset_class = BillingFilter
        # filter_fields={
        #     "customer__name":["exact","iexact"],   
        # }

        interfaces = (relay.Node,)

class CustomerNode(DjangoObjectType):
    sales = graphene.Float()
    paid = graphene.Float()
    outstanding = graphene.Float()



    # purchase = graphene.Int()
    class Meta:
        model = Customer
        filter_fields=()
        interfaces = (relay.Node,)
    def resolve_sales(self,info):
        return sum([i.net_amount for i in Customer.objects.get(id=self.id).billing_set.all()])
    
    def resolve_paid(self,info):
        return sum([i.paid for i in Customer.objects.get(id=self.id).paritalpayment_set.all()])
    def resolve_outstanding(self,info):
        return sum([i.outstanding for i in Customer.objects.get(id=self.id).paritalpayment_set.all()])

    
class Sales_ProductNode(DjangoObjectType):
    class Meta:
        model = Sales_Product
        filter_fields=()
        interfaces = (relay.Node,)        

class VendorFilter(FilterSet):
    name_contains = django_filters.CharFilter(field_name="name",lookup_expr="icontains")
    class Meta:
        model = Vendor
        fields = ["name"]
    @property
    def qs(self):
        return super(VendorFilter,self).qs.filter(user_id = self.request.user.id)


class VendorNode(DjangoObjectType):
    purchase = graphene.Float()
    paid = graphene.Float()
    outstanding = graphene.Float()

    class Meta:
        model = Vendor
        # filter_fields = ()
        filterset_class = VendorFilter
        interfaces = (relay.Node,)

    def resolve_purchase(self,info):
        return sum([i.total_bill for i in Vendor.objects.get(id=self.id).purchase_set.all()])
    
    def resolve_paid(self,info):
        return sum([i.paid for i in Vendor.objects.get(id=self.id).paritalpayment_set.all()])
    def resolve_outstanding(self,info):
        return sum([i.outstanding for i in Vendor.objects.get(id=self.id).paritalpayment_set.all()])

class StateNode(DjangoObjectType):
    class Meta:
        model = State
        filter_fields = ()
        interfaces = (relay.Node,)
class CityNode(DjangoObjectType):
    class Meta:
        model = City
        filter_fields = ()
        interfaces = (relay.Node,)


class CreateProduct(graphene.Mutation):
    class Arguments:
        is_new = graphene.Boolean(required=True)
        pid = graphene.String(required=True)

        name = graphene.String(required=True)
        taga = graphene.Float(required=True)
        grossm = graphene.Float(required=True)
        less = graphene.Float(required=True)
        netm = graphene.Float(required=True)
        # qty = graphene.Int(required=True)
        # typeofpacking = graphene.String(required=True)


        # mrp = graphene.Float(required=True)
        cost_price = graphene.Float(required=True)
        list_price = graphene.Float(required=True)
        # purchase_from = graphene.String(required=True)
        
        # gst = graphene.String(required=True)
        # mfg = graphene.String(required=True)
        exp = graphene.String(required=True)
        # exp_time = graphene.Int(required=True)

        # discount = graphene.Float(required=True)
        hsn = graphene.String(required=True)
        # batch = graphene.String(required=True)

        # category_id = graphene.ID(required=True)
        # sub_category_id = graphene.ID(required=True)

    product = graphene.Field(ProductNode)
    isNew = graphene.Boolean()
    def mutate(self,info,pid,is_new,name,taga,grossm,less,netm, cost_price,list_price,exp,hsn):
        # p = Product.objects.filter(name=name)
        if(is_new is False):
            p = Product.objects.get(id=from_global_id(pid)[1])
            p.name = name
            p.taga = taga
            # p.type_of_packing = typeofpacking

            # p.mrp = mrp
            p.price = list_price
            p.cost = cost_price

            # p.mfg = mfg
            p.expiry_date = datetime.datetime.strptime(exp,"%Y-%m-%d") 
            # p.expiry_time = exp_time

            # p.discount = discount
            p.hsn = hsn
            p.grossm = grossm
            p.netm = netm
            p.less = less
            # p.batch = batch
            # p.subcategory_id = from_global_id(sub_category_id)[1]
            p.save()

            return CreateProduct(product = p,isNew = False)
            

        else:
            product = Product.objects.create(
                name = name,
                taga = taga,
                # qty = qty,
                # type_of_packing = typeofpacking,

                # mrp = mrp,
                price = list_price,
                cost = cost_price,

                # mfg = mfg,
                expiry_date = datetime.datetime.strptime(exp,"%Y-%m-%d") ,
                # expiry_time = exp_time,

                # discount = discount,
                hsn = hsn,
                # batch = batch,
                grossm = grossm,
                netm = netm,
                less = less,
                user_id=info.context.user.id,
                # subcategory_id = from_global_id(sub_category_id)[1]
            )
            return CreateProduct(product = product,isNew = True)
        

class MInput(graphene.InputObjectType):
    product_id = graphene.String(required=True)
    name = graphene.String(required=True)
    # qty = graphene.Int()
    grossm = graphene.Float()
    less = graphene.Float()
    net = graphene.Float()
    price = graphene.Float()
    # gst = graphene.Float()
    # discount = graphene.Float()
    # expiry = graphene.String()


class PurchaseInput(graphene.InputObjectType):
    product_id = graphene.String(required=True)
    name = graphene.String(required=True)
    # qty = graphene.Int()
    # taga = graphene.Int()
    # mrp = graphene.Float()
    grossm = graphene.Float()
    less = graphene.Float()
    netm = graphene.Float()
    price = graphene.Float()
    cost = graphene.Float()
    discount = graphene.Float()


class AddPurchase(graphene.Mutation):
    class Arguments:
        vendor_id = graphene.ID(required=True)
        invoice_date = graphene.String(required=True)
        invoice_number = graphene.String(required=True)
        products = graphene.List(PurchaseInput)
        invoice = Upload(required=True)
    purchase = graphene.Field(PurchaseNode)
    def mutate(self,info,vendor_id,invoice_date,invoice_number,products,invoice,**kwargs):
        purchase = Purchase.objects.create(vendor_id = from_global_id(vendor_id)[1],invoice_date = datetime.datetime.strptime(invoice_date,"%Y-%m-%d"),invoice_number = invoice_number,user_id=info.context.user.id)
        
        # print(info.context.FILES)
        # print(invoice)
        # print(kwargs)

        # purchase = Purchase.objects.get(id=7)
        for i in products:
            PurchaseProduct.objects.create(
                product_id = from_global_id(i.product_id)[1],
                # qty = i.qty,
                # mrp = i.mrp,
                grossm = i.grossm,
                less = i.less,
                netm = i.netm,
                list_price = i.price,
                cost = i.cost,
                discount = i.discount,
                purchase_id = purchase.id
            )
        Ledgers.objects.create(purchase_id = purchase.id,user_id = info.context.user.id)
        # purchase = Purchase.objects.get(id=7)
        return AddPurchase(purchase = purchase)



def generate_receipt(bill,products,user): 
    pdf = FPDF(orientation='P', unit='pt', format='A4') 
    pdf.add_page() 
    pdf.set_font("Arial", "B", 17) 
    pdf.cell(0, 30, "{}".format(user.profile.firm_name), 0, 0, "L")  
    pdf.cell(0,30,"Invoice",0,1,"R") 
    pdf.set_font("Arial", "", 12) 
    pdf.cell(0,20,"{}".format(user.profile.address),0,0,"L") 
    pdf.cell(0,20,"Invoice Number : {}".format(bill.invoice_number),0,1,"R") 
    pdf.cell(0,20,"{}".format(user.profile.contact_number),0,0,"L") 
    pdf.cell(0,20,"Date: {}".format(bill.billing_date.strftime("%b %d, %Y")),0,1,"R") 
    pdf.cell(0,23,"{}".format(user.profile.GST_no),0,1,"L") 
    pdf.cell(0,23,"Bill to",0,1,"L") 
    pdf.set_font("Arial","B",13) 
    pdf.cell(0,20,"{}".format(bill.customer.name),0,1,"L") 
    pdf.set_font("Arial","",12) 
    pdf.cell(0,20,"{}".format(bill.customer.mobile),0,1,"L") 
    epw = pdf.w - 2*pdf.l_margin 
    # col_width = epw/4 
    th = pdf.font_size 
    pdf.ln(th*4) 
    
    # for row in data: 
    #     for datum in row: 
    #         pdf.cell(col_width, 2*th, str(datum), border=1) 
    #     pdf.ln(2*th) 
    # pdf.ln(2*th) 
    pdf.set_font("Arial", "B", 8)
    pdf.cell(20, 2*th, "Sn.",1,0,"C")
    pdf.cell(100, 2*th, "Name",1,0,"C")
    pdf.cell(40, 2*th, "Pack",1,0,"C")
    pdf.cell(45, 2*th, "HSN",1,0,"C")
    pdf.cell(30, 2*th, "Exp",1,0,"C")
    pdf.cell(40, 2*th, "Batch",1,0,"C")
    pdf.cell(40, 2*th, "MFG.",1,0,"C")
    
    # 315

    pdf.cell(20, 2*th, "Qty",1,0,"C")
    pdf.cell(40, 2*th, "MRP",1,0,"C")
    pdf.cell(40, 2*th, "Dis%",1,0,"C")
    pdf.cell(40, 2*th, "SGST",1,0,"C")
    pdf.cell(40, 2*th, "CGST",1,0,"C")
    pdf.cell(40, 2*th, "Total",1,0,"C")
    pdf.ln(2*th)

    for index,i in enumerate(products,start=1):


        
        pdf.set_font("Arial", "", 8)
        pdf.cell(20, 2*th, str(index),1,0,"C")
        pdf.set_font("Arial", "B", 8)
        pdf.cell(100, 2*th, str(i.product_name.upper()),1,0,"C")
        pdf.set_font("Arial", "", 8)
        if(i.product.type_of_packing):
            pdf.cell(40, 2*th, str(i.product.type_of_packing),1,0,"C")
        else:
            pdf.cell(40, 2*th, str(" - "),1,0,"C")
        
        if(i.product.subcategory.hsn):
            pdf.cell(45, 2*th, str(i.product.subcategory.hsn),1,0,"C")
        else:
            pdf.cell(45, 2*th, str(" - "),1,0,"C")
        if(i.expiry_date):
            pdf.cell(30, 2*th, str(i.expiry_date.strftime("%m/%y")),1,0,"C")
        else:
            pdf.cell(40, 2*th, str(" - "),1,0,"C")

        if(i.product.batch):
            pdf.cell(40, 2*th, str(i.product.batch),1,0,"C")
        else:
            pdf.cell(40, 2*th, str(" - "),1,0,"C")

        if(i.product.mfg):
            pdf.cell(40, 2*th, str(i.product.mfg),1,0,"C")
        else:
            pdf.cell(40, 2*th, str(" - "),1,0,"C")

        pdf.cell(20, 2*th, str(i.quantity),1,0,"C")
        pdf.cell(40, 2*th, str(i.price),1,0,"C")
        pdf.cell(40, 2*th, str(i.discount),1,0,"C")
        
        pdf.cell(40, 2*th, str(i.CGST),1,0,"C")
        pdf.cell(40, 2*th, str(i.SGST),1,0,"C")
        pdf.cell(40, 2*th, str(i.total),1,0,"C")
        pdf.ln(2*th)
    pdf.set_font("Arial","",12)
    pdf.cell(315,2*th,str("Payment Mode : {}".format(bill.payment_mode)),0,0,"C")
    pdf.set_font("Arial","",10)
    pdf.cell(100,2*th,str("Gross Amount"),1,0,"C")
    pdf.set_font("Arial","B",10)
    pdf.cell(120,2*th,str(bill.gross_amount ),1,0,"C")
    pdf.ln(2*th)
    
    pdf.set_font("Arial","",10)
    pdf.cell(315,2*th,str(""),0,0,"L")
    pdf.cell(100,2*th,str("CGST"),1,0,"C")
    pdf.set_font("Arial","B",10)
    pdf.cell(120,2*th,str(bill.cgst ),1,0,"C")
    pdf.ln(2*th)

    pdf.set_font("Arial","",10)
    pdf.cell(315,2*th,str(""),0,0,"L")
    pdf.cell(100,2*th,str("SGST"),1,0,"C")
    pdf.set_font("Arial","B",10)
    pdf.cell(120,2*th,str(bill.sgst ),1,0,"C")
    pdf.ln(2*th)

    pdf.set_font("Arial","",10)
    pdf.cell(315,2*th,str(""),0,0,"L")
    pdf.cell(100,2*th,str("Net Amount"),1,0,"C")
    pdf.set_font("Arial","B",10)
    pdf.cell(120,2*th,str(bill.net_amount ),1,0,"C")
    pdf.ln(2*th)


    # pdf.cell(220,2*th,str("Gross Amount"))
    pdf.output("{}.pdf".format(bill.invoice_number))



def GenerateBill(gross,invoice_number,medicines,discount,cgst,total,bill,user):
    # print("invoice ...")
    # print(invoice_number)
    template = get_template("x.html")
    context = {"gross":gross,"medicines": medicines,"discount":discount,"cgst":cgst,"sgst":cgst,"total":total,"invoice":invoice_number,"bill":bill,"user":user}
    html = template.render(context)
    options = {
    'page-size': 'A4',
    'margin-top': '50px',
    'margin-right': '50px',
    'margin-bottom': '50px',
    'margin-left': '50px',
    # 'orientation':'landscape'
    }




    pdfkit.from_string(html, '{}.pdf'.format(invoice_number),options=options)
    




class CreateBill(graphene.Mutation):
    class Arguments:
        # name = graphene.String(required = True)
        # age = graphene.String(required = True)
        # gender = graphene.String(required = True)
        customerId = graphene.ID(required = True)
        remarks = graphene.String(required = True)
        # productId = graphene.ID(required = True)
        payment_mode = graphene.String(required = True)
        billing_date = graphene.String(required = True)
        invoice_number = graphene.String(required = True)
        # payment = graphene.Float(required=True)
        # gst = graphene.Float(required = True)
        products = graphene.List(MInput)
    bill = graphene.Field(BillingNode)
    ledger = graphene.Field(LedgerNode)
    def mutate(self,info,payment_mode,billing_date,products,customerId,remarks,invoice_number):
        # print(products[0])
        # user_id = from_global_id(user_id)[1]
        # name = name.replace(" ({})".format(age),"")

        # customer = Customer.objects.filter(name__iexact=name,age=12,sex=gender)
        # if customer:
        #     user_id = customer[0]
        # else:
        #     user_id = Customer.objects.create(name=name,age=age,sex=gender)

        user_id = from_global_id(customerId)[1]


        bill = Billing.objects.create( 
            user_id=info.context.user.id,invoice_number=invoice_number.format(user_id),customer_id=user_id,payment_mode=payment_mode,billing_date=datetime.datetime.strptime(billing_date,"%Y-%m-%d")
            )
        print(bill)
        bill.invoice_number = invoice_number

        gross = total = discount = cgst =  0.0

        for i in products:
            gross += i["price"] * i["net"]
            total += (i["price"] * i["net"])  #- (i["price"]*i["qty"] * i["discount"]/100)
            # discount += i["price"]*i["qty"] * i["discount"]/100
            cgst += i["price"]*i["net"] * 10 /100

            print(i)
            Sales_Product.objects.create(
                product_id = from_global_id(i["product_id"])[1],
                product_name = i["name"],
                lessm = int(i["less"]),
                price = round(float(i["price"]),2),
                # discount = round(float(i["discount"])),
                grossm = float(i["grossm"]),
                netm = float(i["net"]),
                # expiry_date = datetime.datetime.strptime(i["expiry"],"%Y-%m-%d"),
                CGST = round(float(i["price"]) * int(i["net"]) * float(10)/100/2,2),
                SGST = round(float(i["price"]) * int(i["net"]) * float(10)/100/2,2),
                total = round(int(i["net"]) * float(i["price"])), # - (i["price"]*i["netm"]*i["discount"]/100),2),
                billing_id = bill.id,
            )
        # bill = Billing.objects.get(id=14)
        # print(gross)
        # print(discount)
        # print(cgst)
        # print(total)
        
        bill.gross_amount = round(gross,2)
        bill.discount =round(discount,2)
        bill.cgst = round(cgst/2,2)
        bill.sgst = round(cgst/2,2)
        bill.net_amount = round(total,2)
        # bill.save() 
        
        # ParitalPayment.objects.create(paid=payment,outstanding=total-payment,bill_id = bill.id)

        # GenerateBill(gross,bill.invoice_number,Medicine.objects.filter(billing_id=bill.id),discount,cgst,total,bill,info.context.user)
        # generate_receipt(bill,Sales_Product.objects.filter(billing_id=bill.id),info.context.user)
        # pdfname = "{}.pdf".format(bill.invoice_number)
        # print(pdfname)
        # with open(pdfname,'rb') as pdf:
        #    bill.invoice.save(pdfname,File(pdf),save=True)
        led = Ledgers.objects.create(sale_id = bill.id,user_id = info.context.user.id)
        bill.save()
        # ParitalPayment.objects.create(paid=payment,outstanding=total-payment,bill_id = bill.id)
        # os.remove(pdfname)
        return CreateBill(bill=bill,ledger=led)



class UpdatePersonal(graphene.Mutation):
    class Arguments:
        firstname = graphene.String(required=True)
        lastname = graphene.String(required=True)
        phone = graphene.String(required=True)
        email = graphene.String(required=True)
    user = graphene.Field(UserNode)
    def mutate(self,info,firstname,lastname,phone,email):
        userid = info.context.user.id
        user = User.objects.get(id=userid)
        user.first_name = firstname
        user.last_name = lastname
        user.email = email
        user.save()

        profile = Profile.objects.get(user_id = userid)
        profile.contact_number = phone
        profile.save()
        return UpdatePersonal(user=user)

class UpdateFirm(graphene.Mutation):
    class Arguments:
        firm_name = graphene.String(required=True)
        gst = graphene.String(required=True)
        # tin = graphene.String(required=True)
    user = graphene.Field(UserNode)
    def mutate(self,info,firm_name,gst):
        userid = info.context.user.id
        user = User.objects.get(id=userid)
        profile = Profile.objects.get(user_id = userid)
        profile.GST_no = gst
        # profile.TIN_no = tin
        profile.firm_name = firm_name
        profile.save()
        return UpdateFirm(user=user)

class UpdateAddress(graphene.Mutation):
    class Arguments:
        address = graphene.String(required=True)
        state = graphene.String(required=True)
        city = graphene.String(required=True)
        zipcode = graphene.String(required=True)
    user = graphene.Field(UserNode)
    def mutate(self,info,address,state,city,zipcode):
        userid = info.context.user.id
        user = User.objects.get(id=userid)
        profile = Profile.objects.get(user_id = userid)
        profile.address = address
        # profile.contact_number = phone
        profile.state = state
        profile.city = city
        profile.zipcode = zipcode
        profile.save()
        return UpdateAddress(user=user)

class UpdateBank(graphene.Mutation):
    class Arguments:
        account = graphene.String(required=True)
        # bank = graphene.String(required=True)
        name = graphene.String(required=True)
        bank_name = graphene.String(required=True)
        branch = graphene.String(required=True)
        ifsc_code = graphene.String(required=True)
    user = graphene.Field(UserNode)
    def mutate(self,info,account,name,bank_name,branch,ifsc_code):
        bank = Bank.objects.get(user_id = info.context.user.id)
        bank.account_no = account
        bank.name = name
        bank.branch = branch
        bank.bank_name = bank_name
        bank.ifsc_code = ifsc_code
        bank.save()
        return UpdateBank(user = info.context.user)




class UpdateUser(graphene.Mutation):
    class Arguments:
        gst = graphene.String(required=True)
        # tin = graphene.String(required=True)
        firm_name = graphene.String(required=True)
        address = graphene.String(required=True)
        state = graphene.String(required=True)
        city = graphene.String(required=True)
        zipcode = graphene.String(required=True)
        email = graphene.String(required=True)
        firstname = graphene.String(required=True)
        lastname = graphene.String(required=True)
        phone = graphene.String(required=True)
        
    user = graphene.Field(UserNode)
    def mutate(self,info,gst,firm_name,address,email,firstname,lastname,phone,state,city,zipcode):
        userid = info.context.user.id
        user = User.objects.get(id = userid)
        user.first_name = firstname
        user.last_name = lastname
        user.email = email
        user.save()
        
        profile = Profile.objects.get(user_id = userid)
        profile.GST_no = gst
        # profile.TIN_no = tin
        profile.address = address
        profile.contact_number = phone
        profile.state = state
        profile.city = city
        profile.zipcode = zipcode
        profile.save()
        return UpdateUser(user = user)

class UpdateCategory(graphene.Mutation):
    class Arguments:
        category = graphene.String(required=True)
        subcategory = graphene.String(required=True)
        gst = graphene.Float(required=True)
        hsn = graphene.String(required=True)

    isNew = graphene.Boolean()
    category = graphene.Field(CategoryNode)
    sub_category = graphene.Field(SubCategoryNode)
    def mutate(self,info,category,subcategory,gst,hsn):
        cat = Category.objects.filter(name__iexact=category)
        if(cat):
            cat = cat[0]
            sub = SubCategory.objects.filter(name__iexact=subcategory)
            if(sub):
                sub = sub[0]
                # print(sub.hsn)
                sub.hsn = hsn
                sub.GST = gst
                sub.save()
                return UpdateCategory(isNew = False,category = cat,sub_category=sub)
            else:
                sub = SubCategory.objects.create(name=subcategory,hsn=hsn,GST=gst,user_id=info.context.user.id,category_id=cat.id)
                return UpdateCategory(isNew = True,category=cat,sub_category=sub)
        # else:
        cat = Category.objects.create(name=category,user_id=info.context.user.id)
        sub = SubCategory.objects.create(name=subcategory,hsn=hsn,GST=gst,user_id=info.context.user.id,category_id=cat.id)
        return UpdateCategory(isNew = True,category=cat,sub_category=sub)

class DeleteSubCategory(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    success=graphene.Boolean()
    def mutate(self,info,id):
        SubCategory.objects.get(id=from_global_id(id)[1]).delete()
        return DeleteSubCategory(success=True)

class UpdateSubCategory(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=False)
        category = graphene.String(required=False)
        is_update = graphene.Boolean(required=True) 
        hsn = graphene.String(required=True)
        gst = graphene.Int(required=True)
        name = graphene.String(required=True)
    success = graphene.Boolean()
    sub_category = graphene.Field(SubCategoryNode)

    def mutate(self,info,is_update,hsn,gst,name,id=None,category=None):
        if(is_update is False):
            sub = SubCategory.objects.create(name=name,GST=gst,hsn=hsn,user_id=info.context.user.id,category_id=from_global_id(category)[1])
            return UpdateSubCategory(sub_category=sub,success=True)
        else:
            sub = SubCategory.objects.get(id=from_global_id(id)[1])
            sub.name = name
            sub.GST = gst
            sub.hsn = hsn
            sub.save()
            return UpdateSubCategory(sub_category=sub,success=True)


class RenameCategory(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String(required=False)
        is_update = graphene.Boolean(required=True)

    success = graphene.Boolean()
    category = graphene.Field(CategoryNode)

    def mutate(self,info,id,is_update,name=None):
        if(is_update is True):
            c = Category.objects.get(id=from_global_id(id)[1])
            c.name = name
            c.save()
            return RenameCategory(success=True,category=c)
        else:
            Category.objects.get(id=from_global_id(id)[1]).delete()
            return RenameCategory(success=True)
class CreateVendor(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        name = graphene.String(required=True)
        mobile = graphene.String(required=True)
        gst = graphene.String(required=True)
        address = graphene.String(required=True)
        city = graphene.String(required=True)
        state = graphene.String(required=True)
        zipcode = graphene.String(required=True)
        company = graphene.String(required=True)
        email = graphene.String(required=True)
        is_new = graphene.Boolean(required=True)

    vendor = graphene.Field(VendorNode)
    def mutate(self,info,id,name,mobile,gst,address,city,state,zipcode,company,email,is_new):
        if(is_new is True):
            vendor = Vendor.objects.create(name=name,mobile=mobile,email=email, gst=gst,address=address ,state_id=from_global_id(state)[1],city_id=from_global_id(city)[1],zip_code=zipcode,company=company,user_id=info.context.user.id)
        else:
            vendor = Vendor.objects.get(id = from_global_id(id)[1])
            vendor.name = name
            vendor.mobile = mobile
            vendor.email = email
            vendor.gst = gst
            vendor.address = address
            vendor.state_id = from_global_id(state)[1]
            vendor.city_id = from_global_id(city)[1]
            vendor.zip_code = zipcode
            vendor.company = company
            vendor.save()
        return CreateVendor(vendor = vendor)



class CreateCustomer(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
        name = graphene.String(required=True)
        mobile = graphene.String(required=True)
        gst = graphene.String(required=True)
        address = graphene.String(required=True)
        state = graphene.String(required=True)
        city = graphene.String(required=True)
        addhar = graphene.String(required=True)
        email = graphene.String(required=True)
        is_new = graphene.Boolean(required=True)
        zipcode = graphene.String(required=True)
        company = graphene.String(required=True)
    customer = graphene.Field(CustomerNode)
    def mutate(self,info,id,name,mobile,gst,address,email,is_new,state,city,addhar,zipcode,company):
        if(is_new is True):
            customer = Customer.objects.create(name=name,city=city,state=state,addhar_no=addhar ,mobile=mobile,gst_number=gst,address=address,email=email,user_id = info.context.user.id,company=company,zipcode=zipcode)
            # return CreateCustomer(customer = customer)
        else:
            customer = Customer.objects.get(id = from_global_id(id)[1])
            customer.name = name
            customer.mobile = mobile
            customer.gst_number = gst
            customer.email = email
            customer.address = address
            customer.city = city
            customer.state = state
            customer.addhar_no = addhar
            customer.zipcode = zipcode
            customer.company = company
            customer.save()
        return CreateCustomer(customer = customer)



class CreateCategory(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
    category = graphene.Field(CategoryNode)
    def mutate(self,info,name):
        print(info.context.user.id)
        category = Category.objects.create(name=name,user_id = info.context.user.id)
        return CreateCategory(category = category)

class DeleteCustomer(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
    success = graphene.Boolean()
    def mutate(self,info,id):
        Customer.objects.get(id=from_global_id(id)[1]).delete()
        return DeleteCustomer(success=True)

class DeleteVendor(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
    success = graphene.Boolean()
    def mutate(self,info,id):
        Vendor.objects.get(id=from_global_id(id)[1]).delete()
        return DeleteVendor(success=True)

class DeleteProduct(graphene.Mutation):
    class Arguments:
        id = graphene.String(required=True)
    success = graphene.Boolean()
    def mutate(self,info,id):
        Product.objects.get(id=from_global_id(id)[1]).delete()
        return DeleteProduct(success = True)

class AddPurchasePayment(graphene.Mutation):
    class Arguments:
        paid = graphene.Float(required=True)
        vendor_id = graphene.ID(required=True)
        date = graphene.String(required=True)
        outstanding = graphene.Float(required=True)
    success = graphene.Boolean()
    partial = graphene.Field(PartialPaymentNode)
    def mutate(self,info,paid,vendor_id,date,outstanding):
        p = ParitalPayment.objects.create(vendor_id = from_global_id(vendor_id)[1],date = datetime.datetime.strptime(date,"%Y-%m-%d"),paid=paid,outstanding=outstanding)
        # p = ParitalPayment.objects.all()[::-1][0]
        return AddPurchasePayment(success=True,partial = p)


class AddSalesPayment(graphene.Mutation):
    class Arguments:
        paid = graphene.Float(required=True)
        customer_id = graphene.ID(required=True)
        date = graphene.String(required=True)
        outstanding = graphene.Float(required=True)
    success = graphene.Boolean()
    partial = graphene.Field(PartialPaymentNode)
    def mutate(self,info,paid,customer_id,date,outstanding):
        p = ParitalPayment.objects.create(customer_id = from_global_id(customer_id)[1],date = datetime.datetime.strptime(date,"%Y-%m-%d"),paid=paid,outstanding=outstanding)
        # p = ParitalPayment.objects.all()[::-1][0]
        return AddSalesPayment(success=True,partial = p)

class CreateUser(graphene.Mutation):
    # user = graphene.Field(UserNode)
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
        firstname = graphene.String(required=True)
        lastname = graphene.String(required=True)
        phone = graphene.String(required=True)

        gst = graphene.String(required=True)
        tin = graphene.String(required=True)
        firm_name = graphene.String(required=True)
        address = graphene.String(required=True)

    user = graphene.Field(UserNode)
    def mutate(self,info,username,password,email,firstname,lastname,gst,tin,firm_name,address,phone):
        user = get_user_model()(username = username,email = email,first_name = firstname,last_name=lastname)
        user.set_password(password)
        user.save()
        Profile.objects.create(user_id = user.id,GST_no = gst,TIN_no=tin,firm_name=firm_name,address=address,contact_number=phone)
        return CreateUser(user=user)

import graphql_jwt

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_product = CreateProduct.Field()
    delete_product = DeleteProduct.Field()
    delete_customer = DeleteCustomer.Field()
    delete_vendor = DeleteVendor.Field()
    generate_bill = CreateBill.Field()
    update_bank = UpdateBank.Field()
    update_user = UpdateUser.Field()
    update_address = UpdateAddress.Field()
    update_firm = UpdateFirm.Field()
    update_personal = UpdatePersonal.Field()
    # create_user = CreateUser.Field()
    update_category = UpdateCategory.Field()
    rename_category = RenameCategory.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    update_subcategory = UpdateSubCategory.Field()
    delete_subcategory = DeleteSubCategory.Field()
    create_category = CreateCategory.Field()
    create_customer = CreateCustomer.Field()
    create_vendor  = CreateVendor.Field()
    add_purchase = AddPurchase.Field()
    add_sales_payment = AddSalesPayment.Field()
    add_purchase_payment = AddPurchasePayment.Field()
    

class Query(graphene.AbstractType):
    customers = DjangoFilterConnectionField(CustomerNode,search=graphene.String())
    customer = graphene.Field(CustomerNode,id=graphene.ID())
    vendor = graphene.Field(VendorNode,id=graphene.ID())
    all_products = DjangoFilterConnectionField(ProductNode,search=graphene.String())
    product_by_id = graphene.Field(ProductNode,id=graphene.ID())
    product_suggestion = graphene.List(ProductNode,suggestion=graphene.String())
    category_suggestion = graphene.List(CategoryNode,suggestion=graphene.String())
    report = DjangoFilterConnectionField(BillingNode,min=graphene.String(),max=graphene.String())
    history = DjangoFilterConnectionField(BillingNode,slug=graphene.String())
    subcategoy = DjangoFilterConnectionField(SubCategoryNode,id = graphene.ID(),search=graphene.String())
    user = graphene.Field(UserNode)
    customer_suggestion = DjangoFilterConnectionField(CustomerNode,suggestion = graphene.String())

    categories = DjangoFilterConnectionField(CategoryNode,search=graphene.String())
    vendors = DjangoFilterConnectionField(VendorNode,search=graphene.String())
    vendors_search = DjangoFilterConnectionField(VendorNode,search=graphene.String())
    states = DjangoFilterConnectionField(StateNode)
    city = DjangoFilterConnectionField(CityNode,stateId = graphene.ID())
    purchases = DjangoFilterConnectionField(PurchaseNode,slug=graphene.String())
    purchaseProduct = DjangoFilterConnectionField(PurchaseProductNode,purchaseId=graphene.ID())
    dashboard = graphene.Field(Dashboard)
    last_number = graphene.Field(InvoiceNumber,id=graphene.String())
    ledgers = DjangoFilterConnectionField(LedgerNode,search=graphene.String())
    bank_by_customer = DjangoFilterConnectionField(CustomerNode,search=graphene.String())
    all_payment = DjangoFilterConnectionField(PartialPaymentNode,search=graphene.String())
    # invoiceNumner = graphene
    # bank_by_vendor = DjangoFilterConnectionField(VendorNode,search=graphene.String())
    # ledgers = graphene.

# 9899200257


    def resolve_all_payment(self,info,search,**kwargs):
        return ParitalPayment.objects.filter(Q(vendor__name__icontains=search) | Q(customer__name__icontains=search)).order_by("-id")

    def resolve_bank_by_customer(self,info,search,**kwargs):
        return Customer.objects.all()


    def resolve_ledgers(self,info,search,**kwargs):

        # return Ledgers.objects.filter(user_id=info.context.user.id).order_by("-id")
        return Ledgers.objects.filter(Q(sale__customer__company__icontains=search) |Q(purchase__vendor__company__icontains=search) | Q(sale__invoice_number__icontains=search) |Q(purchase__invoice_number__icontains=search) | Q(sale__net_amount__icontains=search) |Q(purchase__total_bill__icontains=search)).order_by("-id")
    
    def resolve_last_number(self,info,id):
        print(id)
        if(id):
            if(Billing.objects.filter(invoice_number=id)):
                return {"exist":True,"last_number":0}
            else:
                return {"exist":False,"last_number":0}
        else:
            bill = Billing.objects.all()
            if(bill):
                return {"last_number":bill[::-1][0].id+1,"exist":False}
            else:
                return {"last_number":1,"exist":False}


    def resolve_dashboard(self,info):
        sales=0
        
        for i in Billing.objects.filter(user_id=info.context.user.id):
            sales=sales+i.net_amount
        purchase = 0
        for i in Purchase.objects.filter(user_id=info.context.user.id):
            purchase +=  i.total_bill if i.total_bill else 0
            
        return {"sales":sales,"purchase":purchase} 

    def resolve_vendors_search(self,info,search,**kwargs):
        
        data =  Vendor.objects.filter(Q(name__icontains=search) | Q(company__icontains=search) | Q(email__icontains=search) | Q(city__name__icontains=search) | Q(state__name__icontains=search) | Q(mobile__icontains=search)) 
        return data
        # print(data)
        # return Vendor.objects.all()

    def resolve_purchaseProduct(self,info,purchaseId,**kwargs):
        return PurchaseProduct.objects.filter(purchase__id = from_global_id(purchaseId)[1])


    def resolve_city(self,info,stateId):
        return City.objects.filter(state_id=from_global_id(stateId)[1])

    def resolve_vendors(self,info,search,**kwargs):
        return Vendor.objects.filter(Q(name__icontains=search) | Q(company__icontains=search) | Q(email__icontains=search) | Q(city__name__icontains=search) | Q(state__name__icontains=search) | Q(mobile__icontains=search)) 
        # return Vendor.objects.filter(user_id = info.context.user.id)

    def resolve_customer(self,info,id):
        return Customer.objects.get(id=from_global_id(id)[1])
    
    def resolve_vendor(self,info,id):
        return Vendor.objects.get(id=from_global_id(id)[1])

    def resolve_customers(self,info,search,**kwargs):
        return Customer.objects.filter(Q(name__icontains=search) | Q(email__icontains=search) | Q(mobile__icontains=search) | Q(gst_number__icontains=search) | Q(address__icontains=search)).filter(user_id=info.context.user.id)

    def resolve_customer_suggestion(self,info,suggestion,**kwargs):
        return Customer.objects.filter(company__icontains=suggestion)
    # def resolve_customers(self,info):
    #     return Customer.objects.filter(user_id=info.context.user.id)

    def resolve_subcategoy(self,info,id,search,**kwargs):
        return SubCategory.objects.filter(category_id=from_global_id(id)[1]).filter(Q(name__icontains=search))
    

    def resolve_user(self,info):
        # print("..user..")
        # user_id = info.context.user.id
        print(info.context.user)
        return User.objects.get(id = info.context.user.id)

    # def resol

    # def resolve_history(self,info,*args):
    #     return Billing.objects.all()
    def resolve_history(self,info,slug,**kwargs):
        if(not len(slug)):
            return Billing.objects.all()

        if(Billing.objects.filter(invoice_number__iexact=slug)):
            return Billing.objects.filter(invoice_number__iexact=slug)
        
        return Billing.objects.filter(customer__name__iexact=slug)
        
    def resolve_purchases(self,info,slug,**kwargs):
        if(not len(slug)):
            return Purchase.objects.all().order_by("-id")

        if(Purchase.objects.filter(invoice_number__iexact=slug)):
            return Purchase.objects.filter(invoice_number__iexact=slug).order_by("-id")
        
        return Purchase.objects.filter(vendor__name__iexact=slug).order_by("-id")

        
        # else if(Billing.objects.filter(patient__name__iexact="aman"))

    def resolve_categories(self,info,search,**kwargs):
        
        # return Category.objects.filter(user_id = info.context.user.id)
        return Category.objects.filter(Q(name__icontains=search)).filter(user_id=info.context.user.id)

    def resolve_report(self,info,min,max):
        return Billing.objects.filter(billing_date__range=[min,max]).order_by('-id')

    def resolve_category_suggestion(self,info,suggestion):
        return Category.objects.filter(name__icontains=suggestion)
    def resolve_product_suggestion(self,info,suggestion):
        # return Product.objects.all()
        return Product.objects.filter(name__icontains=suggestion)

    def resolve_all_products(self,info,search,**kwargs):
        # print(info.context.user)

        return Product.objects.filter(Q(name__icontains=search) | Q(mfg__icontains=search) | Q(mrp__icontains=search) | Q(price__icontains=search)).filter(user_id=info.context.user.id)

        # return Product.objects.all()
    
    def resolve_product_by_id(self,info,id):
        print(from_global_id(id)[1])
        return Product.objects.get(id=from_global_id(id)[1])
        
    def resolve_all_customer(self,info,**kwargs):
        return Customer.objects.all()
