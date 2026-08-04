package in.mayur.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodResponse {

private String id;

    private String name;
    private String description;
    private String imageUrl;
    private double prices;
    private String category;
}
