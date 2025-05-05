from flask import Blueprint, request

sources_bp = Blueprint('sources_bp', __name__)

@sources_bp.post('/')
def create_source():

    print(request.get_json())
    return { 'success': True }