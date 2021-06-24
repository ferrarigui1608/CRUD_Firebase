const modalWrapper = document.querySelector('.modal-wrapper');

const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');
const btnAdd = document.querySelector('.btn-add');


const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');


const tableUsers = document.querySelector('.table-users');

let id;

// Create element and render users
const renderUser = doc => {
  const tr = `
    <tr class="dados" data-id='${doc.id}'>
      <td>${doc.data().firstName}</td>
      <td>${doc.data().lastName}</td>
      <td>${doc.data().phone}</td>
      <td>${doc.data().email}</td>
       <td>
         <button class="btn btn-edit">Editar</button>
         <button class="btn btn-delete">Deletar</button>
       </td>
    </tr>
  `;
  tableUsers.insertAdjacentHTML('beforeend', tr);

  // Editar usuário
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  btnEdit.addEventListener('click', function editarUsuario() {
    editModal.classList.add('modal-show');

    id = doc.id;
    editModalForm.firstName.value = doc.data().firstName;
    editModalForm.lastName.value = doc.data().lastName;
    editModalForm.phone.value = doc.data().phone;
    editModalForm.email.value = doc.data().email;

  });

  // Deletar usuario
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener('click', function deletarUsuario(){
    db.collection('users').doc(`${doc.id}`).delete()
    /*.then(() => {
      console.log('Document succesfully deleted!');
    }).catch(err => {
      console.log('Error removing document', err);
    });*/
  });

}

// Adicionar Usuarios
btnAdd.addEventListener('click', function AddUsers() {
  addModal.classList.add('modal-show');

  addModalForm.firstName.value = '';
  addModalForm.lastName.value = '';
  addModalForm.phone.value = '';
  addModalForm.email.value = '';
});

// Remove o formulario de adicionar usuarios clicando em qualque lugar vazio.
window.addEventListener('click', function removeModal(event) {
  if (event.target === addModal) {
    addModal.classList.remove('modal-show');
  }
  if (event.target === editModal) {
    editModal.classList.remove('modal-show');
  }
});

// Real time listener
db.collection('users').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      renderUser(change.doc);
    }
    if (change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
    }
    if (change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
      renderUser(change.doc);
    }
  })
})

// Click submit in add modal
addModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('users').add({
    firstName: addModalForm.firstName.value,
    lastName: addModalForm.lastName.value,
    phone: addModalForm.phone.value,
    email: addModalForm.email.value,
  });
  modalWrapper.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('users').doc(id).update({
    firstName: editModalForm.firstName.value,
    lastName: editModalForm.lastName.value,
    phone: editModalForm.phone.value,
    email: editModalForm.email.value,
  });
  editModal.classList.remove('modal-show');

});