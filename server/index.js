const express = require('express');
const app = express();
const host = 'localhost'; // Server erreichbar unter 'localhost/8080'
const port = 8080;

app.use('/', express.static('../gruppe'));
app.use('/bahram', express.static('../z_bahram'));
app.use('/jannik', express.static('../z_jannik'));
app.use('/sascha', express.static('../z_sascha'));
app.use('/serhii', express.static('../z_serhii'));
app.use('/steffen', express.static('../z_steffen'));

app.listen(port, host, () => {
	console.log(`Server ready at http://${host}:${port}`);
});
