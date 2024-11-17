// Getting contacts from localStorage or creating object if there is no info
var contactsList : any = localStorage.getItem('contactsList');
if (contactsList == null) {
    contactsList = {};
    for (let i = 0; i < 26; i++){
        contactsList[String.fromCharCode("A".charCodeAt(0) + i)] = []; // letter
    }
    localStorage.setItem('contactsList', JSON.stringify(contactsList));
} else {
    contactsList = JSON.parse(contactsList);
}

//number of all contacts
function updateCounter(letter : string){
    let counter : number = 0;
    if (letter == 'All'){
        for (let letter in contactsList){
            counter += contactsList[letter].length;
        }
    } else {
        counter = contactsList[letter].length;
    }
    let spanElement : any = document.querySelector(`span[value="${letter}"]`);
    spanElement.innerText = counter;
    let radioInputAll : any = document.querySelector(`span[value="${letter}"]`);
}

document.querySelector('input[value="All"]')!.addEventListener('change', () => {updateContactsListEl()});
updateCounter('All');

// Creating radio inputs on each letter
for (let letter in contactsList){
    let newLetterElementInput = document.createElement('input');
    let newLetterElementSpan = document.createElement('span');
    let newLetterElementLabel = document.createElement('label');
    newLetterElementInput.setAttribute('type', 'radio');
    newLetterElementInput.setAttribute('name', 'letters');
    newLetterElementInput.setAttribute('value', letter);

    newLetterElementInput.addEventListener('change', () => {updateContactsListEl()})

    newLetterElementSpan.innerHTML = contactsList[letter].length;
    newLetterElementSpan.setAttribute('value', letter);

    newLetterElementLabel.append(newLetterElementInput, newLetterElementSpan);
    newLetterElementLabel.classList.add('letters-list__letters-list-item');

    let listElement = document.getElementsByClassName('letters-list')[0];
    listElement.append(newLetterElementLabel);
}

function deleteListItem(itemToDelete : any){
    let firstLetter = itemToDelete.name[0].toUpperCase();
    contactsList[firstLetter] = contactsList[firstLetter].filter(
        (item : any) => !(item.name == itemToDelete.name && item.vacancy == itemToDelete.vacancy && item.phone == itemToDelete.phone)
    );
    localStorage.setItem('contactsList', JSON.stringify(contactsList));
}

function editListItem(prevValues : any){
    let nameInput = document.getElementById('edit-name-input') as HTMLInputElement;
    let vacancyInput = document.getElementById('edit-vacancy-input') as HTMLInputElement;
    let phoneInput = document.getElementById('edit-phone-input') as HTMLInputElement;
    let errorElement = document.querySelector('.inner__error-msg') as HTMLElement;
    
    // All checks passed
    if (performChecks(nameInput, vacancyInput, phoneInput, errorElement)){
        deleteListItem(prevValues);
        let nameFirstLetter = nameInput.value[0].toUpperCase();
        contactsList[nameFirstLetter].push(
            {
                name: nameInput.value,
                vacancy: vacancyInput.value,
                phone:phoneInput.value
            }
        );
        
        localStorage.setItem('contactsList', JSON.stringify(contactsList));
        updateContactsListEl();
    }
}

function updateContactsListEl(){
    // Clear list
    let listElement = document.querySelector('.contacts-display__contacts-list');
    listElement!.innerHTML = '';

    let checkedValue = 'All';
    let inputs = document.getElementsByName('letters') as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => {
        if (input.checked) {
            checkedValue = input.value;
        }
    });
    // Add list items
    for (let letter in contactsList){
        if (letter == checkedValue || checkedValue == 'All'){
            for (let infoObj of contactsList[letter]){
                let newListItem = document.createElement('div');
                newListItem.classList.add('contacts-list__contacts-list-item');
                newListItem.classList.add('contacts-list-item');
                newListItem.innerHTML = 
                `Name: ${infoObj.name}<br>
                Vacancy: ${infoObj.vacancy}<br>
                Phone: ${infoObj.phone}<br>`;
                let deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = "delete";
                deleteBtn.classList.add('interface-btn');
                deleteBtn.addEventListener('click', () => {
                    deleteListItem(infoObj);
                    updateContactsListEl();
                });

                let editBtn = document.createElement('button');
                editBtn.innerHTML = "edit";
                editBtn.classList.add('interface-btn');
                editBtn.addEventListener('click', () => {
                    (document.getElementById('edit-name-input') as HTMLInputElement).value = infoObj.name;
                    (document.getElementById('edit-vacancy-input') as HTMLInputElement).value = infoObj.vacancy;
                    (document.getElementById('edit-phone-input') as HTMLInputElement).value = infoObj.phone;
                    let editPopup = document.querySelector('.main__edit-popup');
                    editPopup?.classList.add('edit-popup--active');
                    editPopup?.classList.remove('edit-popup');

                    let popupEditBtn = document.createElement('button');
                    popupEditBtn.innerHTML = 'edit';
                    popupEditBtn.classList.add('interface-btn');
                    popupEditBtn.classList.add('inner__edit-btn');
                    popupEditBtn.addEventListener('click', () =>{
                        editListItem(infoObj);
                    });
                    
                    let prevPopupEditBtn = document.querySelector('.inner__edit-btn');
                    document.querySelector('.edit-popup--active__inner')?.replaceChild(popupEditBtn, prevPopupEditBtn!);
                });

                newListItem.append(deleteBtn);
                newListItem.append(editBtn);
                listElement?.append(newListItem);
            }
        }
        updateCounter(letter);
    }
    updateCounter('All');
}

