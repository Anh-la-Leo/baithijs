var hienthi = document.getElementById("txtHienThi")
var dangNhap = document.getElementById("txtDangNhap")
var email = document.getElementById("txtEmail")
var mobile = document.getElementById("txtPhone_Numbe")
var pass = document.getElementById("txtPDW")
var xacNhan = document.getElementById("txtMKXN")
var capQuyen = document.getElementById("cboQuyen")
var table = document.getElementById('getUser');
let status_Search = document.getElementById("status-search");
var ul_Show = document.getElementById("HienThiTrang")
let search_Quyen = document.getElementById("search-quyen");
var endpoint = "https://httpdl.howizbiz.com/api/"
var routers = {
    roles: "roles",
    list_logOut: "web-logout",
    listusers: "users",
    me: "me"
}
let _page = 1;
let _perPage = 5;
let search = '';
function fn_getUsers(_page, _perPage) {
    //goi api get user
    console.log(routers.listusers);
    let url = endpoint + routers.listusers;
    url += `?with=roles,createdBy&paginate=true&page=` + _page + `&itemsPerPage=` + _perPage + `&search=` + search;
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        console.log(xhttp);
        var response = JSON.parse(xhttp.responseText);
        console.log(response);
        let pagination = response.pagination;
        let data = response.list
        console.log(data);
        pagin(_page, Math.ceil(pagination.total / _perPage))

        getUserName(data);


    }
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"))
    xhttp.send();

}
var Photo = document.getElementById("photo")
function showUserDetail() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        let response = JSON.parse(xhttp.responseText);
        let data = response.user;
        console.log(data)
        fn_logLocatian(data)
        fn_photo(data)
    }
    url = endpoint + routers.me
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send();
}
function fn_photo(data) {
    Photo.innerHTML = ""

    Photo.innerHTML += `<div  style="display: flex;"> <img src="${data.avatar_url}" class="rounded-circle"
        alt="Cinque Terre" width="30px" height="30px"><br>
    <p type="button" class="rounded-circle" data-bs-toggle="modal" data-bs-target="#formLogout">${data.username}
    </p></div>`

}

var logLocatian = document.getElementById("logLocatian")
function fn_logLocatian(data) {
    logLocatian.innerHTML = ""
    logLocatian.innerHTML += `<div class="modal-header" style="text-align: center;flex-direction: column;">
    <img src="${data.avatar_url}"
        class="rounded-circle" alt="Cinque Terre" width="30" height="30">
    <p>${data.username}</p>
    <p class="bg-info">Quản trị hệ thống</p>
</div>

<!-- Modal Header -->
<ul style="display: flex; justify-content: space-between;padding:0">
    <li data-bs-toggle="modal">Hồ sơ</li>
    <li onclick="fn_Logout()" class="text-danger" data-bs-toggle="modal">Đăng xuất</li>
</ul>`
}


function getUserName(data) {
    // document.getElementById('getUser').innerHTML = xhttp.responseText;

    table.innerHTML = ""
    for (let i = 0; i < data.length; i++) {
        let dateTimeParts = data[i].created_at.split(" ");
        let datePart = dateTimeParts[0];
        let roles = ""
        if (data[i].inactive === true) {
            let checked = document.querySelector(".checked")
            checked.removeAttribute("checked");
        }
        for (let j = 0; j < data[i].roles.length; j++) {
            roles += `<span class="role mx-1 px-2 py-1" style="background-color: ${data[i].roles[j].meta.color}">${data[i].roles[j].name}</span>`;
        }
        table.innerHTML += `
                <tr id="${data[i].id}">
                <td>${data[i].email}</td>
                    <td>${data[i].name}</td>
                    <td>${data[i].username}</td>
                    <td>${data[i].mobile}</td>
                    <td>
                    <label class="switch">
                    <input type="checkbox" checked>
                     <span class="slider round"></span>
                    </label>
                    </td>
                    <td>${roles}</td>
                    <td>${datePart}</td>
                    <td>
                    <p class="text-success" data-bs-toggle="modal" data-bs-target="#formSetUp" onclick="fn_Edit(this)"><i class="fa fa-pencil"
                    aria-hidden="true"></i></p>
                    <p onclick="getNameDel('${data[i].name}'); getIdDel('${data[i].id}')" class="text-danger" data-bs-toggle="modal" data-bs-target="#Delete""><i class="fa fa-trash-o" aria-hidden="true"></i></p>
                    </td>
                </tr>
            `;
    }

}//HÀM HIỂN THỊ RA CÁC SELECT TRONG FORM
function fn_getSelection() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {

        let selecttion;
        selecttion = JSON.parse(xhttp.responseText);
        renderQuyen(selecttion)// ren ra quyền truy cập
        selecttion_Quyen(selecttion) // tạo mới quyền truy cập
        Update_quyen(selecttion)// update quyền truy cập
    }
    var url = endpoint + routers.roles
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.send()

}
//  xử lý thanh trạng thái

