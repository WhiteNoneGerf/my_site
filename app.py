from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# Додаємо маршрут для favicon
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static/img'),  # Updated path
        'favicon.ico', 
        mimetype='image/vnd.microsoft.icon'
    )

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/tools')
def tools():
    return render_template('tools.html')

@app.route('/pricing')
def pricing():
    return render_template('pricing.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/docs')
def docs():
    return render_template('docs.html')

@app.route('/features')
def features():
    return render_template('features.html')

@app.route('/security')
def security():
    return render_template('security.html')

@app.route('/roadmap')
def roadmap():
    return render_template('roadmap.html')

@app.route('/api')
def api():
    return render_template('api.html')

@app.route('/guides')
def guides():
    return render_template('guides.html')

@app.route('/examples')
def examples():
    return render_template('examples.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/careers')
def careers():
    return render_template('careers.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/terms')
def terms():
    return render_template('terms.html')

@app.route('/cookies')
def cookies():
    return render_template('cookies.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)


