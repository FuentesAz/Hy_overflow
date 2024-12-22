from rest_framework import status
from .models import Profile
from rest_framework.response import Response
from .models import Post
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password or not email:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, password=password, email=email)
        
        # Crear el perfil si no existe
        if not hasattr(user, 'profile'):
            profile = Profile.objects.create(user=user)
            profile.profile_picture = 'profile_pictures/default_profile.png'
            profile.save()

        # Generar JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User created successfully",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
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
    

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "This is a protected view"}, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user

    # Obtener perfil (GET)
    if request.method == 'GET':
        if hasattr(user, 'profile'):
            profile_picture_url = user.profile.profile_picture.url if user.profile.profile_picture else None
        else:
            profile_picture_url = None

        return Response({
            "username": user.username,
            "email": user.email,
            "profile_picture_url": profile_picture_url
        }, status=200)

    # Actualizar perfil (PUT o PATCH)
    elif request.method == 'PUT' or request.method == 'PATCH':
        if hasattr(user, 'profile'):
            profile_picture = request.FILES.get('profile_picture')

            if profile_picture:
                user.profile.profile_picture = profile_picture
                user.profile.save()
                return Response({
                    "message": "Profile updated successfully",
                    "profile_picture_url": user.profile.profile_picture.url  # Asegúrate de que la URL esté correcta
                }, status=200)
            else:
                return Response({"error": "No profile picture provided"}, status=400)
        else:
            return Response({"error": "User profile does not exist"}, status=404)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_post(request):
    user = request.user

    # Obtener los datos del formulario
    title = request.data.get('title')
    description = request.data.get('description')

    # Validaciones
    if not title or not description:
        return Response({"error": "Both title and description are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Crear la nueva publicación
        post = Post.objects.create(
            created_by=user,
            title=title,
            description=description,
        )

        return Response({
            "message": "Post created successfully.",
            "post": {
                "title": post.title,
                "description": post.description,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "likes": post.likes,
                "views": post.views,
                "comments_count": post.comments_count,
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
