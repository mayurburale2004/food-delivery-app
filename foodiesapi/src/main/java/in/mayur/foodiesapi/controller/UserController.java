package in.mayur.foodiesapi.controller;


import in.mayur.foodiesapi.io.UserRequest;
import in.mayur.foodiesapi.io.UserResponse;
import in.mayur.foodiesapi.service.UserServices;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {
    private final UserServices userServices;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request) { // ✅ UserRequest
        return userServices.registerUser(request);


    }


}
