function register_login_events(){

    $(document).on("click", "#delete-btn", function(e) {
        // Ask the user for confirmation before deletion
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        
        if (confirmDelete) {
            // Access product ID from the hidden input field
            const itemId = $("#productId").val(); // Retrieve the product ID from the hidden field
    
            console.log("Item ID to delete: " + itemId); // Check the item ID in the console
    
            // Send the DELETE request to the Flask route which forwards it to FastAPI
            $.ajax({
                url: `/deleteProduct/${itemId}`,  // Flask route to handle deletion
                type: 'DELETE',
                success: function(response) {
                    // Success: Show a success message and redirect
                    alert("Item deleted successfully!");
                    window.location.href = "/Homepage";  // Redirect to the items list page
                },
                error: function(xhr, status, error) {
                    // Error: Show an error message
                    alert("Error deleting the item: " + xhr.responseText);
                }
            });
        }
    });

    $(document).on("change", "#categoryDropdown", function (e) {
        let selectedCategory = $(this).val();
    
        if (selectedCategory) {
            request_data = {
                category: selectedCategory
            };
            get_profile_data(request_data);
        }
    });

    
    $(document).on("click", "#supportBtn", function(e) {
        // Ask the user for confirmation before deletion
        request_data = {
            name: $('#name').val(),
            email:$('#email').val(),
            message:$('#message').val()
        }
        support(request_data)
    });

    $(document).on("click", "#updatebtn", function (e) {
        e.preventDefault(); // Prevent default form submission
    
        var itemId = $("#item_id").val();
    
        var request_data = {
            "product_name": $("#product_name").val(),
            "key_feature": $("#key_feature").val(),
            "rental_price_per_day": parseInt($("#rental_price_per_day").val(), 10),
            "category": $("#category").val(),
            "brand": $("#brand").val(),
            "model": $("#model").val(),
            "location": $("#location").val(),
            "availability_status": $("#availability_status").val() === "Available",
            "description": $("#description").val(),
        };
    
        console.log(request_data);
        update_item(itemId, request_data);
    });

    $(document).on("click", "#loginSubmit", function(e){
        var userName = $("#userLoginEmail").val();
        var password = $("#userLoginPassword").val();
        var userType = $("#usetTypeLogin option:selected").val();
        
        var request_data = {
            "user_email": userName,
            "password":password,
            "userType": userType
        }
        console.log(request_data)
        verify_user_login(request_data);
    }); 

    $(document).on("click", "#userProfile", function (e) {
            e.preventDefault(); // Prevent form from refreshing the page
    
            var first_name = $("#first_name").val();
            var phone_no = $("#phone_no").val();
            var address = $("#address").val();
            var email = $("#email").val();
            var last_name = $("#last_name").val(); 
            var city = $("#city").val();
            
    
    
            var request_data = {
                "first_name": first_name,
                "phone_no": phone_no,
                "address": address,
                "email":email,
                "city":city,
                "last_name":last_name
            };
    
            console.log("Sending update request:", request_data);
        updateUser(email,request_data)
        
    }); 

    $(document).on("click", "#registrationSubmit", function(e){
   
        var firstName = $("#userFirstName").val();
        var lastName = $("#userLastName").val();
        var mobile = $("#userMobileNo").val();
        var email = $("#userEmail").val();
        var city = $("#userCity").val();
        var address = $("#userAddress").val();
        var password = $("#userPassword").val();
        var userType = $("#usetType option:selected").val();
    
        var request_data = {
            "first_name" : firstName,
            "last_name" : lastName,
            "mobile_no":parseInt(mobile),
            "email":email,
            "password": password,
            "city":city,
            "address":address,
            "userType":userType,
       }
        
        console.log(request_data)
        user_signup(request_data);
    });

 
    $('#rentBtn').click(function(event) {
        event.preventDefault(); // Prevent default form submission

        // Create a FormData object
        const formData = new FormData();
        formData.append('product_name', $('#product_name').val());
        formData.append('key_feature', $('#key_feature').val());
        formData.append('description', $('#description').val());
        formData.append('category', $('#category').val());
        formData.append('brand', $('#brand').val());
        formData.append('model', $('#model').val());
        formData.append('rental_price_per_day', $('#rental_price_per_day').val());
        formData.append('availability_status', $('#availability_status').val() === 'true');
        formData.append('location', $('#location').val());
        formData.append('user_id', $('#userId').val());
        formData.append('image', $('#productImage')[0].files[0]);
       
        upload_item(formData)
    });
    
    
}

