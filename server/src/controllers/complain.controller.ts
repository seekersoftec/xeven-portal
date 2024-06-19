import { Request, Response } from 'express';
import Complain from '@/database/models/complainSchema';

export const complainCreate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const complain = new Complain(req.body);
    const result = await complain.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const complainList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const complains = await Complain.find({ school: req.params.id }).populate(
      'user',
      'name'
    );
    if (complains.length > 0) {
      res.send(complains);
    } else {
      res.send({ message: 'No complains found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
