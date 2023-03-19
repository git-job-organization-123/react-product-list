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

export function getAccommodations() {
  return fetchPOST('http://localhost:8080/BookingService/api/accommodations', null);
}

export function book(booking) {
  return fetchPOST('http://localhost:8080/BookingService/api/booking', booking);
}