function upload_item(formData){
    $.ajax({
        url: 'http://127.0.0.1:20000/rent_item/',  // Adjust backend URL if needed
        type: 'POST',
        data: formData,
        processData: false,  // Prevent jQuery from processing the data
        contentType: false,  // Prevent jQuery from setting the content type
        success: function(response) {
            // Handle success response
            alert('Form submitted successfully');
            console.log(response);

           
        },
        error: function(xhr, status, error) {
            // Handle error response
            console.error('Error:', error);
            alert('Error submitting rent item');
        }
    });
}

function update_item(itemId, request_data) {
    $.ajax({
        url: `http://localhost:6078/api/update/${itemId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(request_data),
        success: function (response) {
            $('#statusMessage').text(response.message).css('color', 'green');
            window.location.href = '/Homepage'; // Redirect on success
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.detail || 'An unexpected error occurred.';
            $('#statusMessage').text(`Error: ${errorMessage}`).css('color', 'red');
        }
    });
}

function user_signup(request_data){
   
    $.ajax({
        url:'/user_signup',
        type:"POST",
        dataType:"json",
        contentType : "application/json",
        data : JSON.stringify(request_data),
        beforeSend : function() {
            
        },
        success : function (data, status, xhr){
           
        },
        error : function(jqXhr, textStatus, errorMsg){
            console.log(errorMsg);
        }
    });
}

function updateUser(email,request_data){
    console.log(request_data)

    $.ajax({
        url: `http://127.0.0.1:20000/update_user/${email}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(request_data),
        success: function(response) {
            alert("User updated successfully!");
            window.location.href = '/user_profile';
        },
        error: function(xhr) {
            alert("Error: " + xhr.responseText);
        }
    });
}

function verify_user_login(request_data){
    
    $.ajax({
        url:'/attempt_to_login',
        type:"POST",
        dataType:"json",
        contentType : "application/json",
        data : JSON.stringify(request_data),
        beforeSend : function() {
        },
        success : function (data, status, xhr){
            console.log(data)
            if(data['status'] == 'Login Successful'){
                console.log("Login done");
                console.log("User ID:", data['user_id']);
                sessionStorage.setItem('user_id', data['user_id']);
                setTimeout(() => {
                    window.location.href = '/Homepage';
                }, 500);
               
            }
            else{
                window.location.href = '/loginPage';
            }
        },
        error : function(jqXhr, textStatus, errorMsg){
            console.log(errorMsg);
        }
    });
}


