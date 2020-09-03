from django.contrib import admin
from app.models import *
# Register your models here.

admin.site.register(Profile)
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(SubCategory)
# admin.site.register(Medicine)
admin.site.register(Billing)
admin.site.register(Customer)
admin.site.register(Vendor)
admin.site.register(City)
admin.site.register(State)
admin.site.register(Purchase)
admin.site.register(PurchaseProduct)
admin.site.register(ParitalPayment)
admin.site.register(Sales_Product)
admin.site.register(Bank)


admin.site.site_header = 'BACARDI'
