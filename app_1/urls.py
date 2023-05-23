from django.urls import path
from app_1 import views

urlpatterns = [
    path('', views.index),
    path('find/<str:value>/', views.find),
    path('options_to_input/<str:value>/', views.options_to_input),
    path('learning/<str:value>/', views.learning)
]
