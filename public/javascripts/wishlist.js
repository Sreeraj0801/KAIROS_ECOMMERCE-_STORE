
function addToWishlist(prodId) {
    $.ajax({
        url: '/addToWishlist/' + prodId,
        method: 'get',
        success: (response) => {
            if(response.product)
            {
                swal("Product already exist!");
            }
            else  if (!response.status) {
                swal("Please Login", "Login to  Add to Whishlist!", "Error");
                setTimeout(() => {
                    window.location.href = '/login'
                }, 2000);
            }
            
            else if (response.status) {
                swal("wow!", "The Product Added to Whishlist!", "success")
            }
        }
    })
}
