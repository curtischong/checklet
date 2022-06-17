from django.urls import path, include
from .views import (
    StructureSuggestionView,
    ContentView
)

urlpatterns = [
    path('structure/suggestions', StructureSuggestionView.as_view()),
    path('feedback', ContentView.as_view()),
]