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

class UserNode(DjangoObjectType):
    class Meta:
        model = User
        filter_fields=()
        interfaces = (graphene.Node,)
        # interfaces = (relay.Node,)

class ProductNode(DjangoObjectType):
    class Meta:
        model = Product
        filter_fields=()
        interfaces = (relay.Node,)
        
class ProfileNode(DjangoObjectType):
    class Meta:
        model = Profile
        filter_fields=()
        interfaces = (relay.Node,)

class BillingNode(DjangoObjectType):
    class Meta:
        model = Billing
        filter_fields=()
        interfaces = (relay.Node,)

class CustomerNode(DjangoObjectType):
    class Meta:
        model = Customer
        filter_fields=()
        interfaces = (relay.Node,)
class Sales_ProductNode(DjangoObjectType):
    class Meta:
        model = Sales_Product
        filter_fields=()
        interfaces = (relay.Node,)        

class CreateProduct(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        qty = graphene.Int(required=True)
        typeofpacking = graphene.String(required=True)

        mrp = graphene.Float(required=True)
        cost_price = graphene.Float(required=True)
        list_price = graphene.Float(required=True)
        # purchase_from = graphene.String(required=True)
        
        # gst = graphene.String(required=True)
        mfg = graphene.String(required=True)
        exp = graphene.String(required=True)
        exp_time = graphene.Int(required=True)

        discount = graphene.Float(required=True)
        hsn = graphene.String(required=True)
        batch = graphene.String(required=True)

    product = graphene.Field(ProductNode)
    isNew = graphene.Boolean()
    def mutate(self,info,name,qty,typeofpacking,mrp,cost_price,list_price,mfg,exp,exp_time,discount,hsn,batch):
        p = Product.objects.filter(name=name)
        if(p):
            p = p[0]
            p.name = name
            p.qty = qty
            p.type_of_packing = typeofpacking

            p.mrp = mrp
            p.list = list_price
            p.cost = cost_price

            p.mfg = mfg
            p.expiry_date = datetime.datetime.strptime(exp,"%Y-%m-%d") 
            p.expiry_time = exp_time

            p.discount = discount
            p.hsn = hsn
            p.batch = batch
            p.save()

            return CreateProduct(product = p,isNew = False)
            

        else:
            product = Product.objects.create(
                name = name,
                qty = qty,
                type_of_packing = typeofpacking,

                mrp = mrp,
                price = list_price,
                cost = cost_price,

                mfg = mfg,
                expiry_date = datetime.datetime.strptime(exp,"%Y-%m-%d") ,
                expiry_time = exp_time,

                discount = discount,
                # hsn = hsn,
                batch = batch,
                user_id=info.context.user.id
            )
            return CreateProduct(product = product,isNew = True)
        

class MInput(graphene.InputObjectType):
    medicine_id = graphene.String(required=True)
    name = graphene.String(required=True)
    qty = graphene.Int()
    price = graphene.Float()
    # GST = graphene.Float()
    discount = graphene.Float()
    expiry = graphene.String()


def generate_receipt(bill,medicines,user): 
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

    for index,i in enumerate(medicines,start=1):


        
        pdf.set_font("Arial", "", 8)
        pdf.cell(20, 2*th, str(index),1,0,"C")
        pdf.set_font("Arial", "B", 8)
        pdf.cell(100, 2*th, str(i.medicine_name.upper()),1,0,"C")
        pdf.set_font("Arial", "", 8)
        if(i.medicine.type_of_packing):
            pdf.cell(40, 2*th, str(i.medicine.type_of_packing),1,0,"C")
        else:
            pdf.cell(40, 2*th, str(" - "),1,0,"C")
        
        if(i.medicine.hsn):
            pdf.cell(45, 2*th, str(i.medicine.hsn),1,0,"C")
        else:
            pdf.cell(45, 2*th, str(" - "),1,0,"C")
        if(i.expiry_date):
            pdf.cell(30, 2*th, str(i.expiry_date.strftime("%m/%y")),1,0,"C")
        else:
            pdf.cell(40, 2*th, str(" - "),1,0,"C")

        if(i.medicine.batch):
            pdf.cell(40, 2*th, str(i.medicine.batch),1,0,"C")
        else:
            pdf.cell(40, 2*th, str(" - "),1,0,"C")

        if(i.medicine.mfg):
            pdf.cell(40, 2*th, str(i.medicine.mfg),1,0,"C")
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
    print("invoice ...")
    print(invoice_number)
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
        name = graphene.String(required = True)
        age = graphene.String(required = True)
        gender = graphene.String(required = True)
        payment_mode = graphene.String(required=True)
        billing_date = graphene.String(required=True)
        gst = graphene.Float(required=True)
        medicines = graphene.List(MInput)
    bill = graphene.Field(BillingNode)
    def mutate(self,info,payment_mode,billing_date,gst,medicines,name,age,gender):
        # print(medicines[0])
        # user_id = from_global_id(user_id)[1]
        name = name.replace(" ({})".format(age),"")

        customer = Customer.objects.filter(name__iexact=name,age=12,sex=gender)
        if customer:
            user_id = customer[0]
        else:
            user_id = Customer.objects.create(name=name,age=age,sex=gender)


        bill = Billing.objects.create( 
            user_id=1,invoice_number="INV#{}".format(user_id.id),customer_id=user_id.id,payment_mode=payment_mode,billing_date=datetime.datetime.strptime(billing_date,"%Y-%m-%d")
            )
        bill.invoice_number = "INV#{}-{}".format(bill.id,user_id.id)

        gross = total = discount = cgst =  0.0

        for i in medicines:
            gross += i["price"] * i["qty"]
            total += (i["price"] * i["qty"]) - (i["price"]*i["qty"] * i["discount"]/100)
            discount += i["price"]*i["qty"] * i["discount"]/100
            cgst += i["price"]*i["qty"] * gst /100


            Sales_Product.objects.create(
                product_id = from_global_id(i["medicine_id"])[1],
                product_name = i["name"],
                quantity = int(i["qty"]),
                price = round(float(i["price"]),2),
                discount = round(float(i["discount"])),
                expiry_date = datetime.datetime.strptime(i["expiry"],"%Y-%m-%d"),
                CGST = round(float(i["price"]) * int(i["qty"]) * float(gst)/100/2,2),
                SGST = round(float(i["price"]) * int(i["qty"]) * float(gst)/100/2,2),
                total = round(int(i["qty"]) * float(i["price"]) - (i["price"]*i["qty"]*i["discount"]/100),2),
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

        # GenerateBill(gross,bill.invoice_number,Medicine.objects.filter(billing_id=bill.id),discount,cgst,total,bill,info.context.user)
        generate_receipt(bill,Sales_Product.objects.filter(billing_id=bill.id),info.context.user)
        pdfname = "{}.pdf".format(bill.invoice_number)
        # print(pdfname)
        with open(pdfname,'rb') as pdf:
            bill.invoice.save(pdfname,File(pdf),save=True)
        bill.save()
        os.remove(pdfname)
        return CreateBill(bill=bill)



class UpdateUser(graphene.Mutation):
    class Arguments:
        gst = graphene.String(required=True)
        tin = graphene.String(required=True)
        firm_name = graphene.String(required=True)
        address = graphene.String(required=True)
        email = graphene.String(required=True)
        firstname = graphene.String(required=True)
        lastname = graphene.String(required=True)
        phone = graphene.String(required=True)
        
    user = graphene.Field(UserNode)
    def mutate(self,info,gst,tin,firm_name,address,email,firstname,lastname,phone):
        userid = info.context.user.id
        user = User.objects.get(id = userid)
        user.first_name = firstname
        user.last_name = lastname
        user.email = email
        user.save()
        
        profile = Profile.objects.get(user_id = userid)
        profile.GST_no = gst
        profile.TIN_no = tin
        profile.address = address
        profile.contact_number = phone
        profile.save()
        return UpdateUser(user = user)


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
    generate_bill = CreateBill.Field()
    update_user = UpdateUser.Field()
    # create_user = CreateUser.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()

class Query(graphene.AbstractType):
    all_customer = graphene.List(CustomerNode)
    all_products = DjangoFilterConnectionField(ProductNode)
    product_by_id = graphene.Field(ProductNode,id=graphene.ID())
    product_suggestion = graphene.List(ProductNode,suggestion=graphene.String())
    report = DjangoFilterConnectionField(BillingNode,min=graphene.String(),max=graphene.String())
    history = DjangoFilterConnectionField(BillingNode,slug=graphene.String())
    user = graphene.Field(UserNode)


    def resolve_user(self,info):
        # print("..user..")
        # user_id = info.context.user.id
        print(info.context.user)
        return User.objects.get(id = info.context.user.id)

    # def resol

    def resolve_history(self,info,slug):
        if(Billing.objects.filter(invoice_number__iexact=slug)):
            return Billing.objects.filter(invoice_number__iexact=slug)
        
        return Billing.objects.filter(customer__name__iexact=slug)
        
        
        # else if(Billing.objects.filter(patient__name__iexact="aman"))

    def resolve_report(self,info,min,max):
        return Billing.objects.filter(billing_date__range=[min,max]).order_by('-id')


    def resolve_product_suggestion(self,info,suggestion):
        # return Product.objects.all()
        return Product.objects.filter(name__icontains=suggestion)

    def resolve_all_products(self,info,**kwargs):
        print(info.context.user)
        return Product.objects.all()
    
    def resolve_product_by_id(self,info,id):
        print(from_global_id(id)[1])
        return Product.objects.get(id=from_global_id(id)[1])
        
    def resolve_all_customer(self,info,**kwargs):
        return Customer.objects.all()
