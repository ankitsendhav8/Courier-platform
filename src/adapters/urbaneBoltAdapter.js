const axios = require('axios');

const BaseCourierAdapter = require('./baseCourierAdapter');
const client = require('../utils/httpClient');
const { retryWithBackoff } = require('../utils/retry');
const tokenService = require('../services/tokenService');

class UrbaneBoltAdapter extends BaseCourierAdapter {

    async authenticate() {
        const response = await axios.post(
            `${process.env.URBANEBOLT_BASE_URL}/api/v1/auth/getToken/`,
            {
                username: process.env.URBANEBOLT_USERNAME,
                password: process.env.URBANEBOLT_PASSWORD
            }
        );
        const token = response.data.access_token;
        tokenService.setToken(token);
        return token;
    }

    async createShipment(formData) {
        return this.executeWithAuth(async () => {
            return retryWithBackoff(
                async () => {
                    const token = await this.getValidToken();
                    delete formData.order_id;
                    delete formData.orderNumber;
                    let data = JSON.stringify(formData)
                    const response = await axios.post(
                        `${process.env.URBANEBOLT_BASE_URL}/api/v1/services/manifest/`,
                        data,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    return response.data.successResponse && response.data.successResponse.length > 0 ? response.data.successResponse[0] : null;
                }
            );
        }
        );
    }

    async trackShipment(awbNumber) {
        return this.executeWithAuth(
            async () => {
                return retryWithBackoff(async () => {
                    const token = await this.getValidToken();
                    const response = await axios.get(
                        `${process.env.URBANEBOLT_BASE_URL}/api/v1/services/tracking-pub/?awb=${awbNumber}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );
                    return response.data;
                }
                );
            });
    }

    async cancelShipment(awbNumber) {
        return this.executeWithAuth(
            async () => {
                return retryWithBackoff(async () => {
                    const token = await this.getValidToken();
                    const response = await axios.post(
                        `${process.env.URBANEBOLT_BASE_URL}/api/v1/services/cancel/`,
                        {
                            awbs: awbNumber
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    return response.data;
                }
                );
            });
    }

    async executeWithAuth(apiCall) {
        try {
            return await apiCall();
        }
        catch (error) {
            if (error.response?.status === 401) {
                await this.authenticate();
                return await apiCall();
            }
            throw error;
        }
    }
    async getValidToken() {
        let token = tokenService.getToken();
        if (!token) {
            token = await this.authenticate();
        }
        return token;
    }
}


module.exports = UrbaneBoltAdapter;