status_Search.addEventListener("click", () => {
    let status_Label = document.getElementById("status-label");
    status_Label.style.color = "red";
    let list_Status = document.getElementById("list-status");
    list_Status.style.display = "block";
    let ul = document.getElementById("list-status--child");
    let li = ul.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
        li[i].setAttribute("onclick", "list_Item(this);");
    }
})

function list_Item(e) {
    let content = e.innerText;
    status_Search.value = content;
    let list_Status = document.getElementById("list-status");
    list_Status.style.display = "none";
    let status_Label = document.getElementById("status-label");
    status_Label.style.color = "black";
}

function renderQuyen(selecttion) {
    let list = document.getElementById("list_Quyen");
    let ul = document.createElement("ul")
    ul.id = "list_Quyen--item";
    for (let i = 0; i < selecttion.length; i++) {
        let li = document.createElement("li")
        li.setAttribute("id", selecttion[i].id);
        li.setAttribute("onclick", "dataQuyen(this);");
        li.appendChild(document.createTextNode(selecttion[i].name));
        ul.appendChild(li);
    }
    list.appendChild(ul);
}


search_Quyen.addEventListener("click", () => {
    let ul = document.getElementById("list_Quyen");
    ul.style.display = "block";
})

function dataQuyen(e) {
    _page = 1;
    let ul = document.getElementById("list_Quyen");
    let icon = document.getElementById("icon");
    let label = document.getElementById("label_quyen");
    let content = e.innerText
    search_Quyen.value = content;
    ul.style.display = "none";
    icon.style.display = "none";
    label.style.color = "black";
    let id = e.attributes["id"].value;
    let url = endpoint + routers.listusers;
    url += `?with=roles,createdBy&paginate=true&page=` + _page + `&itemsPerPage=` + _perPage + `&search=&role_id=` + id;

    const xhttp = new XMLHttpRequest;
    xhttp.onload = function () {
        var response = JSON.parse(xhttp.responseText);
        let data = response.list
        let pagination = response.pagination.total;
        if (xhttp.status == 200) {
            myFunction()
            getUserName(data);
            pagin(_page, Math.ceil(pagination.total / _perPage))
        } else {
            fn_getUsers(_page, _perPage)
        }
    }
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send();
}





function Update_quyen(selecttion) {
    var updateQuyen = document.getElementById("updateQuyen")

    for (var i = 0; i < selecttion.length; i++) {

        updateQuyen.innerHTML += `<option value='${selecttion[i].id}'>${selecttion[i].name}</option>`
    }

}


function selecttion_Quyen(selecttion) {

    var cboQuyen = document.getElementById("cboQuyen")

    for (var i = 0; i < selecttion.length; i++) {

        cboQuyen.innerHTML += `<option value='${selecttion[i].id}'>${selecttion[i].name}</option>`
    }

}
//HÀM ONCLICK TRONG THÊM SERVER

function fn_ThemServer() {
    if (checkValidForm()) {
        var xhttp = new XMLHttpRequest();
        var created_add = {
            "name": hienthi.value,
            "username": dangNhap.value,
            "email": email.value,
            "password": pass.value,
            "password_confirmation": xacNhan.value,
            "role_ids": [
                capQuyen.value,
            ]
        }
        xhttp.onload = function () {
            var data = JSON.parse(xhttp.responseText);
            if (data.hasOwnProperty('errors')) {
                alert(data.message)
            } else {
                // alert(data.message);
                $('#formLogin').modal('hide')
                getUserName();
            }

        }
        var url = endpoint + routers.listusers
        xhttp.open("POST", url);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
        xhttp.send(JSON.stringify(created_add))
    } else {
        fn_Err()
    }

}
//CÁC FUNCTION HIỂN THỊ RA CÁC THÔNG BÁO LỖI
function fn_Err() {
    fn_Name(hienthi)
    fn_NameDn(dangNhap)
    fn_NameEmai(email)
    fn_NamePW(pass)
    fn_NameXN(xacNhan)
}

