require('dotenv').config();
const { expect } = require('chai');
const sinon = require('sinon');
const SaleService = require('../../../services/sale.service');
const SaleController = require('../../../controllers/sale.controller');
const saleMock = require('../mocks/saleCamelCase.json');
const salesMock = require('../mocks/salesCamelCase.json');
const saleNotFoundErrorMock = require('../mocks/saleNotFoundError.js');

describe('SaleController', () => {
  describe('#getAll()', () => {
    context('when the database is empty', () => {
      const request = {};
      const response = {};

      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(SaleService, 'getAll').resolves({ data: [] });
      });

      after(() => {
        SaleService.getAll.restore();
      });

      it('responds with HTTP status code 200 OK', async () => {
        await SaleController.getAll(request, response);
        expect(response.status.calledWith(200)).to.be.true;
      });

      it('responds with an empty array', async () => {
        await SaleController.getAll(request, response);
        expect(response.json.calledWith([])).to.be.true;
      });
    });

    context('when the database has a single sale', () => {
      const request = {};
      const response = {};
      const sale = salesMock[0];

      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(SaleService, 'getAll').resolves({ data: [sale] });
      });

      after(() => {
        SaleService.getAll.restore();
      });

      it('responds with HTTP status code 200 OK', async () => {
        await SaleController.getAll(request, response);
        expect(response.status.calledWith(200)).to.be.true;
      });

      it('responds with an array that has one sale', async () => {
        await SaleController.getAll(request, response);
        expect(response.json.calledWith([sale])).to.be.true;
      });
    });

    context('when the database has multiple sales', () => {
      const request = {};
      const response = {};

      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(SaleService, 'getAll').resolves({ data: salesMock });
      });

      after(() => {
        SaleService.getAll.restore();
      });

      it('responds with HTTP status code 200 OK', async () => {
        await SaleController.getAll(request, response);
        expect(response.status.calledWith(200)).to.be.true;
      });

      it('responds with an array that has multiple sales', async () => {
        await SaleController.getAll(request, response);
        expect(response.json.calledWith(salesMock)).to.be.true;
      });
    });
  });

  describe('#getById()', () => {
    context('when the sale is not present', () => {
      const request = {};
      const response = {};
      const next = sinon.stub().returns();

      before(() => {
        request.params = { id: 1 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(SaleService, 'getById').resolves({ error: saleNotFoundErrorMock });
      });

      after(() => {
        SaleService.getById.restore();
      });

      it('calls next() with the error object', async () => {
        await SaleController.getById(request, response, next);
        expect(next.calledWith(saleNotFoundErrorMock)).to.be.true;
      });
    });

    context('when the sale is present', () => {
      const request = {};
      const response = {};

      before(() => {
        request.params = { id: 1 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(SaleService, 'getById').resolves({ data: saleMock });
      });

      after(() => {
        SaleService.getById.restore();
      });

      it('responds with HTTP status code 200 OK', async () => {
        await SaleController.getById(request, response);
        expect(response.status.calledWith(200)).to.be.true;
      });

      it('responds with the sale object', async () => {
        await SaleController.getById(request, response);
        expect(response.json.calledWith(saleMock)).to.be.true;
      });
    });
  });
});
