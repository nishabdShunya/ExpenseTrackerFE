const form = document.querySelector('#expense-form');
const amountInput = document.querySelector('#amount');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const btn = document.querySelector('.btn');
const expenses = document.querySelector('#expenses');

form.addEventListener('submit', addExpense);

function addExpense(event) {
    event.preventDefault();
    if (amountInput.value && descriptionInput.value && categoryInput.value) {
        const expense = {
            amt: amountInput.value,
            dsp: descriptionInput.value,
            ctg: categoryInput.value
        }

        axios.post('http://localhost:3000/expenses/add-expense', expense)
            .then((response) => {
                display(response.data);
            }).catch((err) => {
                console.log(err);
            });

        // Clearing the Fields
        amountInput.value = '';
        descriptionInput.value = '';
        categoryInput.value = '';
    }
    else {
        alert('Please enter all the fields');
    }
};

function display(expenseObj) {
    const expenseItem = `
    <li id="${expenseObj.id}">
        &#x20B9;${expenseObj.amount} spent on ${expenseObj.category} (${expenseObj.description})
        <div>
            <button class="btn edit-btn" onClick="editExpense('${expenseObj.id}', '${expenseObj.amount}', '${expenseObj.description}', '${expenseObj.category}')">Edit</button>
            <button class="btn del-btn" onClick="deleteExpense('${expenseObj.id}')">Delete</button>
        </div>
    </li>`;
    expenses.innerHTML = expenses.innerHTML + expenseItem;
};

function editExpense(id, amount, description, category) {
    deleteExpense(id);
    amountInput.value = amount;
    descriptionInput.value = description;
    categoryInput.value = category;
};

function deleteExpense(expenseId) {
    axios.delete('http://localhost:3000/expenses/' + expenseId)
        .then(response => {
            console.log(response.data.message);
        })
        .catch(err => console.log(err));
    stopDisplay(expenseId);
};

function stopDisplay(expenseId) {
    const expenseToDelete = document.getElementById(expenseId);
    expenses.removeChild(expenseToDelete);
};

window.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    axios.get('http://localhost:3000/expenses')
        .then(response => {
            response.data.forEach(expense => {
                display(expense);
            });
        })
        .catch(err => console.log(err));
});