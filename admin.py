from flask import Blueprint, jsonify, request, session
from functools import wraps
from src.models.admin_user import AdminUser, db
from src.models.scraped_data import ScrapedData
from src.models.site_content import SiteContent

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    """Decorator to require admin authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        
        admin = AdminUser.query.get(session['admin_id'])
        if not admin or not admin.is_active:
            return jsonify({'error': 'Invalid or inactive admin user'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    admin = AdminUser.query.filter_by(username=username).first()
    
    if admin and admin.check_password(password) and admin.is_active:
        session['admin_id'] = admin.id
        admin.update_last_login()
        return jsonify({
            'message': 'Login successful',
            'admin': admin.to_dict()
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@admin_bp.route('/admin/logout', methods=['POST'])
@admin_required
def admin_logout():
    """Admin logout endpoint"""
    session.pop('admin_id', None)
    return jsonify({'message': 'Logout successful'}), 200

@admin_bp.route('/admin/profile', methods=['GET'])
@admin_required
def get_admin_profile():
    """Get current admin profile"""
    admin = AdminUser.query.get(session['admin_id'])
    return jsonify(admin.to_dict())

@admin_bp.route('/admin/users', methods=['GET'])
@admin_required
def get_admin_users():
    """Get all admin users"""
    users = AdminUser.query.all()
    return jsonify([user.to_dict() for user in users])

@admin_bp.route('/admin/users', methods=['POST'])
@admin_required
def create_admin_user():
    """Create new admin user"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'admin')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    # Check if username already exists
    if AdminUser.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    admin_user = AdminUser(username=username, role=role)
    admin_user.set_password(password)
    
    db.session.add(admin_user)
    db.session.commit()
    
    return jsonify(admin_user.to_dict()), 201

@admin_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_admin_user(user_id):
    """Update admin user"""
    admin_user = AdminUser.query.get_or_404(user_id)
    data = request.json
    
    if 'username' in data:
        admin_user.username = data['username']
    if 'role' in data:
        admin_user.role = data['role']
    if 'password' in data:
        admin_user.set_password(data['password'])
    if 'is_active' in data:
        admin_user.is_active = data['is_active']
    
    db.session.commit()
    return jsonify(admin_user.to_dict())

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_admin_user(user_id):
    """Delete admin user"""
    admin_user = AdminUser.query.get_or_404(user_id)
    
    # Prevent deleting the last admin user
    if AdminUser.query.filter_by(is_active=True).count() <= 1:
        return jsonify({'error': 'Cannot delete the last active admin user'}), 400
    
    db.session.delete(admin_user)
    db.session.commit()
    
    return jsonify({'message': 'Admin user deleted successfully'}), 200

@admin_bp.route('/admin/analytics', methods=['GET'])
@admin_required
def get_analytics():
    """Get analytics data"""
    total_scraped = ScrapedData.query.count()
    total_content = SiteContent.query.count()
    published_content = SiteContent.query.filter_by(is_published=True).count()
    total_admins = AdminUser.query.filter_by(is_active=True).count()
    
    # Recent activity
    recent_scraped = ScrapedData.query.order_by(ScrapedData.timestamp.desc()).limit(5).all()
    recent_content = SiteContent.query.order_by(SiteContent.last_updated.desc()).limit(5).all()
    
    return jsonify({
        'totals': {
            'scraped_data': total_scraped,
            'site_content': total_content,
            'published_content': published_content,
            'admin_users': total_admins
        },
        'recent_activity': {
            'scraped_data': [item.to_dict() for item in recent_scraped],
            'site_content': [item.to_dict() for item in recent_content]
        }
    })

