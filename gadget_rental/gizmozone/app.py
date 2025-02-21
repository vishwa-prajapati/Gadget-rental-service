from flask import Flask,render_template,request,url_for,jsonify,json,session,redirect,Response
from flask_cors import CORS,cross_origin
import json
import requests
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
import base64


app = Flask(__name__)

app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  #Cookie Same site attribute
app.config['SESSION_COOKIE_SECURE'] = True
app.secret_key = 'This_is_very_secret'
login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, id):
        self.id = id

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

def get_logged_in_user():
    user_login = False
    user_info = session.get('user_email')
    if(user_info is not None):
        user_logged_in = user_info
    else:
        user_logged_in = None
    if(user_logged_in is not None):
        user_login = True

    return user_login

@app.route('/')
def index():

    return "<h1> Hello </h1>"

@app.route('/loginPage')
def loginPage():
    user_info = session.get('user_email')
    user_id= session.get('user_id')
    user_type = session.get('user_type')
    print('Logged in User' , user_info )
    print("user_id",user_id )
    return render_template('login.html', user_type=user_type)

@app.route('/producImage/<int:item_id>')
def producImage(item_id):
    user_info = session.get('user_email')
    user_type = session.get('user_type')
    print('Logged in User:', user_info)

    # Fetch product details from the backend
    response = requests.get(f'http://127.0.0.1:20000/items/{item_id}')
    if response.status_code != 200:
        return "Product not found", 404
    product = response.json()
    user_id= session.get('user_id')
    return render_template('producImage.html', product=product,user_id=user_id)

@app.route('/checkoutPage')
def checkoutPage():
    user_type = session.get('user_type')
    user_info = session.get('user_email')
    print('Logged in User:', user_info)
    return render_template('checkoutPage.html')

@app.route('/wishlistPage', methods=['GET', 'POST'])
def wishlistPage():
    user_info = session.get('user_email')
    user_id = session.get('user_id')
    user_type = session.get('user_type')

    if request.method == 'GET':
        print('Logged in User:', user_info, user_id)
        return render_template('wishlistPage.html', user_id=user_id)

    if request.method == 'POST':
        if not user_id:
            return jsonify({"error": "User not logged in"}), 401

        data = request.get_json()
        item_id = data.get("item_id")  # Get item_id from request body

        if not item_id:
            return jsonify({"error": "Item ID is required"}), 400

        url = get_service_url() + "/wishlist/add"
        request_data = {"user_id": user_id, "item_id": item_id}
        print("Request Data:", request_data)  # Debugging

        # Make request to wishlist service
        response = post_api_function(url, request_data)

        if response.status_code != 200:
            return jsonify({"error": "Failed to add to wishlist"}), response.status_code

        return jsonify(response.json())



@app.route('/get_user_item_page')
def get_user_item_page():
    user_info = session.get('user_email')
    user_id = session.get('user_id')
    user_type = session.get('user_type')
    print('Logged in User:', user_info)
    return render_template('get_userItem.html', user_id=user_id)

@app.route('/rentPage')
def rentPage():
    user_info = session.get('user_email')
    user_type = session.get('user_type')
    print('Logged in User' , user_info)
    user_id= session.get('user_id')
    return render_template('rentPage.html',user_info=user_info,user_id=user_id)

@app.route('/Homepage')
def Homepage():
    user_info = session.get('user_email')
    print('Logged in User' , user_info)
    user_id= session.get('user_id')
    return render_template('home.html',user_id=user_id)

@app.route('/aboutPage')
@login_required
def aboutPage():
    user_info = session.get('user_email')
    print('Logged in User' , user_info)
    return render_template('about.html')

@app.route('/addToCard')
def addToCard():
    user_info = session.get('user_email')
    print('Logged in User' , user_info)
    user_id= session.get('user_id')
    return render_template('addTocard.html',user_id=user_id)

@login_required
@app.route('/user_profile')
def user_profile():
    user_email = session.get('user_email')
    user_id = session.get('user_id')
    if not user_email:
        return "User not logged in", 401  # Unauthorized if no user is logged in
    response = requests.get(f'http://127.0.0.1:20000/user_profile/{user_email}')
    if response.status_code != 200:
        print(f"Error: {response.status_code}, {response.text}")
        return "User profile not found", 404
    profile = response.json()
    print(profile)
    return render_template('uer_profile.html', user_id=user_id,profile=profile)


@app.route('/supportPage')
def supportPage():
    user_info = session.get('user_email')
    print('Logged in User' , user_info)
    return render_template('supportPage.html')

def post_api_function(url, data):
    response = ''
    try:
        response = requests.post(url, json=data)
        print(response)
    except Exception as e:
        print('An exception', e,'Occured')
    return response

def get_api_function(url):
    response = ''
    try:
        response = requests.get(url)
        print(response)
    except Exception as e:
        print('An exception', e,'Occured')
    return response

# @app.route('/logout')
# def logout():
#     logout_user()
#     session.clear()
#     user_login = get_logged_in_user()
#     return render_template('login.html' , user_login=user_login)

@app.route('/logout')
def logout():
    logout_user()
    session.clear()  # Clear session
    return redirect(url_for('loginPage'))

def get_service_url():
    return 'http://localhost:20000'

@app.route('/user_signup', methods=['POST'])
def user_signup():
    url = get_service_url() + '/user_signup'
    request_data = request.json   
    print(f"Received data: {request_data}")
    response = post_api_function(url, request_data)
    return json.dumps(response.json())

