// Description: This function is used to catch the errors in the async functions and pass them to the error handling middleware.

const catchAsync = (fn) => (req, res, next)=>{
    Promise.resolve(fn(req, res, next)).catch((err)=>next(err));
}

module.exports = catchAsync;