const formattedPageObject = (page) => {
  const {_id: id, ...rest} = page._doc;
  return ({
  id: page._id,
  ...rest
})}

export default formattedPageObject;