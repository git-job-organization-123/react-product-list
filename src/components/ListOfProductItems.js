import React, { useState, useEffect } from "react";
import "./ListOfProductItems.css";

import { ProductItem } from "./ProductItem.js";
import { getAccommodations } from '../requestHandler.js';

export function ListOfProductItems({ priceSortOrder }) {
  const [productItemsData, setProductItemsData] = useState([]);
  const [sortedProductItemsData, setSortedProductItemsData] = useState([]);

  useEffect(() => {
    getAccommodations().then((accommodations) => setProductItemsData(accommodations));
  }, []);

  useEffect(() => {
    const sortedProductItemsData = [...productItemsData].sort((a, b) => {
      if (priceSortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    setSortedProductItemsData(sortedProductItemsData);
  }, [priceSortOrder, productItemsData]);

  return (
    <div className="container">
      {sortedProductItemsData.map((productItemData, index) => (
        <ProductItem key={index} {...productItemData} />
      ))}
    </div>
  );
}
