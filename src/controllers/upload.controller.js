import { success, error } from "../utils/response.js";

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, "No file uploaded", 400);
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    return success(res, {
      data: dataUrl,
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    }, "Image uploaded");
  } catch (err) {
    next(err);
  }
};