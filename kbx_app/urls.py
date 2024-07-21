from django.conf.urls import url
from kbx_app import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^sign-in$', views.signIn, name='signin'),
    url(r'^sign-up$', views.signUp, name='signup'),
]