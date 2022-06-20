from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.http import JsonResponse
from .engine_gateway import handle_request
from core.converters.output.json import get_json_friendly

class ContentView(APIView):

    def post(self, request, *args, **kwargs):
        feedback = []
        try:
            feedback = handle_request(request.data.get('text'))
            feedback = get_json_friendly(feedback)
        except Exception as e:
            print("Error while calling engine")
            print(e)
        response = {
            "text": request.data.get('text'),
            "feedback": feedback
        }
        return JsonResponse(response)

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