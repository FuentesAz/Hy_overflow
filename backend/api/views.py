from rest_framework import status
from .models import Profile
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from django.contrib.auth import authenticate

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # Validaciones
    if not username or not password or not email:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Crear el usuario
        user = User.objects.create_user(username=username, password=password, email=email)

        # Verificar si el usuario ya tiene un perfil, si no, lo creamos
        if not hasattr(user, 'profile'):
            # Crear el perfil del usuario solo si no tiene uno
            profile = Profile.objects.create(user=user)

        # Generar JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User created successfully",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error en la creación del usuario: {e}")  # Imprimir error en logs
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from django.contrib.auth import authenticate

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)







@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    profile_picture = request.FILES.get('profile_picture')

    if profile_picture:
        user.profile_picture = profile_picture
        user.save()

    return Response({
        "message": "Profile updated successfully",
        "profile_picture": user.profile_picture.url if user.profile_picture else None
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "This is a protected view"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user  
    return Response({
        "username": user.username,
        "email": user.email,
        "profile_picture_url": user.profile_picture.url if user.profile_picture else None
    }, status=status.HTTP_200_OK)
