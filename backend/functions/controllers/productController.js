/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable semi */
/* eslint-disable max-len */
const admin = require("firebase-admin");
const db = admin.firestore();
const productsCollectionRef = db.collection("products");
const { productSchema, updateProductSchema } = require("../models/productModel");

// NOTE: All of these endpoints are working as expected, further test should still be made to ensure that the data is being stored and retrieved correctly.

// NOTE: To get a sample response from these API endpoints refer to the readme in the route directory
const productTestRouteServer = (_req, res, next) => {
  res.status(200).send({ success: true, msg: "Inside Products Route" })
};

// TODO: Add authentication middleware
const addNewProductServer = async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body);

    if (error) {
      return res.status(400).send({ success: false, msg: `VALIDATION ERROR: ${error.message}` });
    } else {
      const product = {
        ...value,
      };

      productsCollectionRef.add(product).then((docRef) => {
        return res.status(200).send({ success: true, data: product, id: docRef.id });
      }).catch((error) => {
        console.error("Error adding document: ", error);
        return res.status(500).send({ success: false, msg: `CREATE PRODUCT ERROR [SERVER] ${error.message}` });
      });
    }
  } catch (error) {
    return res.status(500).send({ success: false, msg: `CREATE PRODUCT ERROR [SERVER] ${error.message}` });
  }
};

const getAllProductsServer = async (_req, res, next) => {
  try {
    const querySnapshot = await productsCollectionRef.get();
    const response = querySnapshot.docs.map((doc) => {
      const { productName, basePrice, sizes, addons, ingredients, description } = doc.data();
      return {
        id: doc.id,
        productName,
        basePrice,
        sizes,
        addons,
        ingredients,
        description,
      };
    });
    res.status(200).send({ success: true, data: response });
  } catch (error) {
    console.log(`GET ALL PRODUCTS ERROR [SERVER] ${error.message}`)
    return res.status(500).send({ success: false, msg: `GET ALL PRODUCTS ERROR [SERVER] ${error.message}` });
  }
};

const getProductByIdServer = async (req, res, next) => {
  try {
    const id = req.params.productId;
    if (!id || typeof id !== "string") {
      return res.status(400).send({ success: false, msg: "Invalid ID parameter" });
    }
    const doc = await productsCollectionRef.doc(id).get();

    if (!doc.exists) {
      return res.status(404).send({ success: false, msg: `PRODUCT NOT FOUND [SERVER]` });
    } else {
      const { productName, basePrice, sizes, addons, ingredients, description, category, imageUrl, isFeatured, isPublished, nutritionalInfo, preparationTime } = doc.data();
      const response = {
        productId: doc.id,
        productName,
        basePrice,
        sizes: sizes.map((size) => ({
          price: size.price,
          name: size.name,
        })),
        addons: addons.map((addon) => ({
          name: addon.name,
          price: addon.price,
        })),
        ingredients,
        description,
        category,
        imageUrl,
        isFeatured,
        isPublished,
        nutritionalInfo,
        preparationTime,
      };
      return res.status(200).send({ success: true, data: response });
    }
  } catch (error) {
    console.log(`GET PRODUCT BY ID ERROR [SERVER] ${error.message}`);
    return res.status(500).send({ success: false, msg: `GET PRODUCT BY ID ERROR [SERVER] ${error.message}` });
  }
};

// TODO: Add authentication middleware
// TODO: Fork and fetch the current product details and update the fields that were changed only
const updateProductByIdServer = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const { error, value } = updateProductSchema.validate(req.body);

    if (error) {
      return res.status(400).send({ success: false, msg: `VALIDATION ERROR: ${error.message}` });
    } else {
      productsCollectionRef.doc(id).update(value).then(() => {
        return res.status(200).send({ success: true, data: value });
      }).catch((error) => {
        console.error("Error updating document: ", error);
        return res.status(500).send({ success: false, msg: `UPDATE PRODUCT ERROR [SERVER] ${error.message}` });
      });
    }
  } catch (error) {
    return res.status(500).send({ success: false, msg: `UPDATE PRODUCT ERROR [SERVER] ${error.message}` });
  }
};


// TODO: Add authentication middleware
const deleteProductByIdServer = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const doc = await productsCollectionRef.doc(id).get();

    if (!doc.exists) {
      return res.status(404).send({ success: false, msg: `PRODUCT NOT FOUND [SERVER]` });
    } else {
      const response = await productsCollectionRef.doc(id).delete();
      return res.status(200).send({ success: true, data: response });
    }
  } catch (error) {
    console.log(`DELETE PRODUCT ERROR [SERVER] ${error.message}`)
    return res.status(500).send({ success: false, msg: `DELETE PRODUCT ERROR [SERVER] ${error.message}` });
  }
};

module.exports = {
  getAllProductsServer, addNewProductServer, productTestRouteServer, getProductByIdServer, updateProductByIdServer, deleteProductByIdServer,
};
