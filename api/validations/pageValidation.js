import Joi from "joi";
import joiObjectid from "joi-objectid";

const joiObjectId = joiObjectid(Joi);

const getPageByIdSchema = {
  query: Joi.object().keys({
    pageId: joiObjectId().required(),
  }),
}

const createPageSchema = {
  body: Joi.object().keys({
    title: Joi.string().required().invalid(''),
    icon: Joi.string().invalid(''),
    owner: joiObjectId().required(),
    isFavPage: Joi.boolean(),
    sharedUser: joiObjectId(),
    content: Joi.string().required().invalid(''),
  }),
}

const updatePageSchema = {
  body: Joi.object().keys({
    pageId: joiObjectId(),
    title: Joi.string().invalid(''),
    icon: Joi.string().invalid(''),
    isFavPage: Joi.boolean(),
    sharedUser: joiObjectId(),
    content: Joi.string().invalid(''),
  }),
}

const deletePageSchema = {
  query: Joi.object().keys({
    pageId: joiObjectId().required(),
  }),
}

export { createPageSchema, getPageByIdSchema, updatePageSchema, deletePageSchema }