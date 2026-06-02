const UrbaneBoltAdapter = require('../adapters/urbaneBoltAdapter');
const MockCourierAdapter = require('../adapters/mockCourierAdapter');
const AppError = require('../utils/AppError');

class CourierFactory {

    static getAdapter(courierPartner) {

        switch (courierPartner) {
            case 'urbanebolt':
                return new UrbaneBoltAdapter();
            case 'mockcourier':
                return new MockCourierAdapter();
            default:
                throw new AppError(400, "INVALID_COURIER", `Unsupported courier: ${courierPartner}`);
        }
    }
}

module.exports = CourierFactory;