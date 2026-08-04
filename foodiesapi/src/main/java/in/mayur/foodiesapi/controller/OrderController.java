package in.mayur.foodiesapi.controller;

import com.razorpay.RazorpayException;
import in.mayur.foodiesapi.io.OrderRequest;
import in.mayur.foodiesapi.io.OrderResponse;
import in.mayur.foodiesapi.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {
    private  final OrderService orderService;
    @PostMapping("/create")
    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest request) throws RazorpayException {
     OrderResponse response=  orderService.createOrderWithPayment(request);
     return  response;
    }
    @PostMapping("/verify")
    public void verifyPayment(@RequestBody Map<String, String> paymentData) {
        orderService.verifyPayment(paymentData, "Paid");
    }
    @GetMapping
    public List<OrderResponse> getOrders(){
        return  orderService.getUserOrders();
    }
    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void deleteOrder(@PathVariable String orderId){
orderService.removeOrder(orderId);


    }
    @GetMapping("/all")
    public  List<OrderResponse> getOrdersOfAllUsers(){
        return  orderService.getOrdersOfAllUsers();
    }
@PatchMapping("/status/{orderId}")
    public  void updateOrderStatus(@PathVariable String orderId ,@RequestParam String status){


        orderService.updateOrderStatus(orderId,status);
}

}
