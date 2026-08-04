package in.mayur.foodiesapi.controller;

import org.springframework.security.core.userdetails.UserDetails;
import in.mayur.foodiesapi.io.AuthanticationResponse;
import in.mayur.foodiesapi.io.AuthenticationRequest;
import in.mayur.foodiesapi.service.AppUserDetailsService;
import in.mayur.foodiesapi.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthContoller {
    private  final AuthenticationManager authenticationManager;
    private  final AppUserDetailsService userDetailsService;
    private  final JwtUtil jwtUtil;
    @PostMapping("/login")
    public AuthanticationResponse login (@RequestBody AuthenticationRequest request){
authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
final  UserDetails userDetails =userDetailsService.loadUserByUsername(request.getEmail());
final  String jwtToken =jwtUtil.generateToken(userDetails);
return new AuthanticationResponse(request.getEmail(),jwtToken);

    }
}



