# DEVTINDER APIs

### authRouter
- POST /signup
- POST /login
- POST /logout

### profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password   //forgot password api

### connectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

### userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed  ---get profiles of other users
Status - IGNORE, INTERESTED, ACCEPTED, REJECTED