import React, { useState, useEffect } from "react";
import './App.css';

function fetchPOST(endpoint, body) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        resolve(JSON.parse(this.responseText));
      }
    };

    xhr.send(JSON.stringify(body));
  });
}

function getAccommodations() {
  return fetchPOST('http://localhost:8080/BookingService/api/accommodations', null);
}

function book(booking) {
  return fetchPOST('http://localhost:8080/BookingService/api/booking', booking);
}

function ProductItem({ imageSrc, name, description, price, code, services }) {
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
        <img src={imageSrc} alt="Image" />
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

function ListOfProductItems({ priceSortOrder }) {
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

function BookingModal({ name, description, price, code, services, closeModal, onNextClick }) {
  const [stage, setStage] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Close modal on clicking the gray area outside of the modal
  function handleModalOutsideClick(e) {
    // Prevent re-opening the modal
    e.stopPropagation();
    
    closeModal();
  }

  function handleModalBoxClick(e) {
    // Prevent the modal from closing when clicking inside the modal
    e.stopPropagation();
  }

  // Handle clicking the Back button to go to the previous stage
  function handleBackClick() {
    let backStage = stage - 1;
    setStage(backStage);
  }

  // Handle clicking the Next button to go to the next stage
  function handleNextClick() {
    let nextStage = stage + 1;
    setStage(nextStage);
    onNextClick(selectedServices);
  }

  // Handle selecting a service in stage 2
  function handleServiceSelect(service) {
    const serviceIndex = selectedServices.indexOf(service);
    if (serviceIndex === -1) {
      setSelectedServices([...selectedServices, service]);
    } else {
      const newServices = [...selectedServices];
      newServices.splice(serviceIndex, 1);
      setSelectedServices(newServices);
    }
  }

  // Product details
  function renderStage1() {
    return (
      <>
        <div className="modal-content">
          <h2>{name}</h2>
          <p className="description">{description}</p>
          <p className="price">{price} €</p>
        </div>
        <div className="modal-footer">
          <div className="stage-buttons">
            <button onClick={handleBackClick} disabled>Back</button>
            <button onClick={handleNextClick}>Next</button>
          </div>
        </div>
      </>
    );
  }

  // Select extra services
  function renderStage2() {
    return (
      <>
        <div className="modal-content">
          <h2>Select extra services</h2>
          <ul className="services-list">
            {services.map((service) => (
              <li
                key={service.id}
                className={selectedServices.includes(service) ? "selected" : ""}
                onClick={() => handleServiceSelect(service)}
              >
                {service.name} ({service.price} €)
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-footer">
          <div className="stage-buttons">
            <button onClick={handleBackClick}>Back</button>
            <button onClick={handleNextClick}>Next</button>
          </div>
        </div>
      </>
    );
  }

  // Customer info
  function renderStage3() {
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setCustomer((prevCustomer) => ({ ...prevCustomer, [name]: value }));
    };

    const handleCustomerBackClick = (event) => {
      event.preventDefault();
      handleBackClick();
    };

    const handleCustomerNextClick = (event) => {
      event.preventDefault();
      // Add validation here
      handleNextClick();
    };

    return (
      <>
        <div className="modal-content">
          <div className="customer-form">
            <form>
              <fieldset>
                <legend>Customer</legend>
                <label>First name
                  <input type="text" id="firstName" name="firstName" value={customer.firstName} onChange={handleInputChange}/>
                </label>

                <label>Last name
                  <input type="text" id="lastName" name="lastName" value={customer.lastName} onChange={handleInputChange}/>
                </label>

                <label>Email
                  <input type="email" id="email" name="email" value={customer.email} onChange={handleInputChange}/>
                </label>

                <label>Phone
                  <input type="tel" id="phone" name="phone" value={customer.phone} onChange={handleInputChange}/>
                </label>
              </fieldset>
            </form>
          </div>
        </div>
        <div className="modal-footer">
          <div className="stage-buttons">
            <button onClick={handleCustomerBackClick}>Back</button>
            <button onClick={handleCustomerNextClick}>Next</button>
          </div>
        </div>
      </>
    );
  }

  // Booking summary
  function renderStage4() {
    const totalExtraServicePrice = selectedServices.reduce((total, service) => total + service.price, 0);
    const totalPrice = price + totalExtraServicePrice;

    return (
      <>
        <div className="modal-content">
          <h2>Summary</h2>
          <p>{name}</p>
          <p>Base price: {price} €</p>
          {selectedServices.length > 0 && (
            <>
              <p>Selected services:</p>
              <ul>
                {selectedServices.map((service) => (
                  <li key={service.id}>
                    {service.name} ({service.price} €)
                  </li>
                ))}
              </ul>
              <p>Total extra services: {totalExtraServicePrice} €</p>
            </>
          )}

          {customer.firstName && (
            <div>
              <h2>Customer Info</h2>
              <p>First Name: {customer.firstName}</p>
              <p>Last Name: {customer.lastName}</p>
              <p>Email: {customer.email}</p>
              <p>Phone: {customer.phone}</p>
            </div>
          )}

          <p>Total price: {totalPrice} €</p>
        </div>
        <div className="modal-footer">
          <div className="stage-buttons">
            <button onClick={handleBackClick}>Back</button>
            <button onClick={handleBookClick}>Book now</button>
          </div>
        </div>
      </>
    );
  }

  // Products to book
  function getProducts() {
    const serviceItems = selectedServices.map((service) => {
      return {
        "name": service.name,
        "code": service.code,
      }
    });

    // Put this product first
    return [{
      "name": name,
      "code": code,
    }].concat(serviceItems);
  }

  function handleBookClick() {
    const totalExtraServicePrice = selectedServices.reduce((total, service) => total + service.price, 0);
    const totalPrice = price + totalExtraServicePrice;

    const products = getProducts();
    // const passengers = getPassengers();

    // Book the booking
    book({
      "products": products,
      // "passengers": passengers
      "customer": customer
    }).then((response) => {
      alert(JSON.stringify(response));
    });
  }

  return (
    <div className="modal" onClick={handleModalOutsideClick}>
      <div className="modal-box" onClick={handleModalBoxClick}>
        <div className="modal-header">
          <span onClick={closeModal} className="close">
            &times;
          </span>
        </div>
        {stage === 1 && renderStage1()}
        {stage === 2 && renderStage2()}
        {stage === 3 && renderStage3()}
        {stage === 4 && renderStage4()}
      </div>
    </div>
  );
}

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
