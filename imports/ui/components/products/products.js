import Products from '/imports/api/products/products.js';
import './product.html';

Template.products.helpers({
  products() {
    return Products.find({});
  }
})

Template.products.events({
  'click .addToCart': (event) => {
    const itemId = event.target.id;
    const item = Products.find(itemId).fetch()[0];
    if(Meteor.userId()){
      Meteor.call('addToCart', item, function(err, res) {
        if(err) {
          console.log(err);
        }
        else{
          console.log(res);
        }
      });
    }else {
      addToCartAnonymous(item);
    }
  }
});


addToCartAnonymous = function(item) {
  // Check the user is Anonymous
  if(Meteor.userId()) {
    return;
  }
  //A user should always have a cart.
  var userCart = JSON.parse(window.localStorage.getItem("userCart")) || [];
  if(!userCart){
    window.localStorage.setItem("userCart", JSON.Stringify(userCart));
  }

  // TODO: Check the product/pack exists

  // Check for duplication & Increment quantity
  var duplication = _.find(userCart, function(elm) {
    if(elm.ref === item._id){
      if(elm.quantity > 9){
        return true;
      }
      elm.quantity++;
      return true;
    }
  });

  if(!duplication) {
    userCart.push({ref: item._id, item: item, quantity: 1});
  }

  //Save cart.
  window.localStorage.setItem("userCart", JSON.stringify(userCart));
}
