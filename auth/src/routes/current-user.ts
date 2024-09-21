import express from 'express';
const router = express.Router();

router.get( '/api/users/currentuser', (req, res) => {
res.send('Current user-dhdhdh')
} );

export { router as currentUserRouter };