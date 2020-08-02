from django.shortcuts import render,HttpResponse
from django.template.loader import get_template 
from django.template import Context
import pdfkit
from rest_framework import status,viewsets
from app.serializer import *



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
    