from flask import Blueprint, request
from flask_cors import cross_origin

from backend.models.source_model import Sources

sources_bp = Blueprint('sources_bp', __name__)

@sources_bp.post('/')
@cross_origin()
def create_source():
    title = request.json["title"]
    description = request.json["description"]
    link = request.json["link"]
    ISBN = request.json["ISBN"]
    print(request.json)
    sources_model = Sources()
    new_source = sources_model.add_sources(title, description, link, ISBN)
    return new_source, 201