async function fetchItems() {
    try {

        const response = await fetch('http://127.0.0.1:20000/get_items/');
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }

        const data = await response.json();
        const items = data.items;

        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; // Clear existing content

        items.forEach(item => {
            const cardHTML = `
                <div class="item-card">
                <button class="heart-button" onclick="addToWishlist(${item.item_id})">
                       <i class="fa-regular fa-heart"></i> 
                </button>
                    <img src="data:image/jpeg;base64,${item.image_data}" alt="${item.filename}" class="item-image" />
                    <h3>${item.product_name}</h3>
                    <p>${item.key_feature || 'No key feature available'}</p>
                    <p>₹${item.rental_price_per_day}/day</p>
                    
                    <a href="/producImage/${item.item_id}" class="card-button">Rent Now</a>
                </div>
            `;
            gallery.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}


// Function to fetch items and display them
function fetchItemsToAdd() {
    $.ajax({
      url: "http://127.0.0.1:20000/get_items/",
      type: "GET",
      success: function (data) {
        const items = data.items;
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = ""; // Clear existing content
  
        items.forEach(item => {
          const cardHTML = `
            <div class="item-card">
             <button class="heart-button" >
                       <i class="fa-regular fa-heart"></i>
                </button>
              <img src="data:image/jpeg;base64,${item.image_data}" alt="${item.filename}" class="item-image" />
              <h3>${item.product_name}</h3>
              <p>${item.key_feature || "No key feature available"}</p>
              <p>₹${item.rental_price_per_day}/day</p>
            </div>
          `;
          gallery.innerHTML += cardHTML;
        });
      },
      error: function (xhr) {
        console.error("Error fetching items:", xhr.responseText);
      }
    });
  }
  


function addToCart(itemId) {
    userId = productPage.dataset.userId; // D
    console.log(userId)
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:20000/cart/add',
        contentType: 'application/json',
        data: JSON.stringify({ 
            user_id: userId, 
            item_id: itemId,
            quantity: 1  
        }),
        success: function(response) {
            alert('Item added to cart successfully!');
            const cartContainer = $('.containerOfaddToCard');
            const newCard = $('<div>', { class: 'item-card' }).html(response);
            cartContainer.append(newCard);
        },
        error: function() {
            alert('Failed to add item to cart');
           
        }
    });
}


function addToWishlist(itemId) {
    let request_data = {  
        item_id: itemId 
    };
    console.log(request_data)

    $.ajax({
        type: 'POST',
        url: '/wishlistPage',
        contentType: 'application/json',
        data: JSON.stringify(request_data),
        success: function(response) {
            alert('Item added to wishlist successfully!');
            console.log("Wishlist Response:", response);
        },
        error: function(xhr, status, error) {
            console.error("Error:", xhr.responseText);
            alert("Failed to add item to wishlist. Please try again.");
        }
    });
}
  
// function loadCartItems() {
//      userId = $('#containerOfaddToCard').data('user-id'); // Retrieve user ID
//     $.ajax({
//         url: `http://localhost:20000/cart/items?user_id=${userId}`, // Replace with your FastAPI backend URL
//         type: "GET",
//         success: function (data) {
//             const gallery = document.getElementById("galleryOfAddCard");
//             gallery.innerHTML = ""; // Clear any existing content

//             const uniqueItems = Array.from(new Set(data.map(item => item.item_id)))
//             .map(item_id => data.find(item => item.item_id === item_id));
//             if (!Array.isArray(data) || data.length === 0) {
//                 // If no cart items, show a message indicating an empty cart
//                 gallery.innerHTML = `
//                     <div class="empty-cart-message">
//                         <h3>Your cart is empty</h3>
//                         <p>Select items to add to your cart!</p>
//                     </div>
//                 `;
//                 return; // Exit function
//             }

//             // Dynamically create HTML for each cart item
//             uniqueItems.forEach(item => {

//                 const quantity = item.quantity || 1; // Default quantity is 1 if not provided
//                 const totalPrice = item.rental_price_per_day * quantity; // Calculate total price for each item
//                 totalCartPrice += totalPrice
//                 const cardHTML = `
//                     <div class="item-card">
//                         <img src="data:image/jpeg;base64,${item.image_data}" alt="${item.product_name}" class="item-image" />
//                         <h3>${item.product_name}</h3>
//                         <p>${item.key_feature || "No key feature available"}</p>
//                         <p>₹${item.rental_price_per_day}/day</p>
//                     </div>

//                     <div class="quantity-control">
       
