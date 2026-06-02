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
        const token = response.data.token;
        tokenService.setToken(token);
        return token;
    }

    async createShipment(order) {
        return this.executeWithAuth(
            async () => {
                return retryWithBackoff(
                    async () => {
                        const token = await this.getValidToken();
                        const response =
                            await client.post('/shipment', order,
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
            }
        );
    }

    async trackShipment(awbNumber) {
        return this.executeWithAuth(
            async () => {
                const token = await this.getValidToken();
                return retryWithBackoff(async () => {
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
                const token = await this.getValidToken();
                return retryWithBackoff(
                    async () => {
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