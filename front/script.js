let overlay = document.querySelector('#blur');

let forms = [...document.querySelectorAll('form')];
let formTransaction = document.querySelector('#form-transaction');
let formPurpose = document.querySelector('#form-purpose');
let formMember = document.querySelector('#form-member');
let formDeletion = document.getElementById('form-delete-confirm');
let formTransactionEdit = document.getElementById('form-ta-edit');
let formPurposeEdit = document.getElementById('form-purpose-edit');
let formMemberEdit = document.getElementById('form-member-edit');

let confirmDeleteBtn = document.getElementById('confirm-delete');
let cancelDeleteBtn = document.getElementById('cancel-delete');
let applyFiltersBtn = document.getElementById('apply-filters-btn');

let addBtnsContainer = document.querySelector('.add-buttons-container');
let dateAddTa = document.getElementById('date-ta');
let dateEditTa = document.getElementById('date-ta-edit');
const purposeTaSelect = $('#purpose-t-add');
const purposeTeSelect = $('#purpose-t-edit');
const memberTaSelect = $('#family-member-t-add');
const memberTeSelect = $('#family-member-t-edit');
const sumTaSelect = $('#sum-ta-add');
const sumTeSelect = $('#sum-ta-edit');

let dateFilter = document.getElementById("date-filter");
let orderByFilter = document.getElementById("orderBy-filter");
let orderTypeFilter = document.getElementById("order-type-filter");
let typeFilter = document.getElementById("type-filter");
let selectPurpose = document.getElementById('purpose-filter');
let selectMember = document.getElementById('family-member-filter');

let app_url = 'http://localhost:3000/';

document.addEventListener('DOMContentLoaded', function() {
    const dateFilter = document.getElementById('date-filter');
    const dateInput = document.getElementById('date-period');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    dateInput.style.display = 'none';

    dateFilter.addEventListener('change', function() {
        const selectedOption = dateFilter.value;

        if (selectedOption === 'custom') {
            dateInput.style.display = 'inline-block';
        } else {
            dateInput.style.display = 'none';
        }
    });

    function checkDates() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        const currentDate = new Date();
        
        
        if (startDate > currentDate){
          alert('Введіть коректну дату');
          startDateInput.value = '';
        }
        else if (endDate > currentDate) {
          alert('Введіть коректну дату');
          endDateInput.value = '';
        }
        else if (startDate > endDate) {
            alert('Початкова дата не може бути пізніше за кінцеву!');
            startDateInput.value = '';
            endDateInput.value = '';
        }
    }
    
    startDateInput.addEventListener('change', checkDates);
    endDateInput.addEventListener('change', checkDates);
});




dateAddTa.setAttribute('max', new Date().toISOString().split('T')[0]);
dateEditTa.setAttribute('max', new Date().toISOString().split('T')[0]);

let closeForms = () => {
    overlay.classList.add('hidden');
    forms.forEach(element => {
      element.classList.add('hidden');
    });
};

overlay.addEventListener('click', closeForms)


addBtnsContainer.addEventListener('click', (e) => {
  if(e.target.getAttribute("data-type") == 'member'){
    formMember.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }else if(e.target.getAttribute("data-type") == 'ta'){
    formTransaction.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }else if(e.target.getAttribute("data-type") == 'purpose'){
    formPurpose.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }
});

document.addEventListener('click', (e) => {
  if(e.target.classList.contains('delete-btn')){
    closeForms();
    formDeletion.classList.remove('hidden');
    overlay.classList.remove('hidden');
    formDeletion.setAttribute('item-type', e.target.closest('tr').getAttribute('item-type'));
    formDeletion.setAttribute('item-id', e.target.closest('tr').getAttribute('item-id'));
  }
  if(e.target.classList.contains('edit-member-btn')){
    closeForms();
    formMemberEdit.classList.remove('hidden');
    formMemberEdit.setAttribute('item-id', e.target.closest('tr').getAttribute('item-id'));
    overlay.classList.remove('hidden');
  }
  if(e.target.classList.contains('edit-purpose-btn')){
    closeForms();
    formPurposeEdit.classList.remove('hidden');
    formPurposeEdit.setAttribute('item-id', e.target.closest('tr').getAttribute('item-id'));
    overlay.classList.remove('hidden');
  }
  if(e.target.classList.contains('edit-ta-btn')){
    closeForms();
    formTransactionEdit.classList.remove('hidden');
    formTransactionEdit.setAttribute('item-id', e.target.closest('tr').getAttribute('item-id'));
    overlay.classList.remove('hidden');
  }
})