function fn_Name(input) {
    var value = hienthi.value
    var TenHienThi = false
    if (!value) {
        TenHienThi = true
        fn_Error(input, "tên trường không được bỏ trông");
        return;
    } else {
        fn_success(input)
    }
    return TenHienThi
}
function fn_NameDn(input) {
    var value = dangNhap.value
    var TenDangNhap = false
    if (!value) {
        TenDangNhap = true
        fn_Error(input, "tên trường không được bỏ trông");
        return;
    } else {
        fn_success(input)
    }
    return TenDangNhap
}
function fn_NameEmai(input) {
    var value = email.value
    var Email = false
    if (!value) {
        Email = true
        fn_Error(input, "tên trường không được bỏ trông");
        return;
    } else {
        fn_success(input)
    }
    return Email
}
function fn_NamePW(input) {
    var value = pass.value
    var Pw = false
    if (!value) {
        Pw = true
        fn_Error(input, "tên trường không được bỏ trông");
        return;
    } else {
        fn_success(input)
    }
    return Pw
}
function fn_NameXN(input) {
    var value = xacNhan.value
    var XacNhan = false
    if (!value) {
        XacNhan = true
        fn_Error(input, "hãy nhập Lại sao cho đúng với mật khẩu ở phía trên");
        return;
    } else {
        fn_success(input)
    }
    return XacNhan
}




function fn_Error(input, message) {
    let parent = input.parentElement;
    let children = parent.querySelector(".err");
    children.innerHTML = message;
}
function fn_success(input) {
    let parent = input.parentElement;
    let children = parent.querySelector(".err");
    children.innerHTML = "";
}

function checkValidForm() {
    if (hienthi.value == "") {

        return false;
    }
    return true;
}
//ham trung gian lay id
function getIdDel(id) {

    const Handler = function () {
        fn_Delete(id)
    };
    document.getElementById("delete_table").onclick = Handler;
}
function getNameDel(name) {

    let span = document.getElementById("span_Delete")
    span.innerHTML += `Bạn có chắc muốn xóa <strong style="color:green">${name}</strong>? Điều này hoàn toàn không thể hoàn tác!`;
    console.log(span);
}
//HÀM XÓA DANH SACH NGƯỜI DÙNG

var delete_user = document.getElementById("delete_table")
delete_user.addEventListener("click", fn_Delete)
function fn_Delete(userid) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {

        var data = JSON.parse(xhttp.responseText);
        if (data.hasOwnProperty('errors')) {
            alert(data.message)
        } else {
            $('#formLogin').modal('hide')
            getUserName();
        }
    }
    var url = endpoint + routers.listusers + "/" + userid
    //`https://httpdl.howizbiz.com/api/users/${userid}`;
    xhttp.open("DELETE", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
    xhttp.send()

}
var updateQuyen = document.getElementById("updateQuyen")
var updateHT = document.getElementById("updateHienThi")
var updateDN = document.getElementById("updateDN")
var updateEl = document.getElementById("updateEmail")
var updatePhone = document.getElementById("updatePhone_Numbe")
var form_update = document.getElementById("formSetUp")
var input_Quyen = document.getElementById("inputQuyen")

//HÀM SEARCH CÁC THÔNG TIN NGƯỜI DÙNG
function fn_Edit(e) {
    // lấy giá trị tử bảng rồi truyền vào ô input update
    let id = e.parentNode.parentNode.attributes["id"].value;
    form_update.id = id;
    console.log(form_update.id);
    input_Quyen.value = "";
    const xhttp = new XMLHttpRequest();
    xhttp.onload = () => {

        let data = JSON.parse(xhttp.responseText);
        console.log(data)
        updateHT.value = data.name;
        updateDN.value = data.username
        updateEl.value = data.email;

        updatePhone.value = data.mobile;
        for (let j = 0; j < data.roles.length; j++) {
            input_Quyen.value += `${data.roles[j].name}` + "  ";
        }
    }
    xhttp.open("GET", "https://httpdl.howizbiz.com/api/users/" + id);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send();
}
input_Quyen.addEventListener("click", () => {
    updateQuyen.style.display = "block";
})
function updateSelect() {
    var selectedOptions = Array.from(updateQuyen.selectedOptions).map(option => option.innerText);
    let text = selectedOptions.join(" ");
    input_Quyen.value = text;
}

var upNew = document.getElementById("updateNew")
upNew.addEventListener("click", () => {
    const xhttp = new XMLHttpRequest();
    let userUpdate = {
        "name": updateHT.value,
        "username": updateDN.value,
        "email": updateEl.value,
        "id": form_update.id,


        "phone": updatePhone.value,

        "role_ids": getSelectValues(updateQuyen),
    }
    //console.log(id);
    xhttp.onload = () => {
        JSON.parse(xhttp.responseText);
        if (xhttp.status == 200) {
            //alert("Cập nhật Thông tin người dùng thành công")
            $("#formSetUp").modal('hide');
        } else {
            alert("loi he thong")
        }
    }
    xhttp.open("PUT", `https://httpdl.howizbiz.com/api/users/${form_update.id}`);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send(JSON.stringify(userUpdate));
});

