import os
import json
from datetime import datetime
from playwright.sync_api import sync_playwright
from src.models.scraped_data import ScrapedData, db

class WebScraper:
    def __init__(self, output_dir='screenshots', headless=True):
        self.output_dir = output_dir
        self.headless = headless
        self.max_retries = 3
        
        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)
    
    def slugify(self, url):
        """Convert URL to a safe filename"""
        import re
        # Remove protocol and replace special characters
        slug = re.sub(r'https?://', '', url)
        slug = re.sub(r'[^a-zA-Z0-9]', '_', slug)
        return slug[:100]  # Limit length
    
    def scrape_url(self, url):
        """Scrape a single URL and return data"""
        for attempt in range(self.max_retries):
            try:
                with sync_playwright() as p:
                    browser = p.chromium.launch(headless=self.headless)
                    page = browser.new_page()
                    
                    # Navigate to URL with timeout
                    page.goto(url, timeout=30000)
                    
                    # Wait for page to load
                    page.wait_for_load_state('networkidle')
                    
                    # Extract components with data-component attribute
                    components = page.evaluate('''
                        () => {
                            const elements = document.querySelectorAll('[data-component]');
                            return Array.from(elements).map(el => el.getAttribute('data-component'));
                        }
                    ''')
                    
                    # Get page HTML
                    raw_html = page.content()
                    
                    # Take screenshot
                    slug = self.slugify(url)
                    screenshot_filename = f"{slug}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                    screenshot_path = os.path.join(self.output_dir, screenshot_filename)
                    page.screenshot(path=screenshot_path)
                    
                    browser.close()
                    
                    return {
                        'url': url,
                        'components': components,
                        'screenshot_path': screenshot_path,
                        'raw_html': raw_html,
                        'timestamp': datetime.utcnow()
                    }
                    
            except Exception as e:
                print(f"Attempt {attempt + 1} failed for {url}: {str(e)}")
                if attempt == self.max_retries - 1:
                    raise e
        
        return None
    
    def scrape_and_save(self, url, app_context):
        """Scrape URL and save to database"""
        try:
            result = self.scrape_url(url)
            if result:
                with app_context:
                    # Check if URL already exists
                    existing = ScrapedData.query.filter_by(url=url).first()
                    if existing:
                        # Update existing record
                        existing.set_components(result['components'])
                        existing.screenshot_path = result['screenshot_path']
                        existing.raw_html = result['raw_html']
                        existing.timestamp = result['timestamp']
                    else:
                        # Create new record
                        scraped_data = ScrapedData(
                            url=result['url'],
                            screenshot_path=result['screenshot_path'],
                            raw_html=result['raw_html'],
                            timestamp=result['timestamp']
                        )
                        scraped_data.set_components(result['components'])
                        db.session.add(scraped_data)
                    
                    db.session.commit()
                    print(f"Successfully scraped and saved: {url}")
                    return True
        except Exception as e:
            print(f"Failed to scrape {url}: {str(e)}")
            return False
    
    def scrape_urls_from_config(self, config_file, app_context):
        """Scrape URLs from configuration file"""
        try:
            with open(config_file, 'r') as f:
                config = json.load(f)
            
            urls = config.get('urls', [])
            results = []
            
            for url in urls:
                print(f"Scraping: {url}")
                success = self.scrape_and_save(url, app_context)
                results.append({'url': url, 'success': success})
            
            return results
            
        except Exception as e:
            print(f"Error reading config file: {str(e)}")
            return []

