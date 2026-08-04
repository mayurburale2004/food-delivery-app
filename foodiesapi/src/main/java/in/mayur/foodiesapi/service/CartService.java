package in.mayur.foodiesapi.service;

import in.mayur.foodiesapi.io.CartRequest;
import in.mayur.foodiesapi.io.CartResponse;

public interface CartService {
CartResponse addToCart(CartRequest request);
CartResponse getCart();
void clearCart();
CartResponse  removeFromCart(CartRequest cartRequest);
}