//         <button id="remove-${item.item_id}" onclick="removeCartItem(${item.item_id}, ${userId})">Remove</button>
//        <button onclick=loadItemDetail(${item.item_id})>
//         Place Order
//        </button>
//       </div>
//                 `;
//                 gallery.innerHTML += cardHTML;
//             });
//             gallery.innerHTML += `
//             <div class="total-cart-price">
//                 <h3>Total Cart Price: ₹${totalCartPrice}</h3> <!-- Display total cart price -->
//             </div>
//         `;
//         },

        
//         error: function (xhr) {
//             console.error("Error fetching cart items:", xhr.responseText);
          
//         }
//     });
// }

function loadCartItems() {
     userId = $('#containerOfaddToCard').data('user-id'); // Retrieve user ID
    let totalCartPrice = 0; // Initialize totalCartPrice to 0

    $.ajax({
        url: `http://localhost:20000/cart/items?user_id=${userId}`, // Replace with your FastAPI backend URL
        type: "GET",
        success: function (data) {
            const gallery = document.getElementById("galleryOfAddCard");
            gallery.innerHTML = ""; // Clear any existing content

            const uniqueItems = Array.from(new Set(data.map(item => item.item_id)))
                .map(item_id => data.find(item => item.item_id === item_id));

            if (!Array.isArray(data) || data.length === 0) {
                // If no cart items, show a message indicating an empty cart
                gallery.innerHTML = `
                    <div class="empty-cart-message">
                        <h3>Your cart is empty</h3>
                        <p>Select items to add to your cart!</p>
                    </div>
                `;
                return; // Exit function
            }

            // Dynamically create HTML for each cart item
            uniqueItems.forEach(item => {
                const totalPrice = item.rental_price_per_day ; // Calculate total price for each item
                totalCartPrice += totalPrice; // Add item total price to cart total price

                const cardHTML = `
                    <div class="item-card">
                        <img src="data:image/jpeg;base64,${item.image_data}" alt="${item.product_name}" class="item-image" />
                        <h3>${item.product_name}</h3>
                        <p>${item.key_feature || "No key feature available"}</p>
                        <p>₹${item.rental_price_per_day}/day</p>
                         <a href="/producImage/${item.item_id}" class="card-button">check out</a>
                    </div>

                    <div class="quantity-control">
                        <button id="remove-${item.item_id}" onclick="removeCartItem(${item.item_id}, ${userId})">Remove</button>
                        <button onclick="loadItemDetail(${item.item_id})">Place Order</button>
                    </div>
                `;
                gallery.innerHTML += cardHTML; // Append item card to the gallery
            });

            // Display the total price of all items in the cart at the bottom
            gallery.innerHTML += `
                <div class="total-cart-price">
                    <h3>Total Cart Price: ₹${totalCartPrice}</h3> <!-- Display total cart price -->
                </div>
            `;
        },
        error: function (xhr) {
            console.error("Error fetching cart items:", xhr.responseText);
        }
    });
}

function loadCartItems() {
    userId = $('#containerOfaddToCard').data('user-id'); // Retrieve user ID
   let totalCartPrice = 0; // Initialize totalCartPrice to 0

   $.ajax({
       url: `http://localhost:20000/cart/items?user_id=${userId}`, // Replace with your FastAPI backend URL
       type: "GET",
       success: function (data) {
           const gallery = document.getElementById("galleryOfAddCard");
           gallery.innerHTML = ""; // Clear any existing content

           const uniqueItems = Array.from(new Set(data.map(item => item.item_id)))
               .map(item_id => data.find(item => item.item_id === item_id));

           if (!Array.isArray(data) || data.length === 0) {
               // If no cart items, show a message indicating an empty cart
               gallery.innerHTML = `
                   <div class="empty-cart-message">
                       <h3>Your cart is empty</h3>
                       <p>Select items to add to your cart!</p>
                   </div>
               `;
               return; // Exit function
           }

           // Dynamically create HTML for each cart item
           uniqueItems.forEach(item => {
               const totalPrice = item.rental_price_per_day ; // Calculate total price for each item
               totalCartPrice += totalPrice; // Add item total price to cart total price

               const cardHTML = `
                   <div class="item-card">
                       <img src="data:image/jpeg;base64,${item.image_data}" alt="${item.product_name}" class="item-image" />
                       <h3>${item.product_name}</h3>
                       <p>${item.key_feature || "No key feature available"}</p>
                       <p>₹${item.rental_price_per_day}/day</p>
                        <a href="/producImage/${item.item_id}" class="card-button">check out</a>
                   </div>

                   <div class="quantity-control">
                       <button id="remove-${item.item_id}" onclick="removeCartItem(${item.item_id}, ${userId})">Remove</button>
                       <button onclick="loadItemDetail(${item.item_id})">Place Order</button>
                   </div>
               `;
               gallery.innerHTML += cardHTML; // Append item card to the gallery
           });

           // Display the total price of all items in the cart at the bottom
           gallery.innerHTML += `
               <div class="total-cart-price">
                   <h3>Total Cart Price: ₹${totalCartPrice}</h3> <!-- Display total cart price -->
               </div>
           `;
       },
       error: function (xhr) {
           console.error("Error fetching cart items:", xhr.responseText);
       }
   });
}

