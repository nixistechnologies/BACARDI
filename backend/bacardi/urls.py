"""bacardi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from graphene_file_upload.django import FileUploadGraphQLView
from app.views import *
from rest_framework import routers
router=routers.DefaultRouter()

router.register("purchase",PurchaseSer,basename="purchase-detail")
urlpatterns = [
    path('admin/', admin.site.urls),
    path("invoice/<int:pk>/<int:userId>",invoice),
    path("invoice/<str:pk>/<str:userId>",invoice),
    path("export/sales/<str:search>/",exportBankSale),
    path("export/<str:name>/",exportToExcel),
    path("",home),
    path('api/',include(router.urls)),
    path("example",example),
    path('pdf/',pdfCreate),
    path('graphql/',csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL , document_root=settings.STATIC_ROOT)
