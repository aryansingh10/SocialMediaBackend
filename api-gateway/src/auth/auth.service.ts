import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  async validateToken(token: string) {
    try {
      const response = await axios.post(
        'http://localhost:3000/graphql',
        {
          query: `
            query ValidateToken($token: String!) {
              validateToken(token: $token) {
                id
                role
              }
            }
          `,
          variables: { token },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Auth Response:', JSON.stringify(response.data, null, 2));

      if (response.data.errors || !response.data.data?.validateToken) {
        throw new UnauthorizedException('Invalid token');
      }

      return response.data.data.validateToken;
    } catch (error) {
      console.error('Axios Error:', error?.response?.data || error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
