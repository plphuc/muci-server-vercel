import Joi from "joi";

const addCoverSchema = {
  body: Joi.object().keys({
    file: Joi.binary().required()
  })
}

const removeCoverSchema = {
  query: Joi.object().keys({
    coverId: Joi.string().required(),
    pageId: Joi.string().required()
  })
}

export { addCoverSchema, removeCoverSchema }