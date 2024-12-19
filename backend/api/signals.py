from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile
from django.contrib.auth.models import User

@receiver(post_save, sender=User)
def create_or_update_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)  # Crear un perfil al registrar el usuario
    else:
        instance.profile.save()  # Guardar el perfil si el usuario ya existe