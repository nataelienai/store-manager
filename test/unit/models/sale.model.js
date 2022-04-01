require("dotenv").config();
const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const SaleModel = require('../../../models/sale.model');
const saleCamelCaseMock = require('../mocks/saleCamelCase.json');
const salesCamelCaseMock = require('../mocks/salesCamelCase.json');
const saleSnakeCaseMock = require('../mocks/saleSnakeCase.json');
const salesSnakeCaseMock = require('../mocks/salesSnakeCase.json');

describe('SaleModel', () => {
  describe('#getAll()', () => {
    context('when the database is empty', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([[]]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('returns an empty array', async () => {
        const sales = await SaleModel.getAll();
        expect(sales).to.be.an('array').that.is.empty;
      });
    });

    context('when the database has a single sale', () => {
      before(() => {
        const saleSnakeCase = salesSnakeCaseMock[0];
        sinon.stub(connection, 'execute').resolves([[saleSnakeCase]]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('returns an array with one single', async () => {
        const sales = await SaleModel.getAll();
        const saleCamelCase = salesCamelCaseMock[0];

        expect(sales).to.deep.equal([saleCamelCase]);
      });
    });

    context('when the database has multiple sales', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([salesSnakeCaseMock]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('returns an array with multiple sales', async () => {
        const sales = await SaleModel.getAll();
        expect(sales).to.deep.equal(salesCamelCaseMock);
      });
    });
  });

  describe('#getById()', () => {
    context('when the sale is not present', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([[]]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('returns null', async () => {
        const sale = await SaleModel.getById(1);
        expect(sale).to.be.null;
      });
    });

    context('when the sale is present', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves([saleSnakeCaseMock]);
      });

      after(() => {
        connection.execute.restore();
      });

      it('returns the sale', async () => {
        const sale = await SaleModel.getById(1);
        expect(sale).to.deep.equal(saleCamelCaseMock);
      });
    });
  });
});