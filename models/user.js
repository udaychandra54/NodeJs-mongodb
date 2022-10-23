const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save() {
    let db = getDb();
    return db.collection("users").insertOne(this);
  }
  // add single product

  // addToCart(product) {
  //   const updatedCart = { items: [{ productId: product._id, quantity: 1 }] };
  //   let db = getDb();
  //   return db
  //     .collection("users")
  //     .updateOne(
  //       { _id: new mongodb.ObjectId(this._id) },
  //       { $set: { cart: updatedCart } }
  //     );
  // }
  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = { items: updatedCartItems };
    let db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }
  static findById(userId) {
    let db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
