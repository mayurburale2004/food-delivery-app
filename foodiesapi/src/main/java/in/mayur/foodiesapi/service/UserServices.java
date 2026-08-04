package in.mayur.foodiesapi.service;

import in.mayur.foodiesapi.io.UserRequest;
import in.mayur.foodiesapi.io.UserResponse;

public interface UserServices {

 UserResponse registerUser(UserRequest request);
 String findByUserId();
}
