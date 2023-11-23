import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/userModel';
import { UserErrors } from '../errors';

const router = Router();

router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Please provide your email address and password.',
      });
    }

    try {
      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          status: 'fail',
          type: UserErrors.EMAIL_ALREADY_EXISTS,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      // console.log(hashedPassword);

      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      // send response
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        user: newUser,
      });
    } catch (err) {
      res.status(500).json({
        type: err,
      });

      console.log(err);
    }
  }
);

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Please provide your email address and password.',
      });
    }

    try {
      const user: IUser = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          status: 'fail',
          type: UserErrors.NO_USER_FOUND,
        });
      }

      if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(400).json({
          status: 'fail',
          type: UserErrors.WRONG_CREDENTIALS,
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      // send response
      res.status(200).json({
        status: 'success',
        token,
        expiresIn: process.env.JWT_EXPIRES_IN,
        data: {
          user,
        },
      });
    } catch (err) {
      res.status(500).json({
        type: err,
      });

      console.log(err);
    }
  }
);

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err: any) => {
      if (err) {
        return res.status(401).json({
          status: 'fail jwt',
          message: UserErrors.UNAUTHORIZED,
        });
      }

      next();
    });
  }
};

router.get(
  '/available-money/:userID',
  verifyToken,
  async (req: Request, res: Response) => {
    const { userID } = req.params;

    try {
      const user = await User.findById(userID);

      if (!user) {
        res.status(404).json({ type: UserErrors.NO_USER_FOUND });
      }

      res.status(200).json({
        availableMoney: user.availableMoney,
      });
    } catch (err) {
      res.status(500).json({
        type: err,
      });
    }
  }
);

export { router as userRouter };
