// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.epAppData = {
  API_BASE_URL: 'https://fake.api.domain',
  ENV_TYPE: 'TEST',
};

const mockAxios = jest.genMockFromModule('axios');

jest.mock('./apis/api', () => ({
  API: mockAxios,
}));
