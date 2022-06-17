from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.http import JsonResponse

class ContentView(APIView):

    def post(self, request, *args, **kwargs):
        feedback = {
            "text": request.data.get('text')
        }
        return JsonResponse(feedback)

class StructureSuggestionView(APIView):

    def post(self, request, *args, **kwargs):
        # TODO: ideal structure defined by heuristic
        # data = request.json
        # sections = data["structure"]
        correct_order = {
            "structure": ["Skills", "Work Experience", "Volunteering", "Awards", "Education"]
        }
        # just return a JsonResponse
        return JsonResponse(correct_order)