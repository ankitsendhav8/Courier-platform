const BaseCourierAdapter = require('./baseCourierAdapter');

class MockCourierAdapter
    extends BaseCourierAdapter {
    async createShipment() {
        return {
            orderNumber: 'MC111',
            awbNumber: 'MOCKAWB111',
            status: 'CREATED'
        };
    }

    async trackShipment(awbNumber) {
        return {
            orderNumber: 'MC111',
            awbNumber: 'MOCKAWB111',
            status: 'CREATED'
        };
    }

    async cancelShipment(awbNumber) {
        return {
            orderNumber: 'MC111',
            awbNumber: 'MOCKAWB111',
            status: 'CREATED'
        };
    }

}

module.exports = MockCourierAdapter;