function fetchWishlistItems() {
    userId = $('#wishlist-container').data('user-id'); // Retrieve user ID
    // Initialize totalCartPrice to 0
    console.log(userId)
    $.ajax({
        type: "GET",
        url: `http://localhost:20000/wishlist/items?user_id=${userId}`, // Ensure this endpoint is correctly defined in your Flask app
        contentType: "application/json",
        success: function (response) {
            if (response.length === 0) {
                $("#wishlist-container").html("<p>Your wishlist is empty.</p>");
                return;
            }

            let wishlistHTML = "";
            response.forEach((item) => {
                wishlistHTML += `
                    <div class="item-card">
                        <img src="data:image/jpeg;base64,${item.image_data}" alt="${item.product_name}" class="item-image" />
                        <h3>${item.product_name}</h3>
                        <p>${item.key_feature || "No key feature available"}</p>
                        <p>₹${item.rental_price_per_day}/day</p>
                        <a href="/producImage/${item.item_id}" class="card-button">Check Out</a>
                         <button id="remove-${item.item_id}" class="card-button-remove" onclick="removeCartItem(${item.item_id}, ${item.user_id})">Remove</button>
                    </div>
                    

                `;
            });

            $("#wishlist-container").html(wishlistHTML);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching wishlist:", xhr.responseText);
            $("#wishlist-container").html("<p>Failed to load wishlist. Please try again.</p>");
        },
    });
}

function removeCartItem(itemId, userId) {
    $.ajax({
        url: `http://localhost:20000/cart/items/${itemId}?user_id=${userId}`,
        type: "DELETE",
        success: function (response) {
            alert(response.message);
            // Remove the card from the DOM
            // document.getElementById(`item-card-${itemId}`).remove();
            window.location.href = "/addToCard"; 
        },
        error: function (xhr) {
            console.error("Error removing cart item:", xhr.responseText);
            alert("Failed to remove item from the cart.");
        }
    });
}

function loadItemDetail(itemId) {
    $.ajax({
        url: `http://localhost:20000/item/${itemId}`, // Backend API endpoint
        type: "GET",
        success: function (data) {
            console.log(data)
            const itemDetailsContainer = $("#checkoutCon");
            if (!itemDetailsContainer) {
                console.error("Item details container not found");
                return;
            }

            // Clear previous content
            itemDetailsContainer.innerHTML = "";

            // Populate item details dynamically
            const itemHTML = `
                <div class="item-card">
                    <img src="data:image/jpeg;base64,${data.image_data}" alt="${data.product_name}" class="item-image" />
                    <h3>${data.product_name}</h3>
                    <p>${data.key_feature || "No key feature available"}</p>
                    <p>₹${data.rental_price_per_day}/day</p>
                    
                </div>
                <div class="order-actions">
                    <button onclick="alert('Order placed for item ID: ${itemId}')">Place Order</button>
                </div>
            `;
            itemDetailsContainer.innerHTML = itemHTML;
        },
        error: function (xhr) {
            const itemDetailsContainer = document.getElementById("item-details-container");
            if (!itemDetailsContainer) {
                console.error("Item details container not found");
                return;
            }

            // Display error message
            itemDetailsContainer.innerHTML = `
                <h2>Error</h2>
                <p>Unable to fetch item details. Please try again later.</p>
            `;
            console.error("Error fetching item details:", xhr.responseText);
        },
    });
}

