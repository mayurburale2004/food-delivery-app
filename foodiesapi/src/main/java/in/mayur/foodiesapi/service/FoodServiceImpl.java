//package in.mayur.foodiesapi.service;
//
//import in.mayur.foodiesapi.entity.FoodEntity;
//import in.mayur.foodiesapi.io.FoodRequest;
//import in.mayur.foodiesapi.io.FoodResponse;
//import in.mayur.foodiesapi.repository.FoodRepository;
//
//import lombok.NoArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//import org.springframework.web.server.ResponseStatusException;
//import software.amazon.awssdk.core.sync.RequestBody;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;
//import software.amazon.awssdk.services.s3.model.PutObjectResponse;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//@Service
//
//public class FoodServiceImpl implements FoodService {
//    @Autowired
//   private   S3Client s3Client;
//    @Autowired
//private  FoodRepository foodRepository ;
//    @Value("${aws.s3.bucketname}")
//    private String bucketName;
//    @Override
//    public String uploadFile(MultipartFile file) {
//    String filenameExtension=    file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
//     String key=   UUID.randomUUID().toString()+"."+filenameExtension;
//     try{
//         PutObjectRequest putObjectRequest =PutObjectRequest.builder().
//                 bucket(bucketName)
//                 .key(key)
//                 .acl("public-read")
//                 .contentType(file.getContentType())
//                 .build();
//         PutObjectResponse response =s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
//         if(response.sdkHttpResponse().isSuccessful()){
//             return "https://"+bucketName+".s3.amazonaws.com/"+key;
//         }
//         else{
//             throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"File uploading failed");
//         }
//     }catch (IOException ex){
// throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occured while uploading the file");
//
//     }
//
//    }
//
//    @Override
//    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
//        FoodEntity newFoodEntity = convertToEntity(request);
//        String imageUrl = uploadFile(file);
//        newFoodEntity.setImageUrl(imageUrl);
//        newFoodEntity = foodRepository.save(newFoodEntity);
//return convertToResponse((newFoodEntity));
//
//    }
//    private FoodEntity convertToEntity(FoodRequest request) {
//        return FoodEntity.builder()
//                .name(request.getName())
//                .description(request.getDescription())
//                .category(request.getCategory())
//                .prices(request.getPrices())
//
//                .build();
//    }
//    private FoodResponse convertToResponse (FoodEntity entity){
//     return    FoodResponse.builder()
//                .id(entity.getId())
//                .name(entity.getName())
//                .description(entity.getDescription())
//                .category(entity.getCategory())
//                .prices(entity.getPrices())
//                .imageUrl(entity.getImageUrl())
//                .build();
//
//    }
//    @Override
//    public List<FoodResponse> getFoods() {
//        return foodRepository.findAll()
//                .stream()
//                .map(this::convertToResponse)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public FoodResponse getFood(String id) {
//    FoodEntity existingFood=    foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found " +
//            "for the id: "+id));
//        return   convertToResponse(existingFood);
//
//    }
//
//    @Override
//    public boolean deleteFile(String filename) {
//        DeleteObjectRequest deleteObjectRequest =DeleteObjectRequest.builder()
//                .bucket(bucketName)
//                .key(filename)
//                .build();
//        s3Client.deleteObject(deleteObjectRequest);
//        return true;
//    }
//
//    @Override
//    public void deleteFood(String id) {
//        FoodResponse response= getFood(id);
//      String imageurl=  response.getImageUrl();
//  String filename=    imageurl.substring(imageurl.lastIndexOf("/")+1);
// boolean isFileDelete= deleteFile(filename);
// if(isFileDelete){
//     foodRepository.deleteById(response.getId());
// }
//
//}
//}
package in.mayur.foodiesapi.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import in.mayur.foodiesapi.entity.FoodEntity;
import in.mayur.foodiesapi.io.FoodRequest;
import in.mayur.foodiesapi.io.FoodResponse;
import in.mayur.foodiesapi.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private FoodRepository foodRepository;

    // ✅ Upload image to Cloudinary, returns secure URL
    @Override
    public String uploadFile(MultipartFile file) {
        try {
            Map result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "foodies") // saved inside "foodies" folder in Cloudinary
            );
            return result.get("secure_url").toString();
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Image upload failed");
        }
    }


    @Override
    public boolean deleteFile(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Image deletion failed");
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        FoodEntity newFoodEntity = convertToEntity(request);
        String imageUrl = uploadFile(file);
        newFoodEntity.setImageUrl(imageUrl);
        newFoodEntity = foodRepository.save(newFoodEntity);
        return convertToResponse(newFoodEntity);
    }

    @Override
    public List<FoodResponse> getFoods() {
        return foodRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FoodResponse getFood(String id) {
        FoodEntity existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found for the id: " + id));
        return convertToResponse(existingFood);
    }

    @Override
    public void deleteFood(String id) {
        FoodResponse response = getFood(id);
        String imageUrl = response.getImageUrl();


        String publicId = extractPublicId(imageUrl);

        boolean isFileDeleted = deleteFile(publicId);
        if (isFileDeleted) {
            foodRepository.deleteById(response.getId());
        }
    }

    // ✅ Extracts public_id from Cloudinary URL
    private String extractPublicId(String imageUrl) {
        // Remove file extension
        String withoutExtension = imageUrl.substring(0, imageUrl.lastIndexOf("."));
        // Everything after "/upload/"
        String afterUpload = withoutExtension.substring(withoutExtension.indexOf("/upload/") + 8);
        // Remove version segment if present (e.g., "v1234567/")
        if (afterUpload.matches("v\\d+/.*")) {
            afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);
        }
        return afterUpload; // e.g., "foodies/my-image"
    }

    private FoodEntity convertToEntity(FoodRequest request) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .prices(request.getPrices())
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity entity) {
        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .prices(entity.getPrices())
                .imageUrl(entity.getImageUrl())
                .build();
    }
}