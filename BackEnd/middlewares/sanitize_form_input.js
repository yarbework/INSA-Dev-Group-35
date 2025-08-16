import sanitize from "mongo-sanitize"

export const sanitizeBody = (req, res, next) =>{
    req.body = sanitize(req.body)
    next()
}


const sanitizeObject = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  const result = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const safeKey = key.replace(/\$/g, "_").replace(/\./g, "_");


    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      result[safeKey] = sanitizeObject(value);
    } else if (typeof value === "string") {

      result[safeKey] = value.replace(/\$/g, "_").replace(/\./g, "_");
    } else {
      result[safeKey] = value;
    }
  }

  return result;
};

export const sanitizeMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);

    // check if there is an object inside the request body as we only expct strings
   if (typeof req.body.name === "object"){
    req.body.name = ""
  }
  if (typeof req.body.email === "object"){
    req.body.email = ""
  }

  if (typeof req.body.password === "object"){
    req.body.password = ""
  }

  if( typeof req.body.role === "object"){
    req.body.role = ""
  }



  req.sanitizedQuery = req.query ? sanitizeObject(req.query) : {};
  if (req.params) req.params = sanitizeObject(req.params);

  if (typeof req.params === "object") {
    req.params = {}
  }

  next();
};