// function populateItemDetails(itemId) {
//     $.ajax({
//       url: `http://localhost:20000/item/${itemId}`,  // API call to fetch item details
//       type: 'GET',  // HTTP method
//       success: function (response) {
//         // On success, display the item details in the checkout container
//         const item = response;
//         console.log(item)
//         window.location.href = '/checkoutPage';

//         // Prepare HTML with the item details
//         let itemDetailsHtml = `
//           <h2>${item.product_name}</h2>
//           <p><strong>Key Feature:</strong> ${item.key_feature}</p>
//           <p><strong>Rental Price per Day:</strong> ₹${item.rental_price_per_day}</p>
//           <p><strong>Quantity Available:</strong> ${item.quantity}</p>
//           <img src="data:image/jpeg;base64,${item.image_data}" alt="Item Image" />
//         `;

//         // Populate the checkout container with item details
//         $('#checkoutCon').html(itemDetailsHtml);

       
//       },
//       error: function (xhr, status, error) {
//         // Handle error if item details can't be fetched
//         console.error("Error:", error);
//         alert("Failed to fetch item details.");
//       }
//     });
//   }

// window.paypal
// .Buttons({
//     style: {
//         shape: "rect",
//         layout: "vertical",
//         color: "gold",
//         label: "paypal",
//     },
//     message: {
//         amount: 100,
//     } ,

//     async createOrder() {
//         try {
//             const response = await fetch("/api/orders", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 // use the "body" param to optionally pass additional order information
//                 // like product ids and quantities
//                 body: JSON.stringify({
//                     cart: [
//                         {
//                             id: "YOUR_PRODUCT_ID",
//                             quantity: "YOUR_PRODUCT_QUANTITY",
//                         },
//                     ],
//                 }),
//             });

//             const orderData = await response.json();

//             if (orderData.id) {
//                 return orderData.id;
//             }
//             const errorDetail = orderData?.details?.[0];
//             const errorMessage = errorDetail
//                 ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
//                 : JSON.stringify(orderData);

//             throw new Error(errorMessage);
//         } catch (error) {
//             console.error(error);
//             // resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
//         }
//     } ,

//     async onApprove(data, actions) {
//         try {
//             const response = await fetch(
//                 `/api/orders/${data.orderID}/capture`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             const orderData = await response.json();
//             // Three cases to handle:
//             //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
//             //   (2) Other non-recoverable errors -> Show a failure message
//             //   (3) Successful transaction -> Show confirmation or thank you message

//             const errorDetail = orderData?.details?.[0];

//             if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
//                 // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
//                 // recoverable state, per
//                 // https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
//                 return actions.restart();
//             } else if (errorDetail) {
//                 // (2) Other non-recoverable errors -> Show a failure message
//                 throw new Error(
//                     `${errorDetail.description} (${orderData.debug_id})`
//                 );
//             } else if (!orderData.purchase_units) {
//                 throw new Error(JSON.stringify(orderData));
//             } else {
//                 // (3) Successful transaction -> Show confirmation or thank you message
//                 // Or go to another URL:  actions.redirect('thank_you.html');
//                 const transaction =
//                     orderData?.purchase_units?.[0]?.payments
//                         ?.captures?.[0] ||
//                     orderData?.purchase_units?.[0]?.payments
//                         ?.authorizations?.[0];
//                 resultMessage(
//                     `Transaction ${transaction.status}: ${transaction.id}<br>
//       <br>See console for all available details`
//                 );
//                 console.log(
//                     "Capture result",
//                     orderData,
//                     JSON.stringify(orderData, null, 2)
//                 );
//             }
//         } catch (error) {
//             console.error(error);
//             resultMessage(
//                 `Sorry, your transaction could not be processed...<br><br>${error}`
//             );
//         }
//     } ,
// })
// .render("#paypal-button-container"); 



