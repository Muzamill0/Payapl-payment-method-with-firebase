const express = require('express');
const adminRoute = require('./adminRoutes');
const authRoute = require('./authRoutes');
const paymentRoute = require('./paymentRoutes');

const router = express.Router();


const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/payment',
    route: paymentRoute,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

module.exports = router;