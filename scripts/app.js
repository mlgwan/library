let myLibrary = [];
const bookHolder = document.getElementById("book-holder");
const newBookBtn = document.getElementById("new-book-btn");
const overlay = document.getElementById("overlay");
let currentId = 0;

document.addEventListener("DOMContentLoaded", getLocalStorage);
newBookBtn.addEventListener("click", showOverlay);
overlay.children[0].children[0].addEventListener("click", hideOverlay);
overlay.children[0].children[19].addEventListener("click", ()=>{
    const overlayArr = Array.from(overlay.children[0].children);
    let title = overlayArr[4].value;
    let author = overlayArr[7].value;
    let pages = parseInt(overlayArr[10].value);
    let read = false;
    if(overlayArr[13].checked){
        read = true;
    }
    else{
        read = false;
    }
    let book = new Book(title, author, pages, read)
    addBookToLibrary(book);
    hideOverlay();
    render();
});


function Book(title,author,pages,read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = createId();
    this.info = function(){
        return (read) ? `${title} by ${author}, ${pages} pages, alread read` : `${title} by ${author}, ${pages} pages, not read yet`;
    }
}

Book.prototype.markAsRead = markAsRead;

function addBookToLibrary(book){
    myLibrary.push(book);
    saveToLocalStorage(book);
}

function render(){

    bookHolder.textContent = "";

    myLibrary.forEach(book=>{
        const bookItem = document.createElement("article");
        bookItem.classList = "book-item";
        bookItem.id = book.id;
        const readBtn = document.createElement("button");
        const removeBtn = document.createElement("button");

        let title = document.createElement("strong");
        let author = document.createElement("span");
        let pages = document.createElement("span");
        let read = document.createElement("span");

        title.textContent = book.title;
        bookItem.appendChild(title);

        author.textContent = book.author;
        bookItem.appendChild(author);

        pages.textContent = book.pages + " pages";
        bookItem.appendChild(pages);

        if (book.read){
            markAsRead(read, readBtn, bookItem.id);
        }
        else {
            read.textContent = "Unread";
            readBtn.textContent = "Read";
            readBtn.addEventListener("click", ()=>markAsRead(read, readBtn, bookItem.id));
        }
        bookItem.appendChild(read);
        bookItem.appendChild(readBtn); 
        removeBtn.textContent = "Remove";
        removeBtn.id = "remove-btn"
        removeBtn.addEventListener("click", ()=>removeBook(bookItem));
        bookItem.appendChild(removeBtn);

        bookHolder.appendChild(bookItem);
    });
}

function markAsRead(field, button, bookToMark){
    field.textContent = "Read";
    button.textContent = "Read";
    button.disabled = true;

    
    myLibrary.find(book => book.id == bookToMark).read = true;

    setLocalStorage();
}

function removeBook(bookToRemove){
    let bookHolderArr = Array.from(bookHolder.children);
    let elementToRemove = bookHolderArr.find(book=>book===bookToRemove);
    elementToRemove.remove();

    myLibrary = myLibrary.filter(book => book.id != bookToRemove.id);

    setLocalStorage();
}

function createId(){
    return currentId++;
}

function showOverlay() {
    document.getElementById("overlay").style.display = "block";
}
  
function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
} 

function getLocalStorage(){
    let books;
    if(localStorage.getItem("books") === "[]" || localStorage.getItem("books") === null){
        books = [];
        currentId = 0;
    }
    else{
        books = JSON.parse(localStorage.getItem("books"));
        currentId = books[books.length-1].id + 1;
    }

    books.forEach(book=>myLibrary.push(book));
    render();
    myLibrary = books;
}

function saveToLocalStorage(book) {
    let books;
    if(localStorage.getItem("books") === null){
        books = [];
    }
    else{
        books = JSON.parse(localStorage.getItem("books"));
    }

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
}

function setLocalStorage(){
    let books = myLibrary;
    localStorage.setItem("books", JSON.stringify(books));
}