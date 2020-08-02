from rest_framework import serializers
from app.models import *

class PurchaseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Purchase
        fields = ("user_id","invoice_file")