from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.vista_prueba, name = 'home'),
]
