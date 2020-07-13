from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save,post_save
from django.dispatch import receiver
from django.template.defaultfilters import slugify


# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    firm_name = models.CharField(max_length=100)
    GST_no = models.CharField(max_length=50)
    TIN_no = models.CharField(max_length=40)
    address = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=10)
    email = models.EmailField()
    def __str__(self):
        return "{} {}".format(self.firm_name,self.user.username)

class Product(models.Model):
    name = models.CharField(max_length=100)
    qty = models.IntegerField()
    expiry_date = models.DateField(auto_now_add=True,blank=True)
    price = models.FloatField()
    purchase_from = models.CharField(max_length=100)
    GST = models.FloatField(default=0)
    type_of_packing = models.CharField(max_length=30)
    discount = models.FloatField(blank=True,default=0)
    hsn = models.CharField(max_length=20,null=True,blank=True)
    batch = models.CharField(max_length=20,null=True,blank=True)
    mfg = models.CharField(max_length=50,null=True,blank=True)
    def __str__(self):
        return self.name

class Patient(models.Model):
    name = models.CharField(max_length=50)
    age = models.IntegerField()
    sex = models.CharField(max_length=10)
    mobile = models.CharField(max_length=10)
    address = models.TextField(null=True,blank=True)
    def __str__(self):
        return "{} ({})".format(self.name,self.age)


class Billing(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,blank=True,null=True)
    invoice_number = models.CharField(max_length=20)
    patient = models.ForeignKey(Patient,on_delete = models.CASCADE)
    # medicine = models. (Medicine,on_delete=models.CASCADE)
    payment_mode = models.CharField(max_length=100)
    billing_date = models.DateField(blank=True)
    gross_amount = models.FloatField(null=True,blank=True)
    discount = models.FloatField(null=True,blank=True)
    cgst = models.FloatField(null=True,blank=True)
    sgst = models.FloatField(null=True,blank=True)
    invoice = models.FileField(upload_to="invoices/",blank=True,null=True)
    net_amount = models.FloatField(null=True,blank=True)

    def __str__(self):
        return self.invoice_number


class Medicine(models.Model):
    medicine = models.ForeignKey(Product,on_delete=models.CASCADE,blank=True,null=True)
    medicine_name = models.CharField(max_length=50)
    quantity = models.IntegerField()
    price = models.FloatField(blank=True,null=True)
    discount = models.FloatField()
    expiry_date = models.DateField(blank=True,null=True)
    CGST = models.FloatField()
    SGST = models.FloatField()
    total = models.FloatField(blank=True,null=True)
    billing = models.ForeignKey(Billing,on_delete=models.CASCADE,blank=True,null=True)
    def __str__(self):
        return self.medicine_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        p = Product.objects.get(id = self.medicine.id)
        p.qty = p.qty - self.quantity
        p.save()

    

    





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




