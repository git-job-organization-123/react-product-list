import React, { useState } from "react";
import "./BookingModal.css";

import { book } from '../requestHandler.js';

export function BookingModal({ name, description, price, code, services, closeModal }) {
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
  function onModalOutsideClick(e) {
    // Prevent re-opening the modal
    e.stopPropagation();
    
    closeModal();
  }

  function onModalBoxClick(e) {
    // Prevent the modal from closing when clicking inside the modal
    e.stopPropagation();
  }

  // On clicking the Back button to go to the previous stage
  function onBackClick() {
    let backStage = stage - 1;
    setStage(backStage);
  }

  // On clicking the Next button to go to the next stage
  function onNextClick() {
    let nextStage = stage + 1;
    setStage(nextStage);
  }

  // On selecting a service in stage 2
  function onServiceSelect(service) {
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
            <button onClick={onBackClick} disabled>Back</button>
            <button onClick={onNextClick}>Next</button>
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
                onClick={() => onServiceSelect(service)}
              >
                {service.name} ({service.price} €)
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-footer">
          <div className="stage-buttons">
            <button onClick={onBackClick}>Back</button>
            <button onClick={onNextClick}>Next</button>
          </div>
        </div>
      </>
    );
  }

  // Customer info
  function renderStage3() {
    const onInputChange = (event) => {
      const { name, value } = event.target;
      setCustomer((prevCustomer) => ({ ...prevCustomer, [name]: value }));
    };

    const onCustomerBackClick = (event) => {
      event.preventDefault();
      onBackClick();
    };

    const onCustomerNextClick = (event) => {
      event.preventDefault();

      const errors = validateForm();
      setFormErrors(errors);

      if (Object.keys(errors).length === 0) {
        onNextClick();
      }
    };

    const onBlur = (event) => {
      let error = validateFormInput(event.target.name);
      if (!error) {
        // Remove error message
        error = {[event.target.name]: ''};
      }

      setFormErrors((prevFormErrors) => ({ ...prevFormErrors, ...error }));
    };

    const validateFormInput = (formInputName) => {
      if (formInputName === 'firstName' && !customer.firstName) {
        return {'firstName': 'Please enter your first name'};
      }
      else if (formInputName === 'lastName' && !customer.lastName) {
        return {'lastName': 'Please enter your last name'};
      }
      else if (formInputName === 'email' && !customer.email) {
        return {'email': 'Please enter your email'};
      }
      else if (formInputName === 'email' && !/\S+@\S+.\S+/.test(customer[formInputName])) {
        return {'email': 'Please enter a valid email'};
      }
      else if (formInputName === 'phone' && !customer.phone) {
        return {'phone': 'Please enter your phone number'};
      }
      else if (formInputName === 'phone' && !/^\d{10}$/.test(customer[formInputName])) {
        return {'phone': 'Please enter a valid 10-digit phone number'};
      }

      return null;
    };

    const validateForm = () => {
      const errors = {};

      Object.assign(errors, validateFormInput('firstName'));
      Object.assign(errors, validateFormInput('lastName'));
      Object.assign(errors, validateFormInput('email'));
      Object.assign(errors, validateFormInput('phone'));

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
                    onChange={onInputChange}
                    onBlur={onBlur}
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
                    onChange={onInputChange}
                    onBlur={onBlur}
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
                    onChange={onInputChange}
                    onBlur={onBlur}
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
                    onChange={onInputChange}
                    onBlur={onBlur}
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
            <button onClick={onCustomerBackClick}>Back</button>
            <button onClick={onCustomerNextClick}>Next</button>
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
            <button onClick={onBackClick}>Back</button>
            <button onClick={onBookClick}>Book now</button>
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

  function onBookClick() {
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
    <div className="modal" onClick={onModalOutsideClick}>
      <div className="modal-box" onClick={onModalBoxClick}>
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
