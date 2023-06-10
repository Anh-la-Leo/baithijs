let username = document.getElementById('username');
let password = document.getElementById('pass');


function fn_Login() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {

        console.log(xhttp);
        document.getElementById('login').innerHTML = xhttp.responseText;
        localStorage.setItem('token', JSON.parse(xhttp.responseText).access_token);
        if (xhttp.status == 200) {
            window.location.replace("../user/user.html")
        }
        else {
            showErrow(username, "tai khoan dang nhap khong chinh xac");
            showErrow(password, "mat khau dang nhap khong chinh xac");
        }
    }
    xhttp.open("POST", "https://httpdl.howizbiz.com/api/web-authenticate");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username.value + "&password=" + password.value);
    localStorage.setItem('token', xhttp.responseText);
    localStorage.setItem('username', username.value);
    localStorage.setItem('password', password.value);
}