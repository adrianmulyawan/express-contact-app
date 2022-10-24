// # Import Express 
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const morgan = require('morgan');

// # Jalankan express 
const app = express();

// # Buat port untuk menjalankan express 
const port = 3000;

// # Beritahu Express Untuk Menggunakan EJS (Set View Engine)
app.set('view engine', 'ejs');

// # Gunakan Express EJS Layout
// # Salah satu third-party middleware
app.use(expressLayout);

// # Jalankan Third-part middleware morgan 
app.use(morgan('dev'));

// # Built-in Middleware (express.static)
app.use(express.static('public'));

// # Application Level Middleware 1
app.use((req, res, next) => {
    console.info("Time: ", Date.now());
    next();
});

// # Application Level Middleware 2
app.use((req, res, next) => {
    console.info("Ini adalah middleware ke-2!");
    next();
});

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
    // > Gunakan Templating Engine EJS 
    res.render('contact', {
        layout: 'partials/main-layout',
        title: 'Contact',
    });
});

// # Route Express: Route Halaman /product
app.get('/product/:idProd', (req, res) => {
    // # Tangkap Parameter id & query
    // => parameter: menggunakan properti req.params.nama_parameter
    // => query: menggunakan properti req.query.nama_query
    res.send(`Product with ID:  ${req.params.idProd} <br> Category ID: ${req.query.category}`);
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