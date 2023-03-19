import React, { useState } from "react";
import "./ProductItem.css";

import { BookingModal } from "./BookingModal.js";

export function ProductItem({ imageSrc, name, description, price, code, services }) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleModalNextClick = () => {
    // Do nothing
  };

  return (
    <div className="box" onClick={openModal}>
      <div className="image-row">
        <img src={imageSrc} alt="Imaget" />
      </div>
      <div className="title-row">
        <h2 className="title">{name}</h2>
      </div>
      <div className="description-row">
        <span className="description">{description}</span>
      </div>
      <div className="price-row">
        <span className="price">{price} €</span>
      </div>
      {showModal && (
        <BookingModal
          name={name}
          description={description}
          price={price}
          code={code}
          services={services} 
          closeModal={closeModal}
          onNextClick={handleModalNextClick}
        />
      )}
    </div>
  );
}
