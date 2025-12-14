/**
 * Auth API Service
 * Handles all authentication-related API calls
 */

import { log } from "console";
import { apiClient } from "../client";
import { API_ENDPOINTS } from "../endpoints";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types";

/**
 * Login with phone number and password
 */
export async function login(
  phoneNumber: string,
  password: string
): Promise<LoginResponse["data"]> {
  const request: LoginRequest = {
    phoneNumber,
    password,
  };

  const response = await apiClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    request
  );
  console.log(response);
  if (!response.success || !response.data) {
    throw new Error(response.error || "ورود با خطا مواجه شد");
  }

  return response.data;
}

/**
 * Register a new user
 */
export async function register(
  phoneNumber: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<RegisterResponse["data"]> {
  const request: RegisterRequest = {
    phoneNumber,
    firstName,
    lastName,
    password,
  };

  const response = await apiClient.post<RegisterResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    request
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || "ثبت‌نام با خطا مواجه شد");
  }

  return response.data;
}

