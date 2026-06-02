class BaseCourierAdapter {

    async authenticate() {
        throw new Error('Not Implemented');
    }

    async createShipment(order) {
        throw new Error('Not Implemented');
    }

    async trackShipment(awb) {
        throw new Error('Not Implemented');
    }

    async cancelShipment(orderId) {
        throw new Error('Not Implemented');
    }
}

module.exports = BaseCourierAdapter;