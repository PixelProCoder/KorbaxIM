from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'index.html')

def signIn(request):
    return render(request, 'sign-in.html')

def signUp(request):
    return render(request, 'sign-up.html')