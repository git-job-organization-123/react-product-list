import React, { useState } from "react";
import "./BookingModal.css";

import { book } from '../requestHandler.js';

export function BookingModal({ name, description, price, code, services, closeModal, onNextClick }) {
  const [stage, setStage] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formErrors, setFormErrors] = useState({});
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
      
      const errors = validateForm();
      setFormErrors(errors);

      if (Object.keys(errors).length === 0) {
        handleNextClick();
      }
    };

    const validateForm = () => {
      const errors = {};
      if (!customer.firstName) {
        errors.firstName = 'Please enter your first name';
      }
      if (!customer.lastName) {
        errors.lastName = 'Please enter your last name';
      }
      if (!customer.email) {
        errors.email = 'Please enter your email';
      } else if (!/\S+@\S+.\S+/.test(customer.email)) {
        errors.email = 'Please enter a valid email';
      }
      if (!customer.phone) {
        errors.phone = 'Please enter your phone number';
      } else if (!/^\d{10}$/.test(customer.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number';
      }
      return errors;
    };

    return (
      <>
        <div className="modal-content">
          <div className="customer-form">
            <form>
              <fieldset>
              <legend>Customer</legend>
                <label>
                  First name *
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={customer.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.firstName && (
                    <span className="error">{formErrors.firstName}</span>
                  )}
                </label>
                <label>
                  Last name *
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={customer.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.lastName && (
                    <span className="error">{formErrors.lastName}</span>
                  )}
                </label>
                <label>
                  Email *
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.email && (
                    <span className="error">{formErrors.email}</span>
                  )}
                </label>
                <label>
                  Phone number *
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.phone && (
                    <span className="error">{formErrors.phone}</span>
                  )}
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
