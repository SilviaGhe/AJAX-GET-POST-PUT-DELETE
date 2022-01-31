console.log("Week 9");

// render initial users
getUsers();

// update list every second
setInterval(getUsers, 500);

// get user data from server
function getUsers() {
  // by default the fetch function will generate the server request with the method 'GET'
  fetch("https://contact-agenda-rest-api.herokuapp.com/users")
    .then(processResponse)
    .then(renderUsers);
}

function processResponse(response) {
  return response.json();
}

function renderUsers(data) {
  // before starting to render every user data we should clean up the users list container
  document.getElementById("entries").innerHTML = "";

  for (const user of data) {
    renderListItem(user);
  }
}



// set a sentinel value to mark that clicked or not clicked Update button
let updated = 0;

let sendButton = document.getElementById("send").innerText;




  // add new user event
  document.getElementById("send").addEventListener("click", sendNewUser);
  console.log('clicked SEND');




function renderListItem(userData) {
  const li = document.createElement("li");
  
  //li.innerText = `${userData.first_name} ${userData.last_name} ${userData.mobile_number} ${userData.street_name_value} ${userData.street_number_value} ${userData.city_value} ${userData.country_value}`;
  
  //li.innerText = `${userData.first_name} ${userData.last_name} ${userData.mobile_number} ${userData.street_name_value} ${userData.street_number_value} ${userData.city_value} ${userData.country_value}`;
  if(userData.first_name || userData.last_name)
    li.innerHTML += `<img src=profile.png  width='20' height='20'> <span class="class_first_name_ol">${userData.first_name}</span> <span class="class_last_name_ol">${userData.last_name}</span>`;
  //`<li><a href="#">Item ${list.children.length + 1}</a></li>`;
  
  if(userData.mobile_number)
    li.innerHTML += `<br><img src=smartphone.png  width='20' height='20'> <span class="class_mobile_number_ol">${userData.mobile_number}</span>`;

  // Address
  if(userData.street_name_value || userData.street_number_value || userData.city_value || userData.country_value)
    li.innerHTML += `<br><img src=address.png  width='20' height='20'> <span class="class_street_name_value_ol">${userData.street_name_value}</span>    <span class="class_street_number_value_ol">${userData.street_number_value}</span>    <span class="class_city_value_ol">${userData.city_value}</span>    <span class="class_country_value_ol">${userData.country_value}</span>`;


  li.style.border = "thick solid #000000";
  //li.style.borderColor ='black';

  const ol = document.getElementById("entries");
  

  ol.appendChild(li);

  // create a span element for the purpose of editing the current element
  const editElement = document.createElement("span");
  editElement.innerHTML = "  <img src=edit.png  width='20' height='20' margin-down=0> ";
  li.appendChild(editElement);
  // create a span element for the purpose of deleting the current element
  const deleteElement = document.createElement("span");
  deleteElement.innerHTML = "  <img src=remove.png  width='20' height='20' margin-down=0> ";
  li.appendChild(deleteElement);

  // delete user event
  // we need to declare an anonymous function and pass it as the second parameter so that we have access to the 'userData'
  deleteElement.addEventListener("click", function () {
    deleteUser(userData.id);
  });
  // edit user event
  editElement.addEventListener("click", function () {
    editUser(userData);
  });


  if(updated===0)
    document.getElementById("send").innerText = 'Send' ;
  else 
    document.getElementById("send").innerText = 'Update' ;

}

// delete element server call
function deleteUser(userId) {
  // in order for deletion to happened we need for the url to contain the id of the element we want to delete
  // we need to make sure that fetch is sending a server call with a server request that has the method type 'DELETE'
  fetch("https://contact-agenda-rest-api.herokuapp.com/users/" + userId, {
    method: "DELETE",
  });
}


// edit element server call
function editUser(userData) {
  console.log(userData);
  // should take what is in the list  in the associated inboxes
  document.getElementById("first_name").value = userData.first_name;
  document.getElementById("last_name").value = userData.last_name;
  document.getElementById("mobile_number").value = userData.mobile_number;
  document.getElementById("street_name_value").value = userData.street_name_value;
  document.getElementById("street_number_value").value = userData.street_number_value;
  document.getElementById("city_value").value = userData.city_value;
  document.getElementById("country_value").value = userData.country_value ;


  document.getElementById("send").innerText = 'Update' ;
  updated = 1;


  // we update on server
  document.getElementById("send").addEventListener("click", function () {
    updateUser(userData.id);
  });

 
  }



// add new user server call
function sendNewUser() {
  if(updated===0){
    // before we can add a user we need to form the data that we need to store
    // we use the values in the inputs to generate the final object that will be the payload for the server call
    const newUser = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      mobile_number: document.getElementById("mobile_number").value,

      street_name_value: document.getElementById("street_name_value").value,
      street_number_value: document.getElementById("street_number_value").value,
      city_value: document.getElementById("city_value").value,
      country_value: document.getElementById("country_value").value,
    };

    // because we send data to a server that accepts JSON formatting we need to set the server request header attributes accordingly
    // because we want to create a new entity/user on the server data base, it is a standard to make the sever request with has the method type 'POST'
    fetch("https://contact-agenda-rest-api.herokuapp.com/users", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      // on the http protocol we can send only text
      // in order to send the javascript object 'newUser' we have to transform it into a string
      // we can use 'JSON' utility to transform from any javascript data type to a string but keeping its structure in the string format
      body: JSON.stringify(newUser),
    })
      .then(processResponse)
      .then(renderListItem);


      document.getElementById("first_name").value = "";
      document.getElementById("last_name").value = "";
      document.getElementById("mobile_number").value = "";
      document.getElementById("street_name_value").value = "";
      document.getElementById("street_number_value").value = "";
      document.getElementById("city_value").value = "";
      document.getElementById("country_value").value = "";

  }
}




function updateUser(userId) {
    if(updated===1){
    
    const userToUpdate = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      mobile_number: document.getElementById("mobile_number").value,

      street_name_value: document.getElementById("street_name_value").value,
      street_number_value: document.getElementById("street_number_value").value,
      city_value: document.getElementById("city_value").value,
      country_value: document.getElementById("country_value").value,
    };

     fetch("https://contact-agenda-rest-api.herokuapp.com/users/" + userId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
       body: JSON.stringify(userToUpdate),
    })
      .then(processResponse)
      .then(renderListItem);

      updated=0;



  

  document.getElementById("first_name").value = "";
  document.getElementById("last_name").value = "";
  document.getElementById("mobile_number").value = "";
  document.getElementById("street_name_value").value = "";
  document.getElementById("street_number_value").value = "";
  document.getElementById("city_value").value = "";
  document.getElementById("country_value").value = "";
  }
}
