package in.mayur.foodiesapi.io;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor  // ✅ add this
@AllArgsConstructor
public class OrderItem {
    private String foodId;
    private  int quantity;
    private  double prices;
    private String category;
    private String imageUrl;
    private String description;
    private String name;
}



