# System Architecture and Development Plan

## 1. Overall Architecture

The application will follow a client-server architecture, consisting of a frontend, a backend, a database, and an administrative panel. The core functionality will involve web scraping, storing the scraped data, and providing an interface for users to view this data, as well as an admin panel for managing the site and viewing analytics.

*   **Frontend (Client-side):** This will be the user-facing part of the application, built as a Single Page Application (SPA).
*   **Backend (Server-side):** This will handle all the business logic, data storage, and serve the API endpoints for the frontend and admin panel.
*   **Database:** A persistent storage solution for scraped data, user credentials, and site configuration.
*   **Admin Panel:** A separate interface for administrators to manage content, users, and view analytics.

## 2. Technology Choices

To maintain consistency with the provided TypeScript files and leverage modern web development practices, the following technologies will be used:

*   **Frontend:** React.js (with TypeScript) - A popular and robust library for building user interfaces. This aligns with the `ohara_dev_components` which seem to be related to UI components.
*   **Backend:** Node.js with Express.js (with TypeScript) - A fast and scalable runtime environment for server-side applications, and a minimalist web framework for Node.js. This will allow seamless integration with the existing TypeScript scraping logic.
*   **Database:** MongoDB - A NoSQL database that is flexible and well-suited for storing diverse data, including the scraped content and potentially dynamic site configurations. It pairs well with Node.js.
*   **Admin Panel:** Built using React.js (with TypeScript) as part of the same frontend application, but with protected routes and specific components for administrative tasks.
*   **Deployment:** Docker for containerization, and a cloud platform (e.g., Google Cloud Platform, AWS, or a simpler PaaS like Heroku) for hosting. For simplicity and demonstration, we will initially focus on local Docker deployment and then suggest a cloud platform.

## 3. Data Model Outline

### Scraped Data

This will store the information extracted from the `ohara.ai` mini-apps. Each scraped item will likely include:

*   `url`: The URL from which the data was scraped.
*   `components`: An array of strings representing the `data-component` attributes found on the page.
*   `screenshot_path`: Path to the saved screenshot of the scraped page.
*   `timestamp`: When the data was scraped.
*   `raw_html` (optional): The full HTML content of the scraped page, if needed for further analysis.

### User Credentials (for Admin Panel)

*   `username`: Unique identifier for the admin user.
*   `password_hash`: Hashed password for security.
*   `role`: (e.g., 'admin', 'editor') for access control.

### Site Editing Content

This will be dynamic content that can be modified via the admin panel, such as:

*   `page_name`: Identifier for the page (e.g., 'home', 'about').
*   `section_id`: Identifier for a specific section on the page.
*   `content`: The actual text, HTML, or JSON content for that section.
*   `last_updated`: Timestamp of the last modification.
*   `updated_by`: Admin user who made the last modification.

## 4. API Endpoints Plan

### Public API (for Frontend)

*   `GET /api/scraped-data`: Retrieve all scraped data (or paginated results).
*   `GET /api/scraped-data/:id`: Retrieve a specific scraped data entry.
*   `GET /api/site-content/:page_name`: Retrieve dynamic content for a specific page.

### Admin API (for Admin Panel - requires authentication)

*   `POST /api/admin/login`: Authenticate admin user.
*   `GET /api/admin/scraped-data`: Manage (view, delete) scraped data.
*   `DELETE /api/admin/scraped-data/:id`: Delete a specific scraped data entry.
*   `POST /api/admin/site-content`: Create new site content.
*   `PUT /api/admin/site-content/:id`: Update existing site content.
*   `DELETE /api/admin/site-content/:id`: Delete site content.
*   `GET /api/admin/users`: Manage admin users (create, update, delete).
*   `POST /api/admin/users`: Create new admin user.
*   `PUT /api/admin/users/:id`: Update admin user.
*   `DELETE /api/admin/users/:id`: Delete admin user.
*   `GET /api/admin/analytics`: Retrieve analytics data (e.g., number of scrapes, user activity).

## 5. Admin Panel Structure

The admin panel will be a web interface with the following main sections:

*   **Dashboard:** Overview of key metrics (e.g., total scraped items, recent activity).
*   **Scraped Data Management:** List, view details, and delete scraped entries.
*   **Site Content Editor:** A WYSIWYG (What You See Is What You Get) editor or a structured form to modify dynamic content on the public-facing website.
*   **User Management:** Create, edit, and delete admin users.
*   **Analytics:** Visualizations and reports on scraping activity, user engagement, and site performance.
*   **Settings:** Configuration options for the scraping process (e.g., adding new URLs to scrape).

## 6. Deployment Strategy

Initially, the application will be set up for local development and testing using Docker Compose to orchestrate the backend, frontend, and database services. For production deployment, the following steps will be considered:

1.  **Containerization:** Docker images will be created for both the backend and frontend applications.
2.  **Orchestration:** Docker Compose for local development, Kubernetes or a similar service for production (if scaling is required).
3.  **Cloud Provider:** Selection of a cloud provider (e.g., Google Cloud Platform, AWS, DigitalOcean) based on scalability, cost, and ease of management.
4.  **CI/CD:** (Optional, but recommended for production) Set up Continuous Integration/Continuous Deployment pipelines to automate testing and deployment.

## 7. User Guides Plan

Two main user guides will be created, written in a simple, easy-to-understand language suitable for an 8th-grade child. They will include clear, step-by-step instructions and illustrations where necessary.

1.  **User Guide (for End-Users):**
    *   What the application does (in simple terms).
    *   How to access and navigate the public-facing website.
    *   How to view the scraped data.
    *   Basic troubleshooting tips.

2.  **Admin Guide (for Administrators):**
    *   How to log in to the admin panel.
    *   How to manage scraped data.
    *   How to edit site content.
    *   How to manage admin users.
    *   How to view analytics.
    *   How to configure scraping settings.

3.  **Deployment Guide (for Developers/Advanced Users):**
    *   How to set up the development environment.
    *   How to run the application locally using Docker Compose.
    *   Instructions for deploying to a chosen cloud platform.

This plan provides a comprehensive roadmap for developing the full-stack application. The next phase will involve setting up the backend and implementing the core functionalities.

