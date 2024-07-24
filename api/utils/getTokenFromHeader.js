export default function getTokenFromHeader(req) {
  return req.headers.authorization.split(' ')[1]
}