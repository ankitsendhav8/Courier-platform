const BaseCourierAdapter = require('./baseCourierAdapter');

class MockCourierAdapter
    extends BaseCourierAdapter {
    async createShipment() {
        return {
            courierOrderId: 'MC111',
            awbNumber: 'MOCKAWB111',
            status: 'CREATED'
        };
    }
}

module.exports = MockCourierAdapter;