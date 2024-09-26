import React from "react";

const Cards = ({ data }) => {
    const{firstName, lastName} = data

  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{firstName + ' ' + lastName}</h2>

        <div className="card-actions justify-end gap-2">
          <button className="btn btn-primary bg-gray-500">Ignore</button>
          <button className="btn btn-primary bg-pink-500">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
