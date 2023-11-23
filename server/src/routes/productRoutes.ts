import { Router, Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/productModel';
import { verifyToken } from './userRoutes';
import { ProductErrors, UserErrors } from '../errors';
import User from '../models/userModel';

const router = Router();

// get all products
router.get('/', verifyToken, async (_, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: 'success',
      count: products.length,
      products,
    });
  } catch (err: any) {
    res.status(500).json({
      type: err,
    });

    console.log(err, 'GET ALL PRODUCTS');
  }
});

// create new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(200).json({
      status: 'success',
      data: newProduct,
    });
  } catch (err: any) {
    res.status(500).json({
      type: err,
    });
  }
});

// checkout route
router.post('/checkout', verifyToken, async (req: Request, res: Response) => {
  const { customerID, cartItems } = req.body;

  try {
    // getting the user from the database
    const user = await User.findById(customerID);
    // getting the keys(productIds) from the cartItems object
    const productIds = Object.keys(cartItems);
    // getting the products from the database with the productIds
    const products = await Product.find({ _id: { $in: productIds } });

    if (!user) {
      res.status(400).json({
        status: 'fail',
        type: UserErrors.NO_USER_FOUND,
      });
    }

    // no product found
    if (products.length !== productIds.length) {
      return res.status(400).json({
        status: 'fail',
        type: ProductErrors.NO_PRODUCT_FOUND,
      });
    }

    let totalPrice = 0;
    for (let item in cartItems) {
      const product = products.find((product) => String(product._id) === item);

      if (!product) {
        return res.status(400).json({
          status: 'fail',
          type: ProductErrors.NO_PRODUCT_FOUND,
        });
      }

      // if the demo left in stock is less than what user wants to buy
      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({
          status: 'fail',
          type: ProductErrors.NOT_ENOUGH_STOCK,
        });
      }

      totalPrice += product.price * cartItems[item];
    }

    if (user.availableMoney < totalPrice) {
      return res.status(400).json({
        status: 'fail',
        type: ProductErrors.NO_AVAILABLE_MONEY,
      });
    }

    user.availableMoney -= totalPrice;
    user.purchasedItems.push(...productIds);

    // saving changes
    await user.save();
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $inc: { stockQuantity: -1 } }
    );

    res.status(200).json({
      status: 'success',
      purchasedItems: user.purchasedItems,
    });
  } catch (err: any) {
    res.status(400).json({
      type: ProductErrors.NO_PRODUCT_FOUND,
    });
  }
});

router.get(
  '/purchased-items/:userID',
  verifyToken,
  async (req: Request, res: Response) => {
    const { userID } = req.params;

    try {
      const user = await User.findById(userID);

      if (!user) {
        res.status(404).json({ type: UserErrors.NO_USER_FOUND });
      }

      const products = await Product.find({
        _id: { $in: user.purchasedItems },
      });

      res.status(200).json({
        purchasedItems: products,
      });
    } catch (err) {
      res.status(500).json({
        type: err,
      });
    }
  }
);

export { router as productRouter };