confirmDeleteBtn.addEventListener('click', function() {
  const itemId = formDeletion.getAttribute('item-id');
  const itemType = formDeletion.getAttribute('item-type');
  fetch(`${app_url}${itemType}/${itemId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      alert('Транзакція видалена успішно');
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });

  formDeletion.classList.add('hidden');
  overlay.classList.add('hidden');
  location.reload();
});

cancelDeleteBtn.addEventListener('click', function() {
  formDeletion.classList.add('hidden');
  overlay.classList.add('hidden');
});


document.addEventListener('DOMContentLoaded', function () {
  fetch(app_url + 'transactions/all')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.getElementById('table-body');
          tableBody.innerHTML = '';
          data.forEach(transaction => {
              const row = document.createElement('tr');
              row.setAttribute('item-id', transaction.id);
              row.setAttribute('item-type', 'transactions');
              row.innerHTML = `
                  <td>${transaction.t_date}</td>
                  <td>${transaction.purpose.type ? 'Дохід' : 'Витрата'}</td>
                  <td>${transaction.member.name}, ${transaction.member.age}</td>
                  <td>${transaction.purpose.category}</td>
                  <td>${transaction.sum}</td>
                  <td><a href="#" class="delete-btn">Видалити</a></td>
                  <td><a href="#" class="edit-ta-btn">Редагувати</a></td>
              `;
              tableBody.appendChild(row);
          });
      })
      .catch(error => console.error('Error fetching data:', error));
});


applyFiltersBtn.addEventListener('click', () => {
  let query = {};
  query.endDate = new Date().toISOString().split('T')[0];
  switch(dateFilter.value){
    case('current-month'):
      query.startDate = new Date(new Date().setDate(1)).toISOString().split('T')[0];
      break;
    case('last-month'):
      query.startDate = new Date(new Date(new Date().setDate(0)).setDate(1)).toISOString().split('T')[0];
      query.endDate = new Date(new Date().setDate(0)).toISOString().split('T')[0];
      console.log(query.startDate, query.endDate);
      break;
    case('all-time'):
      break;
    case('custom'):
      query.startDate = document.getElementById('start-date').value;
      query.endDate = document.getElementById('end-date').value;
      break;
    default:
      break;
  }
  const selectedPurposes = Array.from(selectPurpose.selectedOptions).map(option => option.value);
  const selectedMembers = Array.from(selectMember.selectedOptions).map(option => option.value);
  query.members = selectedMembers.join(',');
  query.purposes = selectedPurposes.join(',');
  query.orderBy = orderByFilter.value;
  query.orderType = orderTypeFilter.value;
  query.type = typeFilter.value;
  console.log(query);

  const queryParams = [
    query.startDate ? `startdate=${query.startDate}` : '',
    query.endDate ? `enddate=${query.endDate}` : '',
    query.type ? `type=${query.type}` : '',
    query.members ? `members=${query.members}` : '',
    query.purposes ? `purposes=${query.purposes}` : '',
    query.orderBy ? `orderBy=${query.orderBy}` : '',
    query.orderType ? `sortOrder=${query.orderType}` : ''
  ];

  const queryString = queryParams.filter(Boolean).join('&');

  fetch(app_url + 'transactions?' + queryString)
      .then(response => response.json())
      .then(data => {
          const tableBody = document.getElementById('table-body');
          tableBody.innerHTML = '';
          if(data.length > 0){
            data.forEach(transaction => {
              const row = document.createElement('tr');
              row.setAttribute('item-id', transaction.id);
              row.setAttribute('item-type', 'transactions');
              row.innerHTML = `
              <td>${transaction.t_date}</td>
              <td>${transaction.purpose.type ? 'Дохід' : 'Витрата'}</td>
              <td>${transaction.member.name}, ${transaction.member.age}</td>
              <td>${transaction.purpose.category}</td>
              <td>${transaction.sum}</td>
              <td><a href="#" class="delete-btn">Видалити</a></td>
              <td><a href="#" class="edit-ta-btn">Редагувати</a></td>
              `;
              tableBody.appendChild(row);
            });
          }
        })
      .catch(error => console.error('Error fetching data:', error));
  console.log(queryString);
});


$(document).ready(function() {
    const purposeSelect = $('#purpose-filter');

    fetch(app_url + 'purposes')
        .then(response => response.json())
        .then(data => {
            data.forEach(option => {
                const textContent = option.type ? `${option.category}, Дохід` : `${option.category}, Витрата`;
                $('<option>', {
                    value: option.id,
                    text: textContent
                }).appendTo(purposeSelect);
                $('<option>', {
                    value: option.id,
                    text: textContent
                }).appendTo(purposeTeSelect);
                $('<option>', {
                    value: option.id,
                    text: textContent
                }).appendTo(purposeTaSelect);
            });

            purposeSelect.selectize({
                plugins: ['remove_button'],
                delimiter: ',',
                persist: false,
                create: function(input) {
                    return {
                        value: input,
                        text: input
                    };
                }
            });
        })
        .catch(error => console.error('Error fetching purposes:', error));
});



$(document).ready(function() {
    const memberSelect = $('#family-member-filter');

    fetch(app_url + 'users')
        .then(response => response.json())
        .then(data => {
          data.forEach(option => {
              const textContent = `${option.name}, ${option.age}`;
                $('<option>', {
                    value: option.id,
                    text: textContent
                }).appendTo(memberSelect);
                $('<option>', {
                    value: option.id,
                    text: textContent
                }).appendTo(memberTaSelect);
                $('<option>', {
                    value: option.id,
                    text: textContent
                }).appendTo(memberTeSelect);
            });

            memberSelect.selectize({
                plugins: ['remove_button'],
                delimiter: ',',
                persist: false,
                create: function(input) {
                    return {
                        value: input,
                        text: input
                    };
                }
            });
        })
        .catch(error => console.error('Error fetching purposes:', error));
});


document.addEventListener('DOMContentLoaded', function () {
  fetch(app_url + 'users')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.getElementById('table-users-body');
          tableBody.innerHTML = '';
          data.forEach(user => {
              const row = document.createElement('tr');
              row.setAttribute('item-id', user.id);
              row.setAttribute('item-type', 'users');
              row.innerHTML = `
                  <td>${user.name}</td>
                  <td>${user.gender ? 'Ч' : 'Ж'}</td>
                  <td>${user.age}</td>
                  <td><a href="#" class="delete-btn">Видалити</a></td>
                  <td><a href="#" class="edit-member-btn">Редагувати</a></td>
              `;
              tableBody.appendChild(row);
          });
      })
      .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener('DOMContentLoaded', function () {
  fetch(app_url + 'purposes')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.getElementById('table-purposes-body');
          tableBody.innerHTML = '';
          data.forEach(purpose => {
              const row = document.createElement('tr');
              row.setAttribute('item-id', purpose.id);
              row.setAttribute('item-type', 'purposes');
              row.innerHTML = `
                  <td>${purpose.category}</td>
                  <td>${purpose.type ? 'Дохід' : 'Витрата'}</td>
                  <td><a href="#" class="delete-btn">Видалити</a></td>
                  <td><a href="#" class="edit-purpose-btn">Редагувати</a></td>
              `;
              tableBody.appendChild(row);
          });
      })
      .catch(error => console.error('Error fetching data:', error));
});


const sumInput = document.getElementById('sum-ta-add');
const dateInput = document.getElementById('date-ta');
const memberSelect = document.getElementById('family-member-t-add');
const purposeSelect = document.getElementById('purpose-t-add');
const addButton = document.querySelector('#add-ta');

addButton.addEventListener('click', function(event) {
    event.preventDefault();

    const sum = parseFloat(sumInput.value);
    const t_date = new Date(dateInput.value);
    const member_id = parseInt(memberSelect.value);
    const purpose_id = parseInt(purposeSelect.value);

    if (!isNaN(sum) && !isNaN(t_date.getTime()) && !isNaN(member_id) && !isNaN(purpose_id)) {
        const transaction = {
            sum: sum,
            t_date: t_date,
            member_id: member_id,
            purpose_id: purpose_id
        };

        console.log(transaction);
        fetch(app_url + 'transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Транзакцію додано успішно');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        formDeletion.classList.add('hidden');
        overlay.classList.add('hidden');
        location.reload();
    } else {
        alert('Заповніть всі поля');
    }
});


const categoryInput = document.getElementById('category');
const typeSelect = document.getElementById('purpose-type');
const addPurpose = document.querySelector('#add-purpose');

addPurpose.addEventListener('click', function(event) {
    event.preventDefault();

    const category = nameInput.value;
    const type = typeSelect.value === 'true';

    if (category.length > 1 && category.length < 200 && typeof type === 'boolean') {
        const purpose = {
            category: category,
            type: type
        };
        console.log(purpose);
        fetch(app_url + 'purposes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(purpose)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
          location.reload();  
          alert("Додано успішно");
            
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    } else {
        alert('Заповніть всі поля');
    }
});



const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('family-member-ta');
const addMember = document.querySelector('#add-member');

addMember.addEventListener('click', function(event) {
    event.preventDefault();

    const name = nameInput.value;
    const age = parseInt(ageInput.value);
    const gender = genderSelect.value === 'true' ? true : false;

    if (name.length > 0 && age) {
        const member = {
            name: name,
            age: age,
            gender: gender
        };

        console.log(member)
        fetch(app_url + 'users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(member)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
          location.reload();  
          alert("Додано успішно");
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    } else {
        alert('Заповніть всі поля');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-purpose-edit');
    const nameInput = document.getElementById('category-edit');
    const typeSelect = document.getElementById('type-purpose-edit');
    const saveButton = document.getElementById('save-purpose');
    
    saveButton.addEventListener('click', function(event) {
      event.preventDefault();
      const itemId = form.getAttribute('item-id');

        const name = nameInput.value;
        const type = typeSelect.value === 'true';

        if (name && name.length > 0 && typeof type === 'boolean' && itemId) {
            console.log(name);
            const purposeData = {
                category: name,
                type: type
            };

            fetch(`${app_url}purposes/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(purposeData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
              alert("Змінено успішно");
              location.reload();  
            })
            .catch(error => {
                alert('There was a problem with the fetch operation:'+ error);
            });
        } else {
            alert('Some fields are not valid.');
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-member-edit');
    const nameInput = document.getElementById('name-edit');
    const ageInput = document.getElementById('age-edit');
    const genderSelect = document.getElementById('family-member-ta-edit');
    const saveButton = document.querySelector('.save-member');

    saveButton.addEventListener('click', function(event) {
        event.preventDefault();

        const memberId = form.getAttribute('item-id');
        const name = nameInput.value;
        const age = parseInt(ageInput.value);
        const gender = genderSelect.value === 'true';

        if (memberId && name && typeof age === 'number' && typeof gender === 'boolean') {
            const memberData = {
                name: name,
                age: age,
                gender: gender
            };

            fetch(`${app_url}users/${memberId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(memberData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
              alert('Member updated');
              location.reload();  

            })
            .catch(error => {
                alert('There was a problem with the fetch operation:' + error);
            });
        } else {
            alert('Some fields are not valid.');
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-ta-edit');
    const memberSelect = document.getElementById('family-member-t-edit');
    const purposeSelect = document.getElementById('purpose-t-edit');
    const dateInput = document.getElementById('date-ta-edit');
    const sumInput = document.getElementById('sum-ta-edit');
    const saveButton = document.querySelector('.save-ta');

    saveButton.addEventListener('click', function(event) {
        event.preventDefault();

        const transactionId = form.getAttribute('item-id'); 
        const memberId = parseInt(memberSelect.value);
        const purposeId = parseInt(purposeSelect.value);
        const date = dateInput.value;
        const sum = parseFloat(sumInput.value);

        if (transactionId && memberId && purposeId && date && !isNaN(sum)) {
            const transactionData = {
                member_id: memberId,
                purpose_id: purposeId,
                t_date: date,
                sum: sum
            };

            console.log(transactionData);
            fetch(`${app_url}transactions/${transactionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
              alert('Transaction updated');
              location.reload();              
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        } else {
            alert('Some fields are not valid.');
        }
    });
});
