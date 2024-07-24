/**
 * Create a function instance
 * @param fn {function} Receive a promise function, execute and call next if catch err
 }} fn 
 * @returns nothing
 */
 const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res , next)).catch(err => next(err))
} 

export default catchAsync