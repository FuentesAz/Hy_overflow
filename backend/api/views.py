from django.http import JsonResponse

def vista_prueba(request):
    return JsonResponse({"message":"Hello from Django!"})
