const BaseCourierAdapter = require('./baseCourierAdapter');

class MockCourierAdapter extends BaseCourierAdapter {

    // Mock implementation of createShipment
    async createShipment() {
        return {
            orderNumber: 'MC111',
            awbNumber: 'MOCKAWB111',
            status: 'CREATED'
        };
    }

    // Mock implementation of trackShipment
    async trackShipment(awbNumber) {
        return {
            orderNumber: 'MC111',
            awbNumber: 'MOCKAWB111',
            status: 'CREATED'
        };
    }

    // Mock implementation of cancelShipment
    async cancelShipment(awbNumber) {
        return {
            orderNumber: 'MC111',
            awbNumber: 'MOCKAWB111',
            status: 'CREATED'
        };
    }

}

module.exports = MockCourierAdapter;