updateContactsListEl();

document.querySelector('.adding-wrapper__clear-fields-btn')?.addEventListener('click', ()=>{
    for (let elementId of ['name-input', 'vacancy-input', 'phone-input']){
        let inputElement = document.getElementById(elementId) as HTMLInputElement;
        inputElement.value = '';
    }
});

function performChecks(nameInput : HTMLInputElement, vacancyInput : HTMLInputElement, phoneInput: HTMLInputElement, errorElement : HTMLElement){
    let displayError = (errorMsg: string) => {
        errorElement!.innerHTML = errorMsg;
        errorElement?.classList.remove('error-msg');
        errorElement?.classList.add('error-msg--active');
        setTimeout(()=>{
            errorElement?.classList.remove('error-msg--active');
            errorElement?.classList.add('error-msg');
        }, 3000);
    }
    // Checks
    for (let value of [nameInput.value, vacancyInput.value, phoneInput.value]){
        if (!value || value.trim().length === 0) {
            displayError('Empty input not allowed');
            return false;
        }
    }

    if (/^[A-Za-z]+$/.test(nameInput.value) == false){
        displayError('Name must contain only latin letters');
        return false;
    }

    if (nameInput.value.length < 3 || vacancyInput.value.length < 3){
        displayError('Name and value must have at least 3 characters');
        return false;
    }

    if (/^(?:\+|\d)\d{4,}$/.test(phoneInput.value) == false){
        displayError('Invalid phone number');
        return false;
    }

    if (contactsList[nameInput.value[0].toUpperCase()].find((item : any) => 
        item.name == nameInput.value &&
        item.vacancy == vacancyInput.value &&
        item.phone == phoneInput.value) !== undefined) {
            displayError('Can\'t add 2 equals contacts');
            return false;
        }

    return true;
}

// Add item
document.querySelector('.adding-wrapper__add-btn')?.addEventListener('click', ()=>{
    let newContact = {};
    let nameInput = document.getElementById('name-input') as HTMLInputElement;
    let vacancyInput = document.getElementById('vacancy-input') as HTMLInputElement;
    let phoneInput = document.getElementById('phone-input') as HTMLInputElement;
    let errorElement = document.querySelector('.adding-wrapper__error-msg') as HTMLElement;
    // All checks passed
    if (performChecks(nameInput, vacancyInput, phoneInput, errorElement)){
        let nameFirstLetter = nameInput.value[0].toUpperCase();
        contactsList[nameFirstLetter].push(
            {
                name: nameInput.value,
                vacancy: vacancyInput.value,
                phone:phoneInput.value
            }
        );
        localStorage.setItem('contactsList', JSON.stringify(contactsList));
        updateContactsListEl();
    }
});

// Clear list
document.querySelector('.contacts-display__clear-list-btn')?.addEventListener('click', ()=>{
    const isConfirmed = confirm('Are you sure want to clear ALL list items?');
    if (isConfirmed) {
        for (let letter in contactsList){
            contactsList[letter] = [];
            localStorage.setItem('contactsList', JSON.stringify(contactsList));
            updateContactsListEl();
        }
    }
})

document.querySelector('.inner__close-btn')?.addEventListener('click', ()=>{
    let editPopup = document.querySelector('.main__edit-popup');
    editPopup?.classList.remove('edit-popup--active');
    editPopup?.classList.add('edit-popup');
});

let editPopupElement = document.querySelector('.main__edit-popup');

editPopupElement?.addEventListener('click', (event)=>{
    if (event.target === editPopupElement){
        let editPopup = document.querySelector('.main__edit-popup');
        editPopup?.classList.remove('edit-popup--active');
        editPopup?.classList.add('edit-popup');
    }
});