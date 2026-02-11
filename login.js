const urlBase = 'http://msilvacop4331.site/smallproj'; 
const extension = 'php';

function doLogin() {
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    let resultDiv = document.getElementById("loginResult");

    let jsonPayload = JSON.stringify({ login: login, password: password });

    let url = 'API/loginAPI.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.id <= 0) {
                    resultDiv.innerHTML = "User/Password combination incorrect";
                } else {
                    // SUCCESS: Save the ID and redirect to your teammate's page
                    saveCookie("firstName", jsonObject.firstName, "");
                    saveCookie("lastName", jsonObject.lastName, "");
                    saveCookie("userId", jsonObject.id, "");
                    
                    // CRITICAL: Ensure this matches your teammate's file name exactly!
                    window.location.href = "contactmanager.html"; 
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        resultDiv.innerHTML = err.message;
    }
}

function doRegister() {
    let fName = document.getElementById("regFirstName").value;
    let lName = document.getElementById("regLastName").value;
    let login = document.getElementById("regLogin").value;
    let password = document.getElementById("regPassword").value;
    let resultDiv = document.getElementById("registerResult");

    let jsonPayload = JSON.stringify({ firstName: fName, lastName: lName, login: login, password: password });
    
    let url = 'API/registerAPI.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // If your API returns an error string in the JSON
                let jsonObject = JSON.parse(xhr.responseText);
                
                // Adjust this check based on how your API guy wrote the error return
                if(jsonObject.error && jsonObject.error.length > 0){
                    resultDiv.innerHTML = jsonObject.error;
                } else {
                    resultDiv.innerHTML = "Account created! Please log in.";
                    setTimeout(() => { showLogin(); }, 2000);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        resultDiv.innerHTML = err.message;
    }
}

// UI & Cookie Functions stay the same
function showRegister() {
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("registerDiv").style.display = "block";
}

function showLogin() {
    document.getElementById("registerDiv").style.display = "none";
    document.getElementById("loginDiv").style.display = "block";
}

function saveCookie(firstName, lastName, userId) {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}