function support(request_data){
    $.ajax({
        url:'/support',
        type:"POST",
        dataType:"json",
        contentType : "application/json",
        data : JSON.stringify(request_data),
        beforeSend : function() {
            
        },
        success : function (data, status, xhr){
            console.log(data); // Log the full JSON response
             alert("Support request submitted successfully!");
        },
        error : function(jqXhr, textStatus, errorMsg){
            console.log(errorMsg);
        }
    });
}

function get_profile_data(category){

    $.ajax({
        url:'/search',
        type:"POST",
        dataType:"json",
        contentType : "application/json",
        data : JSON.stringify(request_data),
        beforeSend : function() {
            
        },
        success : function (data, status, xhr){
            // console.log(data);
            raw_profile_data = JSON.parse(data['data'])
            // var profile_data = JSON.parse(raw_profile_data['data']);
            populate_profile_data(raw_profile_data);
            console.log(raw_profile_data)
        },
        error : function(jqXhr, textStatus, errorMsg){
            console.log(errorMsg);
        }
    });
}

function populate_profile_data(raw_profile_data) {
    $("#gallery").html(""); // Clear previous results

    if (!raw_profile_data || raw_profile_data.length === 0) {
        $("#gallery").html("<p class='text-danger'>No items found for this category.</p>");
        return;
    }

    let itemsHTML = "";
    raw_profile_data.forEach(item => {
        itemsHTML += `
            <div class="item-card">
             <button class="heart-button" >
                       <i class="fa-regular fa-heart"></i>
                </button>
              <img src="data:image/jpeg;base64,${item.image_data}" alt="${item.filename}" class="item-image" />
              <h3>${item.product_name}</h3>
              <p>${item.key_feature || "No key feature available"}</p>
              <p>₹${item.rental_price_per_day}/day</p>
            </div>
        `;
    });

    $("#gallery").html(itemsHTML);
}

function get_user_item() {
     userId = $('#user_page').val()  // Replace with actual user ID dynamically

    $.ajax({
        url: `http://localhost:20000/get_user_item?user_id=${userId}`,
        type: "GET",
        contentType: "application/json",
        success: function (data, status, xhr) {
            console.log(data);
            if (Array.isArray(data) && data.length > 0) {
                populate_user_item_data(data);  // Directly pass the array
                console.log(data);
            } else {
                console.error("No valid data found.");
                $("#user_item").html("<p class='text-danger'>No items found.</p>");
            }
        },
        error: function (jqXhr, textStatus, errorMsg) {
            console.log(errorMsg);
            $("#user_item").html("<p class='text-danger'>No items found.</p>");
        }
    });
}

function populate_user_item_data(data) {
    $("#user_item").html(""); // Clear previous results

    if (!data || data.length === 0) {
        $("#user_item").html("<p class='text-danger'>No items found for this category.</p>");
        return;
    }

    let itemsHTML = "";
    data.forEach(item => {
        itemsHTML += `
            <div class="item-card">
             <button class="heart-button" >
                       <i class="fa-regular fa-heart"></i>
                </button>
              <img src="data:image/jpeg;base64,${item.image_data}" alt="${item.filename}" class="item-image" />
              <h3>${item.product_name}</h3>
              <p>${item.key_feature || "No key feature available"}</p>
              <p>₹${item.rental_price_per_day}/day</p>
              <a href="/producImage/${item.item_id}" class="card-button">check Now</a>
            </div>
        `;
    });

    $("#user_item").html(itemsHTML);
}
