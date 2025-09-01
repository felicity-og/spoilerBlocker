chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'insert_success'){
      if (request.payload){
        document.querySelectorAll('.add_rec_input').forEach(el => el.value = '');
      } 
    } else if (request.message === 'retrieve_success'){
        if (request.payload){
            document.querySelectorAll('.updated-details').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.search-label').forEach(el => el.style.display = '');
            document.querySelectorAll('.details').forEach(el => el.style.display = '');
            document.getElementById('delete-record').style.display = '';
            document.getElementById('edit-record').style.display = '';
            //
            document.getElementById('edit-record').innerText = "Edit Record";
            document.getElementById('details-name').innerText = request.payload.name;
            document.getElementById('details-character').innerText = request.payload.character;
            document.getElementById('details-email').innerText = request.payload.email;
        } else{
            console.log("No record found.");
        }
    } else if (request.message === 'update_success'){
        if (request.payload){
            document.getElementById('edit-record').innerText = "Change saved...";
            
            setTimeout(() => {
                document.getElementById('edit-record').disabled = false;
                document.getElementById('edit-record').innerText = "Edit Record";
                document.getElementById('delete-record').style.display = '';
            }, 1500);

            document.querySelectorAll('.updated-details').forEach(el => el.style.display = 'none');

            document.querySelectorAll('.details').forEach(el => el.style.display = 'none');
            document.getElementById('details-name').innerText = document.getElementById('update-name');
            document.getElementById('details-character').innerText = document.getElementById('update-character');
        }
    }else if (request.message === 'delete_success'){
        if (request.payload){
            document.querySelectorAll('.search-label').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.updated-details').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.details').forEach(el => el.style.display = 'none');
            document.getElementById('delete-record').style.display = 'none';
            document.getElementById('edit-record').style.display = 'none';
        }
    }
});

document.querySelectorAll('.search-label').forEach(el => el.style.display = 'none');
document.querySelectorAll('.updated-details').forEach(el => el.style.display = 'none');
document.querySelectorAll('.details').forEach(el => el.style.display = 'none');
document.getElementById('delete-record').style.display = 'none';
document.getElementById('edit-record').style.display = 'none';

//add a record
document.getElementById('add_form').addEventListener('submit', event => {
    event.preventDefault();

    const form_data = new FormData(document.getElementById('add_form'));

    chrome.runtime.sendMessage({
        message: 'insert',
        payload: [{
            "name": form_data.get('name'),
            "character": form_data.get('character'),
            "email": form_data.get('email'),
        }]
    });
});
//search for record
document.getElementById('search_for_record').addEventListener('click', event => {
    event.preventDefault();

    let search_term = document.getElementById('search_term').value;

    chrome.runtime.sendMessage({
        message: 'get',
        payload: search_term
    });
});
//edit and save record
document.getElementById('edit-record').addEventListener('click', event => {
    event.preventDefault();

    if (document.getElementById('edit-record').innerText === "Edit Record") {
        document.querySelectorAll('.details').forEach((el, i) => i != 2 ? el.style.display = 'none': null);

        document.querySelectorAll('.updated-details').forEach(el => el.style.display = '');

        document.getElementById('update-name').value = document.getElementById('details-name').innerText;
        document.getElementById('update-character').value = document.getElementById('details-character').innerText;

        document.getElementById('edit-record').innerText = "Save Changes";
        document.getElementById('delete-record').style.display = 'none';

    } else if (document.getElementById('edit-record').innerText === "Save Changes"){
        document.getElementById('edit-record').disabled = true;

        chrome.runtime.sendMessage({
            message: 'update',
            payload: {
                "name": document.getElementById('update-name').value,
                "character": document.getElementById('update-character').value,
                "email": document.getElementById('details-email').innerText
            }
        });
    }
});

//delete record
document.getElementById('delete-record').addEventListener('click', event => {
    event.preventDefault();

    chrome.runtime.sendMessage({
        message: 'delete',
        payload: document.getElementById('details-email').innerText
    });
});
