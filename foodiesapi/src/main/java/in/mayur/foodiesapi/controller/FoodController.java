package in.mayur.foodiesapi.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.mayur.foodiesapi.io.FoodRequest;
import in.mayur.foodiesapi.io.FoodResponse;
import in.mayur.foodiesapi.service.FoodService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/foods")

@AllArgsConstructor
public class FoodController {
    private final FoodService foodService;
    @GetMapping
    public List<FoodResponse> getFoods() {
        return foodService.getFoods();
    }
    @PostMapping
    public FoodResponse addFood(@RequestPart("foods") String foodString, @RequestPart("file")MultipartFile file){
        ObjectMapper objectMapper = new ObjectMapper();
        FoodRequest request=null;
        try {
     request =objectMapper.readValue(foodString ,FoodRequest.class);
        }  catch (JsonProcessingException ex){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid JSON format");
        }
       FoodResponse response= foodService.addFood(request,file);
        return response;
    }
    @GetMapping("/{id}")
    public  FoodResponse getFood(@PathVariable String id){
    return     foodService.getFood(id);

    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
public  void deleteFood(@PathVariable String id){
        foodService.deleteFood(id);

}
}
