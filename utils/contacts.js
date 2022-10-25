const fs = require('fs');
const { saveContact } = require('../../9ContactApp/contacts');

// Cek Folder "data/" Jika Tidak Ada Buat Folder-nya
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    // > Buat folder baru dengan nama sesuai dengan variable dirPath
    fs.mkdirSync(dirPath);
}

// Cek File "contacts.json" Jika Tidak Ada Buat File-nya
const fileName = './data/contacts.json';
if (!fs.existsSync(fileName)) {
    // > Buat file baru dengan nama sesuai dengan variable fileName
    // > Didalam method ini kita isikan:
    // => nama file, isi file, format teks
    fs.writeFileSync(fileName, "[]", "utf-8");
}

// Method Yang Menangani Pembacaan Contact
const loadContacts = () => {
    const fileData = JSON.parse(fs.readFileSync('data/contacts.json'));
    return fileData;
};

// Method Yang Menampilkan Detail Contact (Berdasarkan Nama)
const findContact = (nama) => {
    const contacts = loadContacts();

    const contact = contacts.find((contact) => {
        return contact.nama.toLowerCase() === nama.toLowerCase()
    });

    return contact;
}

// Menuliskan / Meninpa File contacts.json Dengan Data Baru
const saveContacts = (contacts) => {
    // Ubah data contacts.json menjadi string
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts, null, 2));
};

// Method Menambahkan Data Contact Baru
const addContact = (contact) => {
    // Ambil semua file contacts.json dan simpan didalam variable contacts 
    // Bentuknya adalah object
    const contacts = loadContacts();

    // Validation 
    // 1. Cek Nama 
    // 2. Cek Email
    // 3. Cek Ponsel

    // Tambah objek baru kedalamnya
    contacts.push(contact);

    // Timpa kedalam method saveContacts()
    saveContacts(contacts);
};

module.exports = {
    loadContacts,
    findContact,
    addContact,
};