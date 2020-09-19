import { Router } from "express";
import { Item, Category } from "../collections";
import { validateAdmin } from "../middleware/validateAdmin";
import { JWTRequest } from "../models/JWTRequest";

const storeRouter = Router();

storeRouter.get("/", async (req, res) => {
  const items = await Item.find().exec();

  const categories = await Category.find().exec();

  res.send({ success: true, categories, items });
});

storeRouter.post("/item", validateAdmin(), async (req, res) => {
  const newItem = req.body;

  try {
    const itemId = await Item.addItem(newItem);

    res.send({ success: true, itemId });
  } catch (error) {
    res.status(401).send({ success: false, error: error.message });
  }
});

storeRouter.put("/item/:itemId", validateAdmin(), async (req, res) => {
  const updatedItem = req.body;

  const { itemId } = req.params;

  try {
    await Item.updateItem(updatedItem, itemId);

    res.send({ success: true, msg: "Item updated." });
  } catch (error) {
    res.status(401).send({ success: false, error: error.message });
  }
});

storeRouter.delete("/item/:itemId", validateAdmin(), async (req, res) => {
  const { itemId } = req.params;

  try {
    await Item.removeItem(itemId);

    res.send({ success: true, msg: "Item removed." });
  } catch (error) {
    res.status(401).send({ success: false, error: error.message });
  }
});

storeRouter.post("/category", validateAdmin(), async (req, res) => {
  const { name } = req.body;

  try {
    const categoryId = await Category.addCategory(name);

    res.send({ success: true, categoryId });
  } catch (error) {
    res.status(401).send({ success: false, error: error.message });
  }
});

export { storeRouter };
