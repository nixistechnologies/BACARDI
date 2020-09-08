from django.shortcuts import render,HttpResponse
from django.template.loader import get_template 
from django.template import Context
import pdfkit
from rest_framework import status,viewsets
from app.serializer import *
from num2words import num2words
from graphene.relay.node import from_global_id
import pandas as pd
from django.db.models import Q
import numpy as np


# Create your views here.

class PurchaseSer(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    def perform_create(self,serializer):
        serializer.save(user_id=self.request.user.id)
    def perform_update(self,serializer):
        print(self.request.user)
        print(self.request.data["invoice_file"])
        # print()
        serializer.save(invoice_file = self.request.data["invoice_file"])


def exportBankSale(request,search):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="{}.csv"'.format(search)
    if(search == "all"):
        search = ""
    df=pd.DataFrame.from_records(Customer.objects.filter(Q(name__icontains=search) | Q(email__icontains=search) | Q(mobile__icontains=search) | Q(gst_number__icontains=search) | Q(address__icontains=search)).order_by("-id").values_list("id","company"),columns=["id","Company"])
    _sales = []
    _paid = []

    for i in range(len(df.id)):
        _sales.append(sum([i.net_amount for i in Customer.objects.get(id=df.id[i]).billing_set.all()]))

    for i in range(len(df.id)):
        _paid.append(sum([i.paid for i in Customer.objects.get(id=df.id[i]).paritalpayment_set.all()]))
    
    df["Amount"] = pd.Series(_sales)
    df["Paid"] = pd.Series(_paid)

    df = df[df["Amount"]!=0]
    df["Outstanding"] = np.where(True,df.Amount - df.Paid,0)
    del df["id"]
    df.to_csv(response,index=False)
    return response 





def exportToExcel(request,name):
    response = HttpResponse(content_type='text/csv')
    
    response['Content-Disposition'] = 'attachment; filename="{}.csv"'.format(name)
    if(name == "all"):
        name = ""
    

    
    df = pd.DataFrame.from_records(ParitalPayment.objects.filter(Q(vendor__company__icontains=name) | Q(customer__company__icontains=name)).order_by("-id").values_list("date","paid","customer__company","vendor__company"),columns=["Date","paid","customer","vendor"])
    df = df.fillna(0)
    print(df)
    df["Particulars"] = np.where(df.customer == 0, df.vendor,df.customer)
    df["Credit"] = np.where(df.vendor == 0,df.paid,None)
    df["Debit"] = np.where(df.customer == 0,df.paid,None) 
    del df["paid"]
    del df["customer"]
    del df["vendor"]

    df.to_csv(response,index=False)
    return response

def invoice(request,pk,userId):
    # print(request)
    if(type(pk)==int):
        bill = Billing.objects.get(id=pk)
    else:
        bill = Billing.objects.get(id=from_global_id(pk)[1])
    print(bill.id)
    payble_amount = num2words(bill.net_amount, to='cardinal', lang='en_IN').replace("-"," ").capitalize()
    user = User.objects.get(id=from_global_id(userId)[1])
    return render(request,"invoice.html",{"bill":bill,"user":user,"payble_amount":payble_amount})

def example(request):
    return render(request,"e.html")

def home(request):
    return render(request,'x.html')

def pdfCreate(request):
    template = get_template("x.html")
    context = Context({"data": "data"})
    # html = template.render(context)
    html = template.render({"data": "data"})
    options = {
    'page-size': 'A4',
    'margin-top': '50px',
    'margin-right': '50px',
    'margin-bottom': '50px',
    'margin-left': '50px',
    }

    #In [35]: with open("a.pdf", 'rb') as doc_file: 
    #...:     bill.invoice.save("x.pdf",File(doc_file),save=True)


    pdfkit.from_string(html, 'out.pdf',options=options)
    pdf = open("out.pdf",encoding="utf-8")
    response = HttpResponse(pdf.read(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=output.pdf'
    pdf.close()
    os.remove("out.pdf")
    return response
    