function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (let i = 0; i < options.length; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }

    }
    return result;
}

function myFunction() {
    var tr = table.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        tr[i].innerHTML = "";
    }

}


var searh_menu = document.getElementById("mySearch")
searh_menu.addEventListener("keyup", fn_Search)
function fn_Search() {
    let input = searh_menu.value
    var _page = 1;
    var _perPage = 5;
    let url = endpoint + routers.listusers;
    url += `?with=roles,createdBy&paginate=true&page=` + _page + `&itemsPerPage=` + _perPage + `&search=` + input;

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var response = JSON.parse(xhttp.responseText);
        console.log(response);
        let data = response.list
        let pagination = response.pagination.total;
        console.log(pagination)
        if (xhttp.status == 200) {
            myFunction()
            getUserName(data);
            pagin(_page, Math.ceil(pagination.total / _perPage))
        } else {
            fn_getUsers(_page, _perPage)
        }
    }
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send();

}

function fn_creatDate(e) {
    var _page = 1
    var _perPage = 5
    let date = e.target.value;
    let day = date.split("-").reverse().join("%2F");
    let url = endpoint + routers.listusers;
    url += `?with=roles,createdBy&paginate=true&page=` + _page + `&itemsPerPage=` + _perPage + `&search=` + day;
    const xhttp = new XMLHttpRequest;
    xhttp.onload = function () {
        var response = JSON.parse(xhttp.responseText);
        let data = response.list
        let pagination = response.pagination.total;
        if (xhttp.status == 200) {
            myFunction()
            getUserName(data);
            pagin(_page, Math.ceil(pagination.total / _perPage))
        } else {
            fn_getUsers(_page, _perPage)
        }
    }
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send();
}

function fn_updateDate(e) {
    var _page = 1
    var _perPage = 5
    let date = e.target.value;
    let day = date.split("-").reverse().join("%2F");
    let url = endpoint + routers.listusers;
    url += '?paginate=true&page=' + _page + '&perpage=' + _perPage + '&with=roles,createdBy,provinces&search=&date_end=' + `${day}`;
    const xhttp = new XMLHttpRequest;
    xhttp.onload = function () {
        var response = JSON.parse(xhttp.responseText);
        let data = response.list
        let pagination = response.pagination.total;
        if (xhttp.status == 200) {
            myFunction()
            getUserName(data);
            pagin(_page, Math.ceil(pagination.total / _perPage))
        } else {
            fn_getUsers(_page, _perPage)
        }
    }
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send();
}
function localPage(value) {
    _perPage = value;
    fn_getUsers(_page, _perPage)
}

//HÀM PHÂN TRANG
function pagin(_page, _perPage) {
    ul_Show.innerHTML = "";
    if (_page == 1) {
        ul_Show.innerHTML += `<li><button class="inactive">preeview</button></li>`;
    } else {
        ul_Show.innerHTML += '<li><button onclick="fn_Preeview()">preeview</button></li>';
    }
    for (let i = 0; i < _perPage; i++) {
        ul_Show.innerHTML += `<li><button onclick="fn_Tang(this)" value="${i + 1}">${i + 1}</button></li>`
    }
    if (_page >= _perPage) {
        ul_Show.innerHTML += `<li><button class="inactive">NEXT</button></li>`;
    } else {
        ul_Show.innerHTML += '<li><button onclick="fn_Next()">NEXT</button></li>';
    }

}
//CÁC HÀM NHẢY TRANG
function fn_Preeview() {
    _page = _page - 1;
    fn_getUsers(_page, _perPage)
}
function fn_Tang(e) {
    _page = e.value;
    fn_getUsers(_page, _perPage)
}
function fn_Next() {
    _page = _page + 1;
    fn_getUsers(_page, _perPage)
}

//HÀM HIỂN THỊ RA CÁC FUNCTION LỚN
window.addEventListener('load', fn_loadData);
function fn_loadData() {
    fn_getSelection();
    fn_getUsers(_page, _perPage);
    showUserDetail()
}

//hàm dẩy từ user về login
function fn_Logout() {
    debugger
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        localStorage.setItem('token', JSON.parse(xhttp.responseText).access_token);
        if (xhttp.status == 200) {
            window.location.replace("../login/login.html")
        }
        else {
            alert('ban da thuc hien sai chuc nang')
        }
    }
    var url = endpoint + routers.list_logOut
    xhttp.open("POST", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", " Bearer " + localStorage.getItem("token"));
    xhttp.send();
}