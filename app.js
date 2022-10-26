// # Import Express 
const express = require('express');
const multer = require('multer');
const expressLayout = require('express-ejs-layouts');
const { loadContacts, findContact, addContact, checkDuplicate, deleteContact } = require('./utils/contacts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');

// # Jalankan express 
const app = express();
// # Jalankan multer
const upload = multer();

// # Buat port untuk menjalankan express 
const port = 3000;

// # Beritahu Express Untuk Menggunakan EJS (Set View Engine)
app.set('view engine', 'ejs');

// # Gunakan Express EJS Layout
// # Salah satu third-party middleware
app.use(expressLayout);
// # Built-in Middleware (express.static)
app.use(express.static('public'));
// # Midlleware Menangkap Data Dari Inputan Form (url encoded)
// app.use(express.urlencoded({ extended: true }));
app.use(upload.array());

// # Konfigurasi Flash
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// # Route Express: Route Halaman Utama
app.get('/', (req, res) => {
    // > Gunakan Templating Engine EJS 
    const mahasiswa = [{
            nama: "Adrian Mulyawan",
            email: "adrianmulyawan666@gmail.com"
        },
        {
            nama: "Mandalika Ayusti",
            email: "manda.pumkins@gmail.com"
        },
        {
            nama: "Akbar Suseno",
            email: "akbarsuseno@gmail.com"
        },
    ];

    // > Kita bisa kirim data kedalam halaman html-nya 
    // => dengan memberikan object di parameter ke-2 method res.render
    res.render('index', {
        layout: 'partials/main-layout',
        nama: 'Adrian Mulyawan',
        title: 'Home',
        mahasiswa: mahasiswa,
    });
});

// # Route Express: Route Halaman /about
app.get('/about', (req, res) => {
    // > Gunakan Templating Engine EJS 
    res.render('about', {
        layout: 'partials/main-layout',
        title: 'About',
    });
});

// # Route Express: Route Halaman /contact 
app.get('/contact', (req, res) => {
    // Menampung seluruh contacts (from data/contacts.json)
    const contacts = loadContacts();

    // > Gunakan Templating Engine EJS 
    res.render('contact', {
        layout: 'partials/main-layout',
        title: 'Contact',
        contacts: contacts,
        msg: req.flash('msg'), // tangkap flash message
    });
});

// # Route Express: Route Halaman Tambah Contact 
app.get('/contact/add', (req,res) => {
    res.render('add-contact', {
        layout: 'partials/main-layout',
        title: 'Add New Contact',
    })
});

// # Route Express: Proses Tambah Data Contact 
app.post('/contact', [
    // Validation => using express-validator
    // > Custom Validation
    body('nama').custom((value) => {
        const duplicate = checkDuplicate(value);
        if (duplicate) {
            throw new Error('Nama Kontak Telah Terdaftar');
        }
        return true;
    }),
    // > Validation Email
    check('email', 'Email Tidak Valid').isEmail(),
    // > Validation Phone Number
    check('ponsel', 'No Handphone Tidak Valid').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: error.array() });
        res.render('add-contact', {
            layout: 'partials/main-layout',
            title: 'Add New Contact',
            errors: errors.array(),
        });
    } else {
        // req.body => mengambil data dari inputan form
        addContact(req.body);

        // Kirim flash message
        req.flash('msg', 'Data Kontak Berhasil Ditambahkan');

        // Setelah berhasil simpan data kontak kita redirect
        // redirect kehalaman /contact
        res.redirect('/contact');
    }
});

// # Route Express: Delete Contact
app.get('/contact/delete/:nama', (req, res) => {
    // Cek Kontak
    const contact = findContact(req.params.nama);

    // Jika kontak tidak ada
    if (!contact) {
        res.status(404);
        res.send('<h1>Sorry, Kontak Tidak Ditemukan!</h1>');
    } else {
        deleteContact(req.params.nama);
        // Kirim flash message
        req.flash('msg', 'Data Kontak Berhasil Dihapus');

        // Setelah berhasil simpan data kontak kita redirect
        // redirect kehalaman /contact
        res.redirect('/contact');
    }
});

// # Route Express: Halaman Detail Contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);

    res.render('detail',{
        layout: 'partials/main-layout',
        title: 'Detail Contact',
        contact,
    });
});


// Middleware (Dijalankan Setiap Saat): Dijalankan ketika yang diakses bukan route berikut
// => / 
// => /about
// => /contact
// => /product/{id}
app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>404: Not Found</h1>');
});

// # Akan dijalankan ketika express dijalankan
app.listen(port, () => {
    console.info(`Server is listening on port ${port}`);
});