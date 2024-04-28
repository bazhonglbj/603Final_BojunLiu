import express, { Request, Response, NextFunction } from "express";
import { Category } from "../model";

var router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const { name, level, pageSize=20, current=1 } = req.query;
  const data = await Category.find({
    ...(name && { name }),
    ...(level && { level }),
  })
    .skip((Number(current) - 1) * Number(pageSize))
    .populate("parent")
    .limit(Number(pageSize));
  const total = await Category.countDocuments({
    ...(name && { name }),
    ...(level && { level }),
  });
  return res.status(200).json({ data, total });
});

router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = new Category(req.body);
  const oldCategory = await Category.findOne({ name });

  if (!oldCategory) {
    await category.save();
    return res.status(200).json({ success: true });
  } else {
    return res.status(500).json({ message: "Category exists" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.findByIdAndDelete({
      _id: req.params.id,
    });
    return res.status(200).json({ success: true });
  } else {
    return res.status(500).json({ message: "Category not exists" });
  }
});
router.get("/:id", async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.status(200).json({ data: category, success: true });
  } else {
    res.status(500).json({ message: "Category not exists" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body);

  if (category) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ message: "Category not exists" });
  }
});

export default router;