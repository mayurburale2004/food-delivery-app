package in.mayur.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@NoArgsConstructor  // ✅ add this
@AllArgsConstructor
public class OrderRequest {

    private List<OrderItem> orderItems;
    private String userAddress;
    private double amount;
    private String email;
    private  String phoneNumber;
    private  String orderStatus;
}
