const updateQty = async (qty, prodId, event) => {
    const prodDets = {
        qty: qty,
        prodId: prodId,
    };

    const response = await fetch("/updateCart", {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(prodDets),
    });

    if(response.ok) {
        const data = await response.json();
        event.target.parentElement.children[1].innerHTML = data.updateQty ;
    } else {
        alert(response.statusText);
    }
};

const deleteProduct = async (e) => {
    e.preventDefault();
    let prodId = e.target.ProductID.value ;
    console.log(prodId);

    const response = await fetch(`/delete-item-in-cart/${prodId}`, {
        method: "DELETE",
    });

    if(response.ok) {
    const request = new XMLHttpRequest();
    request.open("GET", "/cart");

    request.onload = () => {
        // console.log(request.responseText.split("<main>")[1]);
        document.querySelector("main").innerHTML = 
        request.responseText.split("<main>")[1] ;

    };
    request.send();
} else {
    alert(response.statusText);
}

};