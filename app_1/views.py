from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from .models import Plant
from .vector import model


def index(request):
    return render(request, 'index.html')


def find(request, value):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
    if is_ajax and request.method == 'GET':

        result = []
        value = value.upper()

        query = Plant.objects.filter(
            Q(name__contains=value) | Q(FO__contains=value)
        ).values('name', 'FO', 'ground', 'chem', 'drugs')

        for item in query:
            result.append(item)

        if result:
            return JsonResponse({
                'status': True,
                'body': result
            })
    return JsonResponse({'status': False})


def predict(request, value):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
    if is_ajax and request.method == 'GET':

        s_1 = value.split('_')[0]
        s_2 = value.split('_')[1].lower()

        result = model.check_proba(s_1, s_2)

        if result:
            return JsonResponse({
                'status': True,
                'body': result
            })
    return JsonResponse({'status': False})


def options_to_input(request, value):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
    if is_ajax and request.method == 'GET':

        value = value.upper()

        result = list(Plant.objects.filter(name__contains=value).values_list('name', flat=True))
        res = list(Plant.objects.filter(FO__icontains=value).values_list('FO', flat=True))

        result.extend(res)

        if result:
            return JsonResponse({
                'status': True,
                'body': result
            })
    return JsonResponse({'status': False})
