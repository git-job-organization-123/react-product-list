import React, { useState } from "react";
import './App.css';

import { ListOfProductItems } from "./components/ListOfProductItems.js";

function App() {
  const [priceSortOrder, setPriceSortOrder] = useState("asc");
  // const [showModal, setShowModal] = useState(false);

  // // Return from bank
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const status = urlParams.get("STATUS");

  //   if (status === "OK") {
  //     setShowModal(true);
  //   }
  // }, []);

  function handlePriceSortOrderChange(e) {
    setPriceSortOrder(e.target.value);
  }

  return (
    <div>
      <div className="select-container">
        <select onChange={handlePriceSortOrderChange}>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <ListOfProductItems priceSortOrder={priceSortOrder} />

      {/* {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h1>Payment successful!</h1>
          <p>Thank you for your purchase.</p>
        </Modal>
      )} */}
    </div>
  );
}

export default App;
