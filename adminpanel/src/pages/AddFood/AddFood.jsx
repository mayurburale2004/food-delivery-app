// import React, { useState } from "react";
// import { assets } from "../../assets/assets";
// import axios from "axios";
// import { addfood } from "../../services/foodService";
// import { toast } from "react-toastify";
// const AddFood = () => {
//   const [image, setImage] = useState(false);

//   const [data, setData] = useState({
//     name: "",
//     description: "",
//     prices: "",
//     category: "Poha",
//   });
//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData((data) => ({ ...data, [name]: value }));
//   };
// const onSubmitHandler = async(event)=>{
//   event.preventDefault();
//   if(!image){
//     toast.error('please select an image.');
//     return ;

//   }
//   const formData = new FormData();
//   formData.append('food',JSON.stringify(data));
//   formData.append('file',image);
// try {
// const response= await axios.post('http://localhost:8080/api/foods',formData,{headers:{"Content-Type":"multipart/form-data"}});
// if   (response.status === 200 || response.status === 201) {
//  toast.success('Food added successfully');
//   setData({ name: "",
//     description: "",
//     prices: "",
//     category: "Poha",});
//     setImage(null);
// }

// } catch (error) {
//   console.log("error"+error);
//    toast.error('Error adding food');

  
// }



// }
 
//   return (
//     <div className="mx-2 mt-2 ">
//       <div className="row ">
//         <div className="card col-md-4">
//           <div className="card-body">
//             <h2 className="mb-4">Add Food</h2>
//             <form onSubmit={onSubmitHandler}>
//               <div className="mb-3">
//                 <label htmlFor="image" className="form-label">
//                   <img
//                     src={image ? URL.createObjectURL(image) : assets.upload}
//                     alt=""
//                     width={90}
//                   />
//                 </label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   id="image"
                  
//                   hidden
//                   name="image"
//                   onChange={(e) => setImage(e.target.files[0])}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="name" className="form-label">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="name"
//                   required
//                   name="name"
//                   placeholder="Dosa"
//                   onChange={onChangeHandler}
//                   value={data.name}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="category" className="form-label">
//                   Category
//                 </label>
//                 <select
//                   className="form-control"
//                   id="category"
//                   required
//                   name="category"
//                   onChange={onChangeHandler}
//                   value={data.category}
//                 >
//                   <option value="Poha">Poha</option>
//                   <option value="Cake">Cake</option>
//                   <option value="Burger">Burger</option>
//                   <option value="Dosa">Dosa</option>
//                   <option value="Pizza">Pizza</option>
//                   <option value="Rolls">Rolls</option>
//                   <option value="Salad">Salad</option>
//                   <option value="Paratha">Paratha</option>
//                   <option value="Ice cream">Ice cream</option>
//                 </select>
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="prices" className="form-label">
//                   prices
//                 </label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   id="prices"
//                   required
//                   placeholder="&#8377;200"
//                   name="prices"
//                   onChange={onChangeHandler}
//                   value={data.prices}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="description" className="form-label">
//                   Description
//                 </label>
//                 <textarea
//                   className="form-control"
//                   id="description"
//                   rows="5"
//                   required
//                   placeholder="Write content here..."
//                   name="description"
//                   onChange={onChangeHandler}
//                   value={data.description}
//                 ></textarea>
//               </div>

//               <button type="submit" className="btn btn-primary">
//                 Save
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddFood;
import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { addfood } from "../../services/foodService"; // ✅ use service, remove axios import
import { toast } from "react-toastify";

const AddFood = () => {
  const [image, setImage] = useState(null); // ✅ null instead of false

  const [data, setData] = useState({
    name: "",
    description: "",
    prices: "",
    category: "Poha",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error('Please select an image.');
      return;
    }

    try {
      const response = await addfood(data, image); // ✅ use service function
      if (response.status === 200 || response.status === 201) {
        toast.success('Food added successfully');
        setData({ name: "", description: "", prices: "", category: "Poha" });
        setImage(null);
      }
    } catch (error) {
      console.log("error", error);
      toast.error('Error adding food');
    }
  };

  return (
    <div className="mx-2 mt-2">
      <div className="row">
        <div className="card col-md-4">
          <div className="card-body">
            <h2 className="mb-4">Add Food</h2>
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  <img
                    src={image ? URL.createObjectURL(image) : assets.upload}
                    alt=""
                    width={90}
                  />
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  hidden
                  name="image"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  name="name"
                  placeholder="Dosa"
                  onChange={onChangeHandler}
                  value={data.name}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  className="form-control"
                  id="category"
                  required
                  name="category"
                  onChange={onChangeHandler}
                  value={data.category}
                >
                  <option value="Poha">Poha</option>
                  <option value="Cake">Cake</option>
                  <option value="Burger">Burger</option>
                  <option value="Dosa">Dosa</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Salad">Salad</option>
                  <option value="Paratha">Paratha</option>
                  <option value="Ice cream">Ice cream</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="prices" className="form-label">Prices</label>
                <input
                  type="number"
                  className="form-control"
                  id="prices"
                  required
                  placeholder="₹200"
                  name="prices"
                  onChange={onChangeHandler}
                  value={data.prices}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="5"
                  required
                  placeholder="Write content here..."
                  name="description"
                  onChange={onChangeHandler}
                  value={data.description}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;