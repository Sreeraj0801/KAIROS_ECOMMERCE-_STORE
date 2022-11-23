
function addToCart(prodId) {
    $.ajax({
        url: '/addToCart/' + prodId, 
        method: 'get',
        success: (response) => { 
            if (!response.status) {
                swal("Please Login", "Login to  Add to Cart!", "error").then(()=>{
                    location.href = '/login'
                })
            }
            else if (response.status) {
                let count = $("#cart-count").html()
                count = parseInt(count) + 1
                $("#cart-count").html(count)
                swal("wow!", "The Product Added to Cart!", "success")
            }
        }
    })
}


function moveToCart(prodId,wishId) {
    $.ajax({
        url: '/addToCart/' + prodId,
        method: 'get',
        success: (response) => {
            if (!response.status) {
                swal("Please Login", "Login to  Add to Cart!", "Error");
                setTimeout(() => {
                    window.location.href = '/login'
                }, 2000);
            }
            else if (response.status) {
                let count = $("#cart-count").html()
                count = parseInt(count) + 1
                $("#cart-count").html(count)
                swal("wow!", "The Product Added to Cart!", "success").then(()=>{
                    $.ajax({
                        url:'/removeWishlistProduct',
                        data:{
                            wishlist:wishId,
                            product:prodId
                        },
                        method:'post',
                        success:((response)=>{
                            location.reload()
                        })
                    })
                })
            }
        }
    })
}

