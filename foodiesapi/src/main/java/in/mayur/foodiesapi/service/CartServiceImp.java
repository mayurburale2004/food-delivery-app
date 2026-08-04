package in.mayur.foodiesapi.service;


import in.mayur.foodiesapi.entity.CartEntity;
import in.mayur.foodiesapi.io.CartRequest;
import in.mayur.foodiesapi.io.CartResponse;
import in.mayur.foodiesapi.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor

public class CartServiceImp implements CartService {
    private  final CartRepository cartRepository;
    private final UserServices userServices;
    @Override
    public CartResponse addToCart(CartRequest request) {
String loggedInUserId=userServices.findByUserId();
Optional<CartEntity>cartOptional=cartRepository.findByUserId(loggedInUserId);
CartEntity cart=cartOptional.orElseGet(()-> new CartEntity(loggedInUserId, new HashMap<>()));
Map<String ,Integer>cartItems=cart.getItems();
cartItems.put(request.getFoodId(),cartItems.getOrDefault(request.getFoodId(),0)+1);
cart.setItems(cartItems);
cart=cartRepository.save(cart);
return  convertToResponse(cart);


    }

    @Override
    public CartResponse getCart() {
        String loggedInUserId=userServices.findByUserId();
     CartEntity entity=   cartRepository.findByUserId(loggedInUserId)
                .orElse(new CartEntity(null,loggedInUserId,new HashMap<>()));
        return  convertToResponse(entity);
    }

    @Override
    public void clearCart() {
        String loggedInUserId=userServices.findByUserId();
        cartRepository.deleteByUserId(loggedInUserId);

    }

    @Override
    public CartResponse removeFromCart(CartRequest cartRequest) {
        String loggedInUserId=userServices.findByUserId();
    CartEntity entity= cartRepository.findByUserId(loggedInUserId)
             .orElseThrow(()-> new RuntimeException("Cart not found"));
    Map<String,Integer> cartItems=entity.getItems();
    if (cartItems.containsKey(cartRequest.getFoodId())){
       int currentqty= cartItems.get(cartRequest.getFoodId());
       if (currentqty>0){
           cartItems.put(cartRequest.getFoodId(),currentqty-1);
       }
       else {
           cartItems.remove(cartRequest.getFoodId());
       }
    entity=   cartRepository.save(entity);

    }
        return    convertToResponse(entity);
    }

    private CartResponse convertToResponse(CartEntity cartEntity){
     return    CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();

    }
}
