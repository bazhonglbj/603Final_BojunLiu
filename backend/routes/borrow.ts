import express, { Request, Response, NextFunction } from 'express';
import { Book, Borrow, User } from '../model';

var router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { current, pageSize, book, user, status } = req.query;
  const data = await Borrow.find({
    ...(book && { book }),
    ...(user && { user }),
    ...(status && { status }),
  })
    .sort({ updatedAt: -1 })
    .skip((Number(current) - 1) * Number(pageSize))
    .populate(['user', 'book']);

  const total = await Borrow.countDocuments({
    ...(book && { book }),
    ...(user && { user }),
    ...(status && { status }),
  });
  res.status(200).json({ message: true, data, total });
});

router.post('/',async (req: Request, res: Response) => {
  const { book, user } = req.body;
  const borrow = new Borrow(req.body);
  const bookData = await Book.findOne({ _id: book });
  await borrow.save();
  await Book.findByIdAndUpdate(bookData._id, { stock: bookData.stock - 1 });
  res.status(200).json({ success: true });
});

router.get('/:id', async (req: Request, res: Response) => {
  const data = await Borrow.findOne({ _id: req.params.id });
  if (data) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(500).json({ message: 'Borrow not exists' });
  }
});
router.put('/:id', async (req: Request, res: Response) => {});

router.delete('/:id', async (req: Request, res: Response) => {
  const borrow = await Borrow.findById(req.params.id);
  if (borrow) {
    await Borrow.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ message: 'Borrow not exists' });
  }
});

router.put('/back/:id', async (req: Request, res: Response) => {
  const borrow = await Borrow.findOne({ _id: req.params.id });
  if (borrow) {
    if (borrow.status === 'off') {
      res.status(500).json({ message: 'Already returned' });
    } else {
      borrow.status = 'off';
      borrow.backAt = Date.now();
      await borrow.save();
      
      const book = await Book.findOne({ _id: borrow.book });

      if (book) {
        book.stock += 1;
        await book.save();
      } else {
        res.status(500).json({ message: 'Book not exists' });
      }

      res.status(200).json({ success: true });
    }
  } else {
    res.status(500).json({ message: 'Borrow not exists' });
  }
});

export default router;