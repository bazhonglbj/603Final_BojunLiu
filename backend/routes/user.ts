import express, { Request, Response } from 'express';
import { User } from '../model';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { current = 1, pageSize = 20, name,status } = req.query;
  console.log(req.query);
  const data = await User.find({
    ...(name && { name }),
    ...(status && { status }),
  })
    .skip((Number(current) - 1) * Number(pageSize))
    .limit(Number(pageSize));
  
    const total = await User.countDocuments({
    ...(name && { name }),
    ...(status && { status }),
  });
  return res.status(200).json({ data,total });
});

router.post('/', (req: Request, res: Response) => {
  const body = req.body;
  const userModel = new User({ ...body });
  userModel.save();
  return res.json({ success: true,code : 200});
});

router.delete('/:id', async (req: Request, res: Response) => {
  // 'book/1'
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  return res.status(200).json({ success: true });
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (user) {
    res.status(200).json({ data: user, success: true });
  } else {
    res.status(500).json({ message: 'User not exists' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const body = req.body;
  const { id } = req.params;
  await User.findOneAndUpdate({ _id: id }, body);
  return res.status(200).json({ success: true });
});

export default router;