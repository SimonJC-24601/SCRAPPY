from datetime import datetime
from src.models.user import db

class SiteContent(db.Model):
    __tablename__ = 'site_content'
    
    id = db.Column(db.Integer, primary_key=True)
    page_name = db.Column(db.String(100), nullable=False)  # e.g., 'home', 'about'
    section_id = db.Column(db.String(100), nullable=False)  # e.g., 'hero', 'features'
    content = db.Column(db.Text, nullable=False)  # HTML, JSON, or plain text
    content_type = db.Column(db.String(20), default='html')  # html, json, text
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    updated_by = db.Column(db.Integer, db.ForeignKey('admin_users.id'))
    is_published = db.Column(db.Boolean, default=False)
    
    # Relationship to admin user
    admin_user = db.relationship('AdminUser', backref='content_updates')
    
    def __init__(self, page_name, section_id, content, content_type='html', updated_by=None):
        self.page_name = page_name
        self.section_id = section_id
        self.content = content
        self.content_type = content_type
        self.updated_by = updated_by
    
    def update_content(self, new_content, updated_by=None):
        """Update content and timestamp"""
        self.content = new_content
        self.last_updated = datetime.utcnow()
        if updated_by:
            self.updated_by = updated_by
    
    def publish(self):
        """Mark content as published"""
        self.is_published = True
        db.session.commit()
    
    def unpublish(self):
        """Mark content as unpublished"""
        self.is_published = False
        db.session.commit()
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'page_name': self.page_name,
            'section_id': self.section_id,
            'content': self.content,
            'content_type': self.content_type,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'updated_by': self.updated_by,
            'is_published': self.is_published
        }
    
    def __repr__(self):
        return f'<SiteContent {self.page_name}.{self.section_id}>'

