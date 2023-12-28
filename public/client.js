console.log("Client-side code running");

const button = document.getElementById("myButton");
button.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("button was clicked");
  console.log(document.getElementById("counter").innerHTML);
  fetch("/clicked?count=" + document.getElementById("counter").innerHTML)
    .then(function (response) {
      if (response.ok) return response.json();
      throw new Error("Request failed.");
    })
    .then(function (data) {
      document.getElementById("counter").innerHTML = `${data}`;
    })
    .catch(function (error) {
      console.log(error);
    });
});

// setInterval(function() {
//   fetch('/clicks?count='+document.getElementById('counter').innerHTML, {method: 'GET'})
//     .then(function(response) {
//       if(response.ok) return response.json();
//       throw new Error('Request failed.');
//     })
//     .then(function(data) {
//       document.getElementById('counter').innerHTML = `${data}`;
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// }, 1000);
gsap.set(".box", { backgroundColor: "red", width: 100, height: 100 });

gsap.to(".box", { rotation: 27, x: 100, duration: 1 });
