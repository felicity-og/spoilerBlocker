chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (tab.url?.startsWith("chrome://")) return undefined;

  if (tab.active && changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      files: ['script.js'],
      target: {tabId: tab.id}
    })
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'insert'){
      let insert_request = insert_records(request.payload);

      insert_request.then(res => {
        chrome.runtime.sendMessage({
          message: 'insert_success',
          payload: res
        });
      });
    } else if (request.message === 'get'){
      let get_request = get_record(request.payload);

      get_request.then(res => {
        chrome.runtime.sendMessage({
          message: 'retrieve_success',
          payload: res
        });
      });
    } else if (request.message === 'update'){
      let update_request = update_record(request.payload);

      update_request.then(res => {
        chrome.runtime.sendMessage({
          message: 'update_success',
          payload: res
        });
      });
    }else if (request.message === 'delete'){
      let delete_request = delete_record(request.payload);

      delete_request.then(res => {
        chrome.runtime.sendMessage({
          message: 'delete_success',
          payload: res
        });
      });
    }
});

let roster =[{
    "name":"The Vampire Diaries",
    "character": "Elena",
    "email": "frosty284@ai.com"
},
{
  "name":"Game of Thrones",
  "character": "Jon Snow",
  "email": "trishab4@reed.com"
},
{
  "name":"The Rookie",
  "character": "Tim Bradford",
  "email": "summnerjohnson@ainew.org"
},
{
  "name":"Dune",
  "character": "Lisan al- gaib",
  "email": "badbqueen456@pll.org"
},
]

let db = null;

function create_database() {
    const request = indexedDB.open('spoilerDB');

    request.onerror = function (event) {
        console.log("Problem opening DB.");
    }

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        let objectStore = db.createObjectStore('roster', {
            keyPath: 'email'
        });

        objectStore.transaction.oncomplete = function (event) {
            console.log("ObjectStore Created.");
        }
    }

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("DB OPENED.");
        //insert_records(roster);

        db.onerror = function (event) {
            console.log("FAILED TO OPEN DB.")
        }
    }
}

// populate the database
function insert_records(records) {
  if (db) {
      const insert_transaction = db.transaction("roster", "readwrite");
      const objectStore = insert_transaction.objectStore("roster");

      return new Promise((resolve, reject) => {
          insert_transaction.oncomplete = function () {
              console.log("ALL INSERT TRANSACTIONS COMPLETE.");
              resolve(true);
          }

          insert_transaction.onerror = function () {
              console.log("PROBLEM INSERTING RECORDS.")
              resolve(false);
          }

          records.forEach(person => {
              let request = objectStore.add(person);

              request.onsuccess = function () {
                  console.log("Added: ", person);
              }
          });
      });
  }
}
//When we get messages to add, get, update, or delete from the foreground.
function get_record(email) {
  if (db) {
      const get_transaction = db.transaction("roster", "readonly");
      const objectStore = get_transaction.objectStore("roster");

      return new Promise((resolve, reject) => {
          get_transaction.oncomplete = function () {
          console.log("ALL GET TRANSACTIONS COMPLETE.");
          }

          get_transaction.onerror = function () {
          console.log("PROBLEM GETTING RECORDS.")
          }

          let request = objectStore.get(email);

          request.onsuccess = function (event) {
          resolve(event.target.result);
          }
      });
  }
}

function update_record(record) {
  if (db) {
      const put_transaction = db.transaction("roster", "readwrite");
      const objectStore = put_transaction.objectStore("roster");

      return new Promise((resolve, reject) => {
          put_transaction.oncomplete = function () {
              console.log("ALL PUT TRANSACTIONS COMPLETE.");
              resolve(true);
          }

          put_transaction.onerror = function () {
              console.log("PROBLEM UPDATING RECORDS.")
              resolve(false);
          }

          objectStore.put(record);
      });
  }
}

function delete_record(email) {
  if (db) {
      const delete_transaction = db.transaction("roster", 
      "readwrite");
      const objectStore = delete_transaction.objectStore("roster");

      return new Promise((resolve, reject) => {
          delete_transaction.oncomplete = function () {
              console.log("ALL DELETE TRANSACTIONS COMPLETE.");
              resolve(true);
          }

          delete_transaction.onerror = function () {
              console.log("PROBLEM DELETE RECORDS.")
              resolve(false);
          }

          objectStore.delete(email);
      });
  }
}

create_database();