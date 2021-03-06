from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save,post_save
from django.dispatch import receiver
# from django.contrib.postgres.fields import JSONField
from django.template.defaultfilters import slugify
from datetime import datetime


# Create your models here.

class Bank(models.Model):
    account_no = models.CharField(max_length=20,null=True,blank=True)
    name = models.CharField(max_length=20,null=True,blank=True)
    bank_name = models.CharField(max_length=20,null=True,blank=True)
    branch = models.CharField(max_length=20,null=True,blank=True)
    ifsc_code = models.CharField(max_length=20,null=True,blank=True)
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    def __str__(self):
        return self.name
    

class Profile(models.Model):
    image = models.ImageField(upload_to="profile/",null=True,blank=True)
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    invoice_prefix = models.CharField(max_length=50,null=True,blank=True)
    firm_name = models.CharField(max_length=100)
    GST_no = models.CharField(max_length=50)
    # TIN_no = models.CharField(max_length=40)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100,null=True,blank=True)
    state = models.CharField(max_length=100,null=True,blank=True)
    zipcode = models.CharField(max_length=100,null=True,blank=True)
    contact_number = models.CharField(max_length=10)
    email = models.EmailField()
    def __str__(self):
        return "{} {}".format(self.firm_name,self.user.username)

class Category(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class SubCategory(models.Model):
    name = models.CharField(max_length=100)
    GST = models.FloatField(null=True,blank=True)
    hsn = models.CharField(max_length=20,null=True,blank=True)
    category = models.ForeignKey(Category,on_delete=models.CASCADE)
    image = models.ImageField(upload_to="images/",blank=True,null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    def __str__(self):
        return "{} {}".format(self.name,self.category.name)



class Product(models.Model):
    name = models.CharField(max_length=100)
    qty = models.IntegerField(null=True,blank=True)
    expiry_date = models.DateField(auto_now_add=True,blank=True)
    expiry_time = models.IntegerField(null=True,blank=True)
    mrp = models.FloatField(null=True,blank=True)
    cost = models.FloatField(null=True,blank=True)
    price = models.FloatField(null=True,blank=True)
    purchase_from = models.CharField(max_length=100,null=True,blank=True)
    GST = models.FloatField(default=0,null=True,blank=True)
    type_of_packing = models.CharField(max_length=30,null=True,blank=True)
    discount = models.FloatField(blank=True,default=0)
    image = models.ImageField(upload_to="products/",blank=True,null=True)
    hsn = models.CharField(max_length=20,null=True,blank=True)
    batch = models.CharField(max_length=20,null=True,blank=True)
    mfg = models.CharField(max_length=50,null=True,blank=True)
    remarks = models.TextField(null=True,blank=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    grossm = models.FloatField(blank=True,null=True)
    netm = models.FloatField(blank=True,null=True)
    less = models.FloatField(blank=True,null=True)
    taga = models.FloatField(blank=True,null=True)
    subcategory = models.ForeignKey(SubCategory,on_delete=models.CASCADE,null=True,blank=True)
    data = models.TextField(null=True,blank=True)
    created_date = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(blank=True,null=True)
    mobile = models.CharField(max_length=10,blank=True,null=True)
    # sex = models.CharField(max_length=10)
    gst_number = models.CharField(max_length=20,blank=True,null=True)
    address = models.TextField(null=True,blank=True)
    addhar_no = models.CharField(max_length=20,blank=True,null=True)
    state = models.CharField(max_length=20,blank=True,null=True)
    city = models.CharField(max_length=20,blank=True,null=True)
    company = models.CharField(max_length=50,blank=True,null=True)
    zipcode = models.CharField(max_length=6,blank=True,null=True)
    outstanding_add = models.BooleanField(default=0)

    user = models.ForeignKey(User,on_delete=models.CASCADE)
    def __str__(self):
        return "{} : {}".format(self.company, self.name)



class CSales(models.Model):
    sales = models.FloatField(null=True,blank=True)
    paid = models.FloatField(null=True,blank=True)
    customer = models.OneToOneField(Customer,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    def __str__(self):
        return "{} | {}".format(self.customer.name,self.sales)
    

class State(models.Model):
    name = models.CharField(max_length=50,blank=True,null=True)
    def __str__(self):
        return self.name
    
class City(models.Model):
    name = models.CharField(max_length=50,blank=True,null=True)
    state = models.ForeignKey(State,on_delete=models.CASCADE)
    def __str__(self):
        return self.name


class Vendor(models.Model):
    name = models.CharField(max_length=50,blank=True,null=True)
    company = models.CharField(max_length=50,blank=True,null=True)
    gst = models.CharField(max_length=20,blank=True,null=True)
    email = models.EmailField(blank=True,null=True)
    mobile = models.CharField(max_length=10,blank=True,null=True)
    address = models.TextField(blank=True,null=True)
    state = models.ForeignKey(State,on_delete=models.CASCADE)
    # city = models.CharField(max_length=20,blank=True,null=True)
    city = models.ForeignKey(City,on_delete=models.CASCADE,blank=True,null=True)
    zip_code = models.CharField(max_length=10,blank=True,null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True)
    outstanding_add = models.BooleanField(default=0)

    
    def __str__(self):
        return self.name


class VPurchase(models.Model):
    purchase = models.FloatField(null=True,blank=True)
    paid = models.FloatField(null=True,blank=True)
    vendor = models.OneToOneField(Vendor,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    def __str__(self):
        return "{} | {}".format(self.vendor.name,self.purchase)


class Purchase(models.Model):
    vendor = models.ForeignKey(Vendor,on_delete=models.CASCADE)
    invoice_date = models.DateField()
    created_date = models.DateField(auto_now_add=True,blank=True,null=True)
    invoice_number = models.CharField(max_length=50)
    total_bill = models.FloatField(null=True,blank=True)
    invoice_file = models.FileField(upload_to="purchase_invoice/",blank=True,null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    
    def __str__(self):
        return self.vendor.name
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


    

class PurchaseProduct(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    # qty = models.IntegerField(null=True,blank=True)
    # mrp = models.FloatField(null=True,blank=True)
    grossm = models.FloatField(null=True,blank=True)
    less = models.FloatField(null=True,blank=True)
    netm = models.FloatField(null=True,blank=True)
    list_price = models.FloatField(null=True,blank=True)
    cost = models.FloatField(null=True,blank=True)
    discount = models.IntegerField(null=True,blank=True)
    purchase = models.ForeignKey(Purchase,on_delete=models.CASCADE,null=True,blank=True)
    def __str__(self):
        return self.product.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        p = Product.objects.get(id = self.product.id)
        p.grossm = p.grossm + self.grossm
        p.netm =  p.netm + self.netm
        # p.mrp = self.mrp
        p.price = self.list_price
        p.cost = self.cost
        p.save()

        purchase = Purchase.objects.get(id=self.purchase.id)
        if(purchase.total_bill):
            purchase.total_bill = purchase.total_bill + (self.cost * self.netm)
        else:
            purchase.total_bill = (self.cost * self.netm)
        purchase.save()



    # city = models.ForeignKey(City,on_delete=models.CASCADE)
    # state = models.
    # city = models.


    

class Billing(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True)
    invoice_number = models.CharField(max_length=20,blank=True,null=True)
    invoice_number_instant = models.CharField(max_length=20,blank=True,null=True)
    customer = models.ForeignKey(Customer,on_delete = models.CASCADE)
    # medicine = models. (Medicine,on_delete=models.CASCADE)
    payment_mode = models.CharField(max_length=100)
    billing_date = models.DateField(blank=True)
    gross_amount = models.FloatField(null=True,blank=True)
    discount = models.FloatField(null=True,blank=True)
    cgst = models.FloatField(null=True,blank=True)
    sgst = models.FloatField(null=True,blank=True)
    invoice = models.FileField(upload_to="invoices/",blank=True,null=True)
    net_amount = models.FloatField(null=True,blank=True)
    paid_amount = models.FloatField(null=True,blank=True,default=0)
    outstanding = models.FloatField(null=True,blank=True)
    remarks = models.TextField(null=True,blank=True)
    created_date = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    is_instant = models.BooleanField(default=0,null=True,blank=True)
    # user = models.ForeignKey(User,on_delete=models.CASCADE)
    def __str__(self):
        return "{} : {}".format(self.invoice_number if self.invoice_number else self.invoice_number_instant,"Instant" if self.is_instant else "")
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        csales = CSales.objects.filter(customer_id=self.customer.id)
        if csales :
            csales[0].sales = self.net_amount
            csales[0].save()
        else:
            CSales.objects.create(customer_id=self.customer.id,sales = self.net_amount)

        super(Billing,self).save()

class ParitalPayment(models.Model):
    date = models.DateField(default=datetime.now,null=True)
    paid = models.FloatField(default=0,blank=True,null=True)
    mode = models.CharField(max_length=30, blank=True,null=True)
    outstanding = models.FloatField(default=0, blank=True,null=True)
    customer = models.ForeignKey(Customer,on_delete=models.CASCADE,null=True,blank=True)
    vendor = models.ForeignKey(Vendor,on_delete=models.CASCADE,null=True,blank=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)

    def __str__(self):
        if(self.customer):
            return "{}|{}".format(self.customer.company, self.paid)
        else:
            return "{}|{}".format(self.vendor.company, self.paid)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if(self.customer):
            csales = CSales.objects.filter(customer_id=self.customer.id)
            if(csales):        
                csales[0].paid = self.paid + csales[0].paid if csales[0].paid else self.paid
                csales[0].save()
            else:
                CSales.objects.create(customer_id=self.customer.id,sales=self.paid)
        super(ParitalPayment,self).save()

        # p = Billing.objects.get(id = self.bill.id)
        # p.paid_amount = self.paid
        # p.outstanding = self.outstanding
        # p.qty = p.qty - self.quantity
        # p.save()

class Sales_Product(models.Model):
    product = models.ForeignKey(Product,on_delete=models.SET_NULL,blank=True,null=True)
    product_name = models.CharField(max_length=50)
    price = models.FloatField(blank=True,null=True)
    hsn = models.CharField(blank=True,null=True,max_length=20)
    taga = models.CharField(blank=True,null=True,max_length=20)

    # quantity = models.IntegerField()
    grossm = models.FloatField(blank=True,null=True)
    lessm = models.FloatField(blank=True,null=True)
    netm = models.FloatField(blank=True,null=True)

    price = models.FloatField(blank=True,null=True)

    # discount = models.FloatField()
    # expiry_date = models.DateField(blank=True,null=True)
    CGST = models.FloatField()
    SGST = models.FloatField()
    total = models.FloatField(blank=True,null=True)
    billing = models.ForeignKey(Billing,on_delete=models.CASCADE,blank=True,null=True)
    def __str__(self):
        return self.product_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        p = Product.objects.get(id = self.product.id)
        # p.grossm = p.grossm - self.grossm
        p.netm = p.netm - self.grossm
        self.hsn = p.hsn
        p.save()
        super(Sales_Product,self).save()
        # super().save(*args, **kwargs)
    
class Ledgers(models.Model):
    sale = models.OneToOneField(Billing,on_delete=models.CASCADE,blank=True,null=True)
    purchase = models.OneToOneField(Purchase,on_delete=models.CASCADE,blank=True,null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)


    def __str__(self):
        # return self.name
        if(self.sale):
            return self.sale.invoice_number
        else:
            return self.purchase.invoice_number
    

    





# @receiver(pre_save,sender=Medicine)
# def my_callback(sender, instance, *args, **kwargs):
#     instance.price = instance.medicine_name.price
#     # instance.qty = instance.medicine_name.qty
#     instance.expiry_date = instance.medicine_name.expiry_date

# @receiver(post_save,sender=Medicine)
# def post_s(sender, instance, *args, **kwargs):
#     print(instance.medicine_name.id)
#     prd = Product.objects.get(instance.medicine_name.id)
#     prd.qty = prd.qty - instance.qty
#     prd.save()




