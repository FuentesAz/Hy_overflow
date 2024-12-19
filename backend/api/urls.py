from django.urls import path
from .views import register_user, login_user, protected_view, update_profile, user_profile

urlpatterns = [
    path('register/', register_user, name='register'),  # Ruta para el registro de usuario
    path('login/', login_user, name='login'),  # Ruta para el login de usuario
    path('protected/', protected_view, name='protected'),  # Ruta protegida (requiere autenticación)
    path('update-profile/', update_profile, name='update_profile'),  # Ruta para actualizar el perfil
    path('user-profile/', user_profile, name='user_profile'),  # Ruta para obtener el perfil de usuario
]
