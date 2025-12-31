/**
 * API endpoint definitions
 * Centralized endpoint paths for type safety
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/authentication/login",
    REGISTER: "/authentication/register",
    LOGOUT: "/authentication/logout",
    REFRESH: "/authentication/refresh",
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  MEMBERS: {
    LIST: "/member",
    PLAYERS: "/members/players",
    COACHES: "/members/coaches",
    REFEREES: "/members/referees",
    DETAIL: (id: string | number) => `/members/${id}`,
    CREATE: "/member",
  },
  LOCATIONS: {
    PROVINCES: "/province",
    CITIES: (provinceId: string) => `/city/by-province?provinceId=${provinceId}`,
  },
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
  },
  PLAYER: {
    GET_ME: "/player/me",
    CREATE: "/player",
    UPDATE: "/player",
  },
  COACH: {
    GET_ME: "/coach/me",
    CREATE: "/coach",
    UPDATE: "/coach",
  },
  CLUB_OWNER: {
    GET_ME: "/club-owner/me",
    CREATE: "/club-owner",
  },
  CLUBS: {
    LIST: "/club",
    GET_BY_ID: (id: string) => `/club/${id}`,
    CREATE: "/club",
    UPDATE: "/club",
  },
} as const;

