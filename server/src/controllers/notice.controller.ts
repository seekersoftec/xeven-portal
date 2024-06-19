import { Request, Response } from 'express';
import Notice, { INotice } from '@/database/models/noticeSchema';

export const noticeCreate = async (
  req: Request,
  res: Response
): Promise<Response<INotice> | void> => {
  try {
    const notice = new Notice({
      ...req.body,
      school: req.body.adminID,
    });
    const result = await notice.save();
    return res.send(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const noticeList = async (
  req: Request,
  res: Response
): Promise<Response<INotice[]> | Response<{ message: string }> | void> => {
  try {
    const notices = await Notice.find({ school: req.params.id });
    if (notices.length > 0) {
      return res.send(notices);
    } else {
      return res.send({ message: 'No notices found' });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const updateNotice = async (
  req: Request,
  res: Response
): Promise<Response<INotice> | void> => {
  try {
    const result = await Notice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.send(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteNotice = async (
  req: Request,
  res: Response
): Promise<Response<INotice | null> | void> => {
  try {
    const result = await Notice.findByIdAndDelete(req.params.id);
    return res.send(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteNotices = async (
  req: Request,
  res: Response
): Promise<Response<{ message: string } | { deletedCount: number }> | void> => {
  try {
    const result = await Notice.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      return res.send({ message: 'No notices found to delete' });
    } else {
      return res.send(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export default {
  noticeCreate,
  noticeList,
  updateNotice,
  deleteNotice,
  deleteNotices,
};
