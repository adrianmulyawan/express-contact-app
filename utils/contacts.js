const fs = require('fs');

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

module.exports = {
    loadContacts,
};