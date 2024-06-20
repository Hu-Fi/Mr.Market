/**
 * AuthService
 *
 * This service manages authentication processes including validation for admin user and
 * handling OAuth for normal mixin user. It relies on JWT for token generation and uses
 * environment variables for configuration.
 *
 * Dependencies:
 * - JwtService: NestJS service for working with JSON Web Tokens.
 * - ConfigService: Provides configuration values from environment variables.
 * - UserService: Handles user-related operations.
 * - createHash: Node.js crypto module for creating hash digests.
 * - getUserMe: Helper function to fetch the authenticated user's information from Mixin.
 *
 * Constants:
 * - MIXIN_OAUTH_URL: The OAuth URL for Mixin authentication.
 *
 * Methods:
 * - constructor: Initializes the service with necessary configuration and validates critical secrets.
 * - validateUser(password: string): Validates the admin password and returns a signed JWT.
 * - mixinOauthHandler(code: string): Handles Mixin OAuth process, retrieves access token, and updates user information.
 *
 * Errors:
 * - Throws UnauthorizedException for missing or invalid password.
 * - Throws HttpException for invalid OAuth code length or HTTP request failures.
 *
 * Notes:
 * - The service ensures secure handling of JWT secrets and admin passwords.
 * - It performs user validation by comparing hashed passwords.
 */

import { createHash } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  secret: string;
  adminPassword: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('admin.jwt_secret');
    this.adminPassword = this.configService.get<string>('admin.pass');

    if (!this.secret) {
      throw `AuthService initalization failed: Invalid jwt secret in .env`;
    }
    if (!this.adminPassword) {
      throw `AuthService initalization failed: Invalid admin password in .env`;
    }
  }

  async validateUser(password: string): Promise<string> {
    if (!this.adminPassword || !password) {
      throw new UnauthorizedException('Password is required');
    }

    const hashedAdminPassword = createHash('sha3-256')
      .update(this.adminPassword)
      .digest('hex');
    const hashedSuppliedPassword = createHash('sha3-256')
      .update(password)
      .digest('hex');

    if (hashedAdminPassword !== hashedSuppliedPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { username: 'admin' };
    return this.jwtService.sign(payload);
  }
}
