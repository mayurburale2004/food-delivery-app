import React, { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';

const ExploreFood = () => {
 const [category ,setCategory] =useState('All');

 const [search ,setSearch] =useState('');

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={(e)=> e.preventDefault()}>
            <div className="input-group mb-3">

              <select
                className="form-select mt-2"
                style={{ maxWidth: '150px' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                  <option value="All">All</option>
                <option value="Dosa">Dosa</option>
                <option value="Burger">Burger</option>
                <option value="Cake">Cakes</option>
                <option value="Ice cream">Ice Cream</option>
                <option value="Pizza">Pizza</option>
                <option value="Rolls">Roll</option>
                <option value="Salad">Salad</option>
                <option value="Paratha">Paratha</option>
                <option value="Poha">Poha</option>
              </select>

              <input
                type="text"
                className="form-control mt-2"
                placeholder="Search your favorite dish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button className="btn btn-primary mt-2" type="submit">
                <i className="bi bi-search"></i>
              </button>

            </div>
          </form>
        </div>
      </div>

      <FoodDisplay category={category} search={search} />
    </div>
  );
};

export default ExploreFood;