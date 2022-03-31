require("dotenv").config();
const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const ProductModel = require('../../../models/product.model');
const singleProduct = require('../mocks/singleProduct.json');
const multipleProducts = require('../mocks/multipleProducts.json');

describe('ProductModel', () => {
  describe('#getAll()', () => {
    context('when the database is empty', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([[]]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('returns an empty array', async () => {
        const products = await ProductModel.getAll();
        expect(products).to.be.an('array').that.is.empty;
      });
    });

    context('when the database has a single product', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([singleProduct]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('returns an array with one product', async () => {
        const products = await ProductModel.getAll();
        expect(products).to.deep.equal(singleProduct);
      });
    });

    context('when the database has multiple products', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([multipleProducts]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('returns an array with multiple products', async () => {
        const products = await ProductModel.getAll();
        expect(products).to.deep.equal(multipleProducts);
      });
    });
  });
});