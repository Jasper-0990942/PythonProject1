from flask import Blueprint, request
from models.source_model import Sources
from backendtest.auth_token import token_required

sources_bp = Blueprint('sources_bp', __name__)

@sources_bp.post('/makesource')
# @token_required()
def create_source():
    # user = request.user
    # user_identifier = None
    # if user['type'] == 'user':
    #     user_identifier = user.get('id') or user.get('email')
    # elif user['type'] == 'admin':
    #     user_identifier = user.get('id') or user.get('email')
    user_id = 1
    data = request.get_json()
    title = data["title"]
    description = data["description"]
    link = data["link"]
    isbn = data["isbn"]
    image = data["image"]
    sources_model = Sources()
    new_source = sources_model.add_sources(user_id, title, description, link, isbn, image)
    return {'message': 'Successful!', 'data': new_source, 'success': True}, 201


@sources_bp.get('/allsources')
def get_all_sources():
    sources_model = Sources()
    sources = sources_model.get_all_sources()
    return {'sources': sources}

@sources_bp.get('/')
def get_source_by_id(source_id):
    sources_model = Sources()

@sources_bp.post('/rating', strict_slashes=False)
def save_rating():
    print(request.json)
    source_id = request.json["source_id"]
    user_id = 1
    rating = request.json["rating"]
    sources_model = Sources()
    source_rating = sources_model.save_rating(source_id, user_id, rating)
    return {'Success': source_rating, 'success': True}