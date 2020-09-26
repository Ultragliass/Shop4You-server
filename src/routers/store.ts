import { Router } from "express";
import { Item, Category, Order } from "../collections";
import { validateAdmin } from "../middleware/validateAdmin";

const storeRouter = Router();

storeRouter.get("/", async (req, res) => {
  const items = await Item.find().exec();

  const categories = await Category.find().exec();

  const orders = await Order.find().exec();

  res.send({ success: true, categories, items, numOfOrders: orders.length });
});

storeRouter.post("/item", validateAdmin(), async (req, res) => {
  const newItem = req.body;

  try {
    const itemId = await Item.addItem(newItem);

    res.send({ success: true, itemId });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

storeRouter.put("/item/:itemId", validateAdmin(), async (req, res) => {
  const updatedItem = req.body;

  const { itemId } = req.params;

  try {
    await Item.updateItem(updatedItem, itemId);

    res.send({ success: true, msg: "Item updated." });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

storeRouter.delete("/item/:itemId", validateAdmin(), async (req, res) => {
  const { itemId } = req.params;

  try {
    await Item.deleteItem(itemId);

    res.send({ success: true, msg: "Item removed." });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
});

storeRouter.post("/category", validateAdmin(), async (req, res) => {
  const { name } = req.body;

  try {
    const categoryId = await Category.addCategory(name);

    res.send({ success: true, categoryId });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
});

export { storeRouter };
