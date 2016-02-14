global.$ = { };
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import request from 'superagent';
import nock from 'nock';
import * as types from '../www/constants/ActionTypes';
import * as actions from '../www/actions/dashActions';
import DateRange from '../www/helpers/DateRange';
import * as layoutHelpers from '../www/helpers/layout';

chai.use(sinonChai);

describe('dashActions', () => {

  describe('changeDateRange', () => {
    it('should create action to change date range', () => {
      const range = new DateRange('-30d');

      let fn = actions.changeDateRange(range);

      expect(fn).not.to.be.null;

      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({ appState: {dateRange: null}, cardLayout: [] });

      fn(dispatch, getState);

      expect(dispatch).to.have.been.calledWith({ type: types.DATE_RANGE_CHANGE, range });
    });
    
    it('should not create action if date range does not change', () => {
      const range = new DateRange('-30d');

      let fn = actions.changeDateRange(range);

      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({ appState: {dateRange: new DateRange('-30d')}, cardLayout: [] });

      fn(dispatch, getState);

      expect(dispatch).not.to.have.been.called;
    });

    it('should refresh cards', () => {
      const range = new DateRange('-30d');

      let fn = actions.changeDateRange(range);

      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({ appState: {dateRange: null}, cardLayout: [] });

      sinon.stub(layoutHelpers, 'collectCardIds').returns([1,2,3,4]);

      fn(dispatch, getState);

      expect(dispatch).to.have.callCount(5);
    });
  });

  describe('refreshLookupDataAsync', () => {
    it('should return user list', (done) => {
      let fn = actions.refreshLookupDataAsync('users');

      const dispatch = sinon.spy((action) => {
        expect(action).to.eql({ type: types.LOOKUP_DATA_REFRESHED, key: 'users', data: { 1: 'One', 2: 'Two' } });
        done();
      });
      const getState = sinon.stub();

      let scope = nock('http://localhost:80')
        .get('/api/users')
        .reply(200, [{ _id: 1, name: 'One'}, { _id: 2, name: 'Two' }]);

      fn(dispatch, getState);

      scope.done();
    });
  });
});
