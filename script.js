const body = document.getElementsByTagName('body')[0];
const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const logInBtn = document.getElementById('send');
const messageToUeser = document.createElement('p');
const userTemp = document.getElementById('user_temp');
const deleteBtn = document.getElementsByClassName('delete');
const changeBtn = document.getElementsByClassName('edit');
const users = document.createElement('div');
users.classList.add('users');
const URL = 'https://reqres.in/api';
let user;
let nextBtn = document.createElement('button');
nextBtn.innerText = 'next';
let prevBtn = document.createElement('button');
prevBtn.innerText = 'prev';
let page = 1;
function getRequestLogin(e) {
    e.preventDefault();
    fetch(`${URL}/login`, {
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
        headers: {
            'content-type': 'application/json'
        }
    })
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            if (Object.keys(response)[0] !== 'token') {
                unSuccessfulLogin(response);
            } else {
                successfulLogin(response);
            };
        })
};

form.addEventListener('submit', getRequestLogin);
nextBtn.addEventListener('click', onClickNext);
prevBtn.addEventListener('click', onClickPrev);

function successfulLogin(page) {
    fetch(`${URL}/users?page=${page}`)
        .then(response => response.json())
        .then((response) => {
            getUsers(response.data, userTemp.innerHTML);
        });
}
function unSuccessfulLogin(error) {
    messageToUeser.innerText = Object.values(error)[0];
    document.body.append(messageToUeser);
}
function getUsers(response, template) {
    form.hidden = true;
    let result = '';
    response.forEach(user => {
        result += template;
        Object.keys(user).forEach(key => {
            result = result.replaceAll(`{{${key}}}`, user[key]);
        });
    });
    users.innerHTML = result;
    users.append(prevBtn, nextBtn);
    document.body.append(users)
    for (btn of deleteBtn) {
        btn.addEventListener('click', onRemoveUser);
    };
    for (btn of changeBtn) {
        btn.addEventListener('click', onUpdateUser);
    };
}
function onClickNext() {
    ++page;
    if (page > 2) {
        page = 2;
    }   
    successfulLogin(page);
}
function onClickPrev() {
    --page;
    if (page < 1) {
        page = 1;
    } 
    successfulLogin(page);
}
function onRemoveUser(e) {
    let id = e.target.parentElement.parentElement.children[0].innerText;
    user = e.target.parentElement.parentElement;
    fetch(`${URL}/users/${id}`, {
        method: 'DELETE'
    })
        .then((response) => {
            if (response.status === 204) {
                user.remove()
        }
    }) 
}
function onUpdateUser(e) {
    user = e.target.parentElement.parentElement;
    for (el of user.children) {
        if (el.className.includes('save') === true) {
            saveBtn = el;
        }
        if (el.classList.contains('d_none') === true) {
            el.classList.remove('d_none');
            el.classList.add('d_block');
        } else {
            el.classList.add('d_none');
        }
    }
    saveBtn.addEventListener('click', onSaveFunc);
}
function onSaveFunc(e) {
    searchEl(e);
    let id = e.target.parentElement.children[0].innerText;
    fetch(`${URL}/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            id: id,
            email: emailValue,
            first_name: firstNameValue,
            last_name: lastNameValue,
            avatar: avatarValue
        }),
        headers: {
            'content-type': 'application/json'
        }
    })
      .then((response) => {
          if (response.status === 200) {
              changeUser(); 
            }
        })
}
function changeUser() {
    firstName.innerText = firstNameValue;
    lastName.innerText = lastNameValue; 
    emailinp.innerText = emailValue; 
    avatar.src = avatarValue; 
    for (el of user.children) {
         if (el.classList.contains('d_none') === true) {
            el.classList.remove('d_none');
            el.classList.add('d_block');
         } else {
             el.classList.remove('d_block');
            el.classList.add('d_none');
        }
    }
} 
function searchEl(event) {
    user = event.target.parentElement;
    for (el of user.children) {
        if (el.className.includes('firstname_value') === true) {
            firstNameValue = el.value;
        }
        if (el.className.includes('lastname_value') === true) {
            lastNameValue = el.value;
        }
        if (el.className.includes('emailvalue') === true) {
            emailValue = el.value;
        }
        if (el.className.includes('avatarvalue') === true) {
            avatarValue = el.value;
        }
         if (el.className.includes('first_name') === true) {
            firstName = el;
        }
        if (el.className.includes('last_name') === true) {
            lastName = el;
        }
        if (el.className.includes('email_inp') === true) {
            emailinp = el;
        }
        if (el.className.includes('avatar') === true) {
            avatar = el;
        }
    }
}



/*
function onSendForm(e) {
    e.preventDefault();
    let sendLogIn = new XMLHttpRequest();
    sendLogIn.open('POST', `${URL}/login`);
    sendLogIn.setRequestHeader('content-type', 'application/json');
    sendLogIn.onload = function (e) {
        if (e.currentTarget.status === 400) {
            messageToUeser.innerText = Object.values(JSON.parse(sendLogIn.response));
            form.append(messageToUeser);
            return false;
        }
        if (e.currentTarget.status >= 200 && e.currentTarget.status <= 299) {
            form.classList.add('d-none');
            const requestUsers = new XMLHttpRequest;
            requestUsers.open('GET', `${URL}/users?page=1`, false);
            requestUsers.send();
            const responseUsers = JSON.parse(requestUsers.response);
            body.append(users);
            responseUsers.data.forEach(element => {
                user = document.createElement('div');
                user.classList.add('user');
                editBtn = document.createElement('button');
                editBtn.classList.add('edit_btn');
                editBtn.innerText = 'edit';
                deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete_btn');
                deleteBtn.innerText = 'delete';
                Object.values(element).forEach((el, index, arr) => {
                    spanValue = document.createElement('p');
                    if (index === arr.length - 1) {
                        spanValue = document.createElement('img');
                        spanValue.classList.add('photo');
                        spanValue.src = `${el}`;
                        user.append(spanValue);
                        return false;
                    }
                    if (index === 0) {
                        spanValue.classList.add('id');
                    };
                    if (index === 1) {
                        spanValue.classList.add('email');
                    };
                    if (index === 2) {
                        spanValue.classList.add('first_name');
                    };
                    if (index === 3) {
                        spanValue.classList.add('last_name');
                    };
                    spanValue.innerText = el;
                    user.append(spanValue);
                })                
                user.append(editBtn, deleteBtn);
                users.append(user);
                editBtn.addEventListener('click', onEditUser);
                deleteBtn.addEventListener('click', onDeleteUser);
            }); 
        };
    };
    sendLogIn.send(JSON.stringify({
        email: email.value,
        password: password.value
    }));
}
function onEditUser(e) {
    const userChildren = e.target.parentElement.children;
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('save_btn');
    e.target.hidden = true;
    saveBtn.innerText = 'save';    
    for (let j = 0; j < userChildren.length; j++) {
        if (userChildren[j].className === 'email' || userChildren[j].className === 'first_name' || userChildren[j].className === 'last_name' || userChildren[j].className === 'photo') {
            editInput = document.createElement('input');
            editInput.value = userChildren[j].innerText;
            userChildren[j].after(editInput);
        }
        if (userChildren[j].className === 'email' || userChildren[j].className === 'first_name' || userChildren[j].className === 'last_name') {
            userChildren[j].style.display = 'none';
        }
        if (userChildren[j].className === 'photo') {
            editInput.value = userChildren[j].src;
            editInput.classList.add('edit_photo');
        }
        if (userChildren[j].className === 'email') {
            editInput.classList.add('edit_email');
        }
        if (userChildren[j].className === 'first_name') {
            editInput.classList.add('edit_first_name');
        }
        if (userChildren[j].className === 'last_name') {
            editInput.classList.add('edit_last_name');
        }
        if (userChildren[j].className === 'delete_btn') {
            userChildren[j].hidden = true;
        }
    }
    e.target.parentElement.append(saveBtn);
    saveBtn.addEventListener('click', onSeveСhangesUser); 
}
function onSeveСhangesUser(e) {
    const userChildren = e.target.parentElement.children;
    const id = (() => {
        for (el of userChildren) {
            if (el.className === 'id') {
                return el.innerText;
            };
        };
    })();
      const emailEdit = (() => {
        for (el of userChildren) {
            if (el.className === 'edit_email') {
                return el;
            };
        };
    })();
      const firstNameEdit = (() => {
        for (el of userChildren) {
            if (el.className === 'edit_first_name') {
                return el;
            };
        };
    })();
      const lastNameEdit = (() => {
        for (el of userChildren) {
            if (el.className === 'edit_last_name') {
                return el;
            };
        };
    })();
      const photoEdit = (() => {
        for (el of userChildren) {
            if (el.className === 'edit_photo') {
                return el;
            };
        };
    })();
    const requestToUpdate = new XMLHttpRequest();
    requestToUpdate.open('PATCH', `${URL}/users/${id}`);
    requestToUpdate.setRequestHeader('content-type', 'application/json');
    requestToUpdate.onload = function (e) {
        if (e.currentTarget.status === 200) {
            for (el of userChildren) {
                if (el.className === 'email') {
                    el.innerText = emailEdit.value;
                    el.style.display = 'block';
                };
                if (el.className === 'first_name') {
                    el.innerText = firstNameEdit.value;
                    el.style.display = 'block';
                };
                if (el.className === 'last_name') {
                    el.innerText = lastNameEdit.value;
                    el.style.display = 'block';
                };
                if (el.className === 'photo') {
                    el.src = photoEdit.value;
                    el.style.display = 'block';
                };
                if (el.localName === 'input' || el.className === 'save_btn') {
                    el.hidden = true;
                }
                if (el.className === 'edit_btn' || el.className === 'delete_btn') {
                    el.hidden = false;
                }
            };
        } 
    }
    requestToUpdate.send(JSON.stringify({
        email: emailEdit.value,
        first_name: firstNameEdit.value,
        last_name: lastNameEdit.value,
        avatar: photoEdit.value
    })); 
}
function onDeleteUser(ev) {
    const userChildren = ev.target.parentElement.children;
    const user = ev.target.parentElement;
    const id = (() => {
        for (el of userChildren) {
            if (el.className === 'id') {
                return el.innerText;
            };
        };
    })();
    const deleteRequest = new XMLHttpRequest();
    deleteRequest.open('DELETE', `${URL}/users/${id}`);
    deleteRequest.onload = (e) => {
        if (e.currentTarget.status === 204) {
            user.remove();
        }
    }
    deleteRequest.send();
}
form.addEventListener('submit', onSendForm);

*/