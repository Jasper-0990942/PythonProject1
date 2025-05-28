from flask import Blueprint, request
from flask_cors import cross_origin

from models.source_model import Sources

sources_bp = Blueprint('sources_bp', __name__)

@sources_bp.post('/')
@cross_origin()
def create_source():
    user_id = 1
    title = request.json["title"]
    description = request.json["description"]
    link = request.json["link"]
    isbn = request.json["isbn"]
    image = request.json["image"]
    print(request.json)
    sources_model = Sources()
    new_source = sources_model.add_sources(user_id, title, description, link, isbn, image)
    return {'Successful!': new_source, 'success': True} , 201

@sources_bp.get('/')
@cross_origin()
def get_all_sources():
    sources_model = Sources()
    sources = sources_model.get_all_sources()
    return {'sources': sources}