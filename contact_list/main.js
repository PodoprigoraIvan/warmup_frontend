"use strict";
var _a, _b, _c, _d;
// Getting contacts from localStorage or creating object if there is no info
var contactsList = localStorage.getItem('contactsList');
if (contactsList == null) {
    contactsList = {};
    for (var i = 0; i < 26; i++) {
        contactsList[String.fromCharCode("A".charCodeAt(0) + i)] = []; // letter
    }
    localStorage.setItem('contactsList', JSON.stringify(contactsList));
}
else {
    contactsList = JSON.parse(contactsList);
}
//number of all contacts
function updateCounter(letter) {
    var counter = 0;
    if (letter == 'All') {
        for (var letter_1 in contactsList) {
            counter += contactsList[letter_1].length;
        }
    }
    else {
        counter = contactsList[letter].length;
    }
    var spanElement = document.querySelector("span[value=\"".concat(letter, "\"]"));
    spanElement.innerText = counter;
    var radioInputAll = document.querySelector("span[value=\"".concat(letter, "\"]"));
}
document.querySelector('input[value="All"]').addEventListener('change', function () { updateContactsListEl(); });
updateCounter('All');
// Creating radio inputs on each letter
for (var letter in contactsList) {
    var newLetterElementInput = document.createElement('input');
    var newLetterElementSpan = document.createElement('span');
    var newLetterElementLabel = document.createElement('label');
    newLetterElementInput.setAttribute('type', 'radio');
    newLetterElementInput.setAttribute('name', 'letters');
    newLetterElementInput.setAttribute('value', letter);
    newLetterElementInput.addEventListener('change', function () { updateContactsListEl(); });
    newLetterElementSpan.innerHTML = contactsList[letter].length;
    newLetterElementSpan.setAttribute('value', letter);
    newLetterElementLabel.append(newLetterElementInput, newLetterElementSpan);
    newLetterElementLabel.classList.add('letters-list__letters-list-item');
    var listElement = document.getElementsByClassName('letters-list')[0];
    listElement.append(newLetterElementLabel);
}
function deleteListItem(itemToDelete) {
    var firstLetter = itemToDelete.name[0].toUpperCase();
    contactsList[firstLetter] = contactsList[firstLetter].filter(function (item) { return !(item.name == itemToDelete.name && item.vacancy == itemToDelete.vacancy && item.phone == itemToDelete.phone); });
    localStorage.setItem('contactsList', JSON.stringify(contactsList));
}
function editListItem(prevValues) {
    var nameInput = document.getElementById('edit-name-input');
    var vacancyInput = document.getElementById('edit-vacancy-input');
    var phoneInput = document.getElementById('edit-phone-input');
    var errorElement = document.querySelector('.inner__error-msg');
    // All checks passed
    if (performChecks(nameInput, vacancyInput, phoneInput, errorElement)) {
        deleteListItem(prevValues);
        var nameFirstLetter = nameInput.value[0].toUpperCase();
        contactsList[nameFirstLetter].push({
            name: nameInput.value,
            vacancy: vacancyInput.value,
            phone: phoneInput.value
        });
        localStorage.setItem('contactsList', JSON.stringify(contactsList));
        updateContactsListEl();
    }
}
function updateContactsListEl() {
    // Clear list
    var listElement = document.querySelector('.contacts-display__contacts-list');
    listElement.innerHTML = '';
    var checkedValue = 'All';
    var inputs = document.getElementsByName('letters');
    inputs.forEach(function (input) {
        if (input.checked) {
            checkedValue = input.value;
        }
    });
    // Add list items
    for (var letter in contactsList) {
        if (letter == checkedValue || checkedValue == 'All') {
            var _loop_1 = function (infoObj) {
                var newListItem = document.createElement('div');
                newListItem.classList.add('contacts-list__contacts-list-item');
                newListItem.classList.add('contacts-list-item');
                newListItem.innerHTML =
                    "Name: ".concat(infoObj.name, "<br>\n                Vacancy: ").concat(infoObj.vacancy, "<br>\n                Phone: ").concat(infoObj.phone, "<br>");
                var deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = "delete";
                deleteBtn.classList.add('interface-btn');
                deleteBtn.addEventListener('click', function () {
                    deleteListItem(infoObj);
                    updateContactsListEl();
                });
                var editBtn = document.createElement('button');
                editBtn.innerHTML = "edit";
                editBtn.classList.add('interface-btn');
                editBtn.addEventListener('click', function () {
                    var _a;
                    document.getElementById('edit-name-input').value = infoObj.name;
                    document.getElementById('edit-vacancy-input').value = infoObj.vacancy;
                    document.getElementById('edit-phone-input').value = infoObj.phone;
                    var editPopup = document.querySelector('.main__edit-popup');
                    editPopup === null || editPopup === void 0 ? void 0 : editPopup.classList.add('edit-popup--active');
                    editPopup === null || editPopup === void 0 ? void 0 : editPopup.classList.remove('edit-popup');
                    var popupEditBtn = document.createElement('button');
                    popupEditBtn.innerHTML = 'edit';
                    popupEditBtn.classList.add('interface-btn');
                    popupEditBtn.classList.add('inner__edit-btn');
                    popupEditBtn.addEventListener('click', function () {
                        editListItem(infoObj);
                    });
                    var prevPopupEditBtn = document.querySelector('.inner__edit-btn');
                    (_a = document.querySelector('.edit-popup--active__inner')) === null || _a === void 0 ? void 0 : _a.replaceChild(popupEditBtn, prevPopupEditBtn);
                });
                newListItem.append(deleteBtn);
                newListItem.append(editBtn);
                listElement === null || listElement === void 0 ? void 0 : listElement.append(newListItem);
            };
            for (var _i = 0, _a = contactsList[letter]; _i < _a.length; _i++) {
                var infoObj = _a[_i];
                _loop_1(infoObj);
            }
        }
        updateCounter(letter);
    }
    updateCounter('All');
}
updateContactsListEl();
(_a = document.querySelector('.adding-wrapper__clear-fields-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    for (var _i = 0, _a = ['name-input', 'vacancy-input', 'phone-input']; _i < _a.length; _i++) {
        var elementId = _a[_i];
        var inputElement = document.getElementById(elementId);
        inputElement.value = '';
    }
});
function performChecks(nameInput, vacancyInput, phoneInput, errorElement) {
    var displayError = function (errorMsg) {
        errorElement.innerHTML = errorMsg;
        errorElement === null || errorElement === void 0 ? void 0 : errorElement.classList.remove('error-msg');
        errorElement === null || errorElement === void 0 ? void 0 : errorElement.classList.add('error-msg--active');
        setTimeout(function () {
            errorElement === null || errorElement === void 0 ? void 0 : errorElement.classList.remove('error-msg--active');
            errorElement === null || errorElement === void 0 ? void 0 : errorElement.classList.add('error-msg');
        }, 3000);
    };
    // Checks
    for (var _i = 0, _a = [nameInput.value, vacancyInput.value, phoneInput.value]; _i < _a.length; _i++) {
        var value = _a[_i];
        if (!value || value.trim().length === 0) {
            displayError('Empty input not allowed');
            return false;
        }
    }
    if (/^[A-Za-z]+$/.test(nameInput.value) == false) {
        displayError('Name must contain only latin letters');
        return false;
    }
    if (nameInput.value.length < 3 || vacancyInput.value.length < 3) {
        displayError('Name and value must have at least 3 characters');
        return false;
    }
    if (/^(?:\+|\d)\d{4,}$/.test(phoneInput.value) == false) {
        displayError('Invalid phone number');
        return false;
    }
    if (contactsList[nameInput.value[0].toUpperCase()].find(function (item) {
        return item.name == nameInput.value &&
            item.vacancy == vacancyInput.value &&
            item.phone == phoneInput.value;
    }) !== undefined) {
        displayError('Can\'t add 2 equals contacts');
        return false;
    }
    return true;
}
// Add item
(_b = document.querySelector('.adding-wrapper__add-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    var newContact = {};
    var nameInput = document.getElementById('name-input');
    var vacancyInput = document.getElementById('vacancy-input');
    var phoneInput = document.getElementById('phone-input');
    var errorElement = document.querySelector('.adding-wrapper__error-msg');
    // All checks passed
    if (performChecks(nameInput, vacancyInput, phoneInput, errorElement)) {
        var nameFirstLetter = nameInput.value[0].toUpperCase();
        contactsList[nameFirstLetter].push({
            name: nameInput.value,
            vacancy: vacancyInput.value,
            phone: phoneInput.value
        });
        localStorage.setItem('contactsList', JSON.stringify(contactsList));
        updateContactsListEl();
    }
});
// Clear list
(_c = document.querySelector('.contacts-display__clear-list-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
    var isConfirmed = confirm('Are you sure want to clear ALL list items?');
    if (isConfirmed) {
        for (var letter in contactsList) {
            contactsList[letter] = [];
            localStorage.setItem('contactsList', JSON.stringify(contactsList));
            updateContactsListEl();
        }
    }
});
(_d = document.querySelector('.inner__close-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
    var editPopup = document.querySelector('.main__edit-popup');
    editPopup === null || editPopup === void 0 ? void 0 : editPopup.classList.remove('edit-popup--active');
    editPopup === null || editPopup === void 0 ? void 0 : editPopup.classList.add('edit-popup');
});
var editPopupElement = document.querySelector('.main__edit-popup');
editPopupElement === null || editPopupElement === void 0 ? void 0 : editPopupElement.addEventListener('click', function (event) {
    if (event.target === editPopupElement) {
        var editPopup = document.querySelector('.main__edit-popup');
        editPopup === null || editPopup === void 0 ? void 0 : editPopup.classList.remove('edit-popup--active');
        editPopup === null || editPopup === void 0 ? void 0 : editPopup.classList.add('edit-popup');
    }
});
