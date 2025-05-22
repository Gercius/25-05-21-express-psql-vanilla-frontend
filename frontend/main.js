const API_URI = "https://two5-05-21-express-psql-vanilla-frontend.onrender.com/api/users";

(async function main() {
    const users = await getData();
    populateTableData(users);
    handleUserSwitching(users);
})();

// user data gavimas
async function getData() {
    try {
        const response = await fetch(API_URI);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json.users;
    } catch (error) {
        console.error(error.message);
    }
}

// user data sumetimas i lentele
function populateTableData(users) {
    const tbody = document.querySelector("tbody");

    users.forEach((user) => {
        const tr = document.createElement("tr");
        const idTd = `<td>${user.id}</td>`;
        const nameTd = `<td>${user.name}</td>`;
        const surnameTd = `<td>${user.surname}</td>`;
        const birthDateTd = `<td>${user.birth_date.slice(0, 10)}</td>`;

        tr.innerHTML = idTd + nameTd + surnameTd + birthDateTd;
        tbody.appendChild(tr);
    });
}

// useriu switchinimas mygtukais
function handleUserSwitching(users) {
    const nameInput = document.querySelector(".show-user-form [name='name']");
    const surnameInput = document.querySelector(".show-user-form [name='surname']");
    const birthDateInput = document.querySelector(".show-user-form [name='birth_date']");

    let currentUser = 0;
    renderCurrentUser();

    const prevBtn = document.querySelector(".show-user-form .prev-btn");
    const nextBtn = document.querySelector(".show-user-form .next-btn");

    prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentUser === 0) return;

        currentUser--;
        nextBtn.disabled = false;
        if (currentUser === 0) e.target.disabled = true;

        renderCurrentUser();
    });

    nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentUser === users.length - 1) return;

        currentUser++;
        prevBtn.disabled = false;
        if (currentUser === users.length - 1) e.target.disabled = true;

        renderCurrentUser();
    });

    function renderCurrentUser() {
        surnameInput.value = users[currentUser].surname;
        nameInput.value = users[currentUser].name;
        birthDateInput.value = users[currentUser].birth_date.slice(0, 10);
    }
}

// user pridejimas
const addUserForm = document.querySelector(".new-user-from");
addUserForm.addEventListener("submit", async (e) => {
    const formData = new FormData(addUserForm);
    // todo - figure out how this magic shit works
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(API_URI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to submit data");
        }

        const result = await response.json();
        console.log("Server response:", result);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
        console.error(err.message);
    }
});