@app.route('/attempt_to_login', methods=['POST'])
def attempt_to_login():
    url = get_service_url() + '/attempt_to_login_for_user'
    request_data = request.json
    print(request_data)
    response = post_api_function(url, request_data)
    result = response.json()
    print(" result of login ",result)
    if(result['status'] == 'Login Failed'):
        session['user_email'] = None
        session['user_id'] = None
        session['user_type'] = None
    else:
        session['user_email'] = request_data['user_email']
        session['user_type'] = request_data['userType']
        user = User(request_data['user_email'])
        session['user_id'] = result.get('user_id')
        login_user(user)

        print("Session Data After Login:")
        print("user_email:", session.get('user_email'))
        print("user_id:", session.get('user_id'))
        print("user_type:", session.get('user_type'))
    return response.json()


@app.route('/deleteProduct/<int:item_id>', methods=['DELETE'])
def delete_product(item_id):
    user_info = session.get('user_email')
    print('Logged in User:', user_info)
    # Send DELETE request to FastAPI to delete the item
    response = requests.delete(f'http://127.0.0.1:20000/items/{item_id}')  # FastAPI delete route
    # Check the response status
    if response.status_code == 200:
        return "Product deleted successfully", 200
    else:
        return f"Failed to delete product: {response.text}", 500
    
@app.route('/update/<int:item_id>', methods=['GET'])
def update_product_form(item_id):
    """Serve the update form with the current item data."""
    user_info = session.get('user_email')
    print('Logged in User:', user_info)
    # Fetch existing data from FastAPI
    response = requests.get(f'http://127.0.0.1:20000/items/{item_id}')
    if response.status_code == 200:
        form_data = response.json()
        return render_template('productUpdatePage.html', item_id=item_id, form_data=form_data)
    else:
        return f"Failed to load product data: {response.text}", 500

@app.route('/api/update/<int:item_id>', methods=['PUT'])
def update_product(item_id):
    """API endpoint for handling update requests."""
    data = request.json
    response = requests.put(f'http://127.0.0.1:20000/api/update/{item_id}', json=data)

    if response.status_code == 200:
        return jsonify({"message": "Product updated successfully"}), 200
    else:
        return jsonify({"error": response.text}), 500


# @app.route('/rent_item', methods=['POST'])
# def rent_item():
#     url = get_service_url() + '/rent_item'
#     request_data = request.json
#     print(f"Received data: {request_data}")
#     response = post_api_function(url, request_data)
#     return json.dumps(response.json())
    
@app.route('/support', methods=['POST'])
def support():
    url = get_service_url() + '/support'
    request_data = request.json    # login_user_type = request_data['user_login_type']
    print(f"Received data: {request_data}")
    response = post_api_function(url, request_data)
    return json.dumps(response.json())

# @app.route('/update_user/<string:user_email>', methods=['GET'])
# def render_update_form(user_email):
#     """Fetch user details and render the update form."""
#     response = requests.get(f"http://localhost:20000/get_user/{user_email}")
#     if response.status_code == 200:
#         profile = response.json()
#         print(profile)
#         return render_template("userProfileUpdate.html", profile=profile)
#     else:
#         return "User not found", 404

@app.route('/search', methods=['POST'])
def search():
    url = get_service_url() + '/search'
    request_data = request.json
    response = post_api_function(url, request_data)
    return jsonify(response.json())

@app.route('/update_user/<string:user_email>', methods=['GET'])
def render_update_form(user_email):
    """Fetch user details and render the update form."""
    response = requests.get(f"http://localhost:20000/get_user/{user_email}")

    if response.status_code == 200:
        data = response.json()  # New response structure
        profile = data.get("profile")  # Extract the actual user details
        role = data.get("role")  # Extract user role (optional)
        
        print(profile)
        return render_template("userProfileUpdate.html", profile=profile, role=role)
    
    else:
        return "User not found", 404


@app.route('/update_user/<string:user_email>', methods=['PUT'])
def update_user(user_email):
    """API endpoint for updating user profile."""
    data = request.json  # JSON data from frontend
    response = requests.put(f"http://localhost:20000/update_user/{user_email}", json=data)
    print("update", response)
    if response.status_code == 200:
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"error": response.text}), 500
    
# @app.route('/wishlist/add', methods=['POST'])
# def wishlist():
#     url = get_service_url() + '/wishlist/add'
#     request_data = request.json
#     print(f"Received data: {request_data}")
#     response = post_api_function(url, request_data)
#     return json.dumps(response.json())
    
# @app.route('/get_user_item', methods=['GET'])
# def get_user_item():
#     url = get_service_url() + '/get_user_item'
#     response = get_api_function(url)
#     print(response)
#     return json.dumps(response.json())

# @app.route('/get_user_item', methods=['GET'])
# def get_user_item():
#     try:
#         user_id = session.get('user_id')  # Get user_id from session
#         if not user_id:
#             return jsonify({"error": "User not logged in"}), 401  # Unauthorized if no user_id in session

#         url = get_service_url() + "/get_user_item"  # FastAPI URL
#         response = get_api_function(url, params={"user_id": user_id})

#         if response.status_code == 404:
#             return jsonify({"error": "No items found in the cart."}), 404
        
#         return jsonify(response.json())  # Return FastAPI response to frontend
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": "An unexpected error occurred"}), 500
#turn FastAPI response to frontend

@app.route('/chat/<owner_id>/<user_id>')
def chat(owner_id, user_id):
    return render_template('chat.html', owner_id=owner_id, user_id=user_id)


if __name__ == '__main__':
    app.run(debug=True, port=6078)

