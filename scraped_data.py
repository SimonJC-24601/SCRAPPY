from flask import Blueprint, jsonify, request
from src.models.scraped_data import ScrapedData, db

scraped_data_bp = Blueprint('scraped_data', __name__)

@scraped_data_bp.route('/scraped-data', methods=['GET'])
def get_scraped_data():
    """Get all scraped data with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    scraped_data = ScrapedData.query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )
    
    return jsonify({
        'data': [item.to_dict() for item in scraped_data.items],
        'total': scraped_data.total,
        'pages': scraped_data.pages,
        'current_page': page,
        'per_page': per_page
    })

@scraped_data_bp.route('/scraped-data/<int:data_id>', methods=['GET'])
def get_scraped_data_item(data_id):
    """Get a specific scraped data item"""
    data = ScrapedData.query.get_or_404(data_id)
    return jsonify(data.to_dict())

@scraped_data_bp.route('/scraped-data', methods=['POST'])
def create_scraped_data():
    """Create new scraped data entry"""
    data = request.json
    
    scraped_item = ScrapedData(
        url=data['url'],
        screenshot_path=data.get('screenshot_path'),
        raw_html=data.get('raw_html')
    )
    
    if 'components' in data:
        scraped_item.set_components(data['components'])
    
    db.session.add(scraped_item)
    db.session.commit()
    
    return jsonify(scraped_item.to_dict()), 201

@scraped_data_bp.route('/scraped-data/search', methods=['GET'])
def search_scraped_data():
    """Search scraped data by URL or components"""
    query = request.args.get('q', '')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400
    
    scraped_data = ScrapedData.query.filter(
        ScrapedData.url.contains(query) | 
        ScrapedData.components.contains(query)
    ).paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )
    
    return jsonify({
        'data': [item.to_dict() for item in scraped_data.items],
        'total': scraped_data.total,
        'pages': scraped_data.pages,
        'current_page': page,
        'per_page': per_page,
        'query': query
    })

