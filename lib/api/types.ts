/**
 * API request and response types
 * Define all API-related types here
 */

import type { BaseResponse, PaginatedResponse } from "@/lib/types/common";

/**
 * Auth API Types
 */
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse extends BaseResponse {
  data?: {
    token?: string;
    user: {
      id: string | number;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
}

export interface RegisterRequest {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterResponse extends BaseResponse {
  data?: {
    token?: string;
    user: {
      id: string | number;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
}

/**
 * Member/Player API Types
 * These types represent the structure of data returned from the API
 */

export interface ApiMember {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string | null;
  teamName: string;
  position: string;
  insuranceExpiryDate: string;
  isInsuranceValid: boolean;
}

export interface MembersListResponse extends BaseResponse {
  data?: ApiMember[];
}

export interface PaginatedMembersResponse extends BaseResponse {
  data?: {
    items: ApiMember[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface MemberDetailResponse extends BaseResponse {
  data?: ApiMember;
}

/**
 * Province and City Types
 */
export interface Province {
  id: string; // Guid
  name: string;
}

export interface City {
  id: string; // Guid
  name: string;
  provinceId: string; // Guid
}

export interface ProvincesListResponse extends BaseResponse {
  data?: Province[];
}

export interface CitiesListResponse extends BaseResponse {
  data?: City[];
}

/**
 * Create Member Types
 */
export interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
  dateOfBirth: string; // ISO date string
  gender: string;
  avatar: string | null;
  bornCityId: string; // Guid
}

export interface CreateMemberResponse extends BaseResponse {
  data?: ApiMember;
}

/**
 * Profile API Types
 */
export interface ProfileResponse {
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalCode: string;
  dateOfBirth: string; // DateOnly from C# - ISO date string
  gender: string;
  avatar: string | null;
  bornProvinceId: string; // Guid
  bornCityId: string; // Guid
  confirmed: boolean;
}

export interface ProfileApiResponse extends BaseResponse {
  data?: ProfileResponse;
}

/**
 * Player Role API Types
 */
export enum Handedness {
  Right = "Right",
  Left = "Left",
}

export enum PlayerPositions {
  OutsideHitter = "OutsideHitter",
  OppositeHitter = "OppositeHitter",
  MiddleBlocker = "MiddleBlocker",
  Setter = "Setter",
  Libero = "Libero",
}

export enum ApprovalStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface PlayerResponse {
  height: number;
  weight: number;
  handedness: Handedness;
  playerPosition: PlayerPositions;
  approvalStatus: ApprovalStatus;
}

export interface PlayerApiResponse extends BaseResponse {
  data?: PlayerResponse;
}

export interface CreatePlayerRequest {
  height: number;
  weight: number;
  handedness: Handedness;
  playerPosition: PlayerPositions;
}

export interface UpdatePlayerRequest {
  height: number;
  weight: number;
  handedness: Handedness;
  playerPosition: PlayerPositions;
}

/**
 * Coach Role API Types
 */
export enum CoachingLevels {
  Beginner = "Beginner",
  AssistantCoach = "AssistantCoach",
  Level3 = "Level3",
  Level2 = "Level2",
  Level1 = "Level1",
  NationalCoach = "NationalCoach",
  InternationalCoach = "InternationalCoach",
}

export interface CoachResponse {
  coachingLevel: CoachingLevels;
  coachingCertificateIssuedAt: string; // ISO date string (DateOnly from C#)
  coachingCertificateImage: string;
  approvalStatus: ApprovalStatus;
}

export interface CoachApiResponse extends BaseResponse {
  data?: CoachResponse;
}

export interface CreateCoachRequest {
  coachingLevel: CoachingLevels;
  coachingCertificateIssuedAt: string; // ISO date string
  coachingCertificateImage?: File; // Optional file upload
}

export interface UpdateCoachRequest {
  coachingLevel: CoachingLevels;
  coachingCertificateIssuedAt: string; // ISO date string
  coachingCertificateImage?: File; // Optional file upload - only if user uploads new one
}

/**
 * Club Owner Role API Types
 */
export interface ClubOwnerResponse {
  approvalStatus: ApprovalStatus;
}

export interface ClubOwnerApiResponse extends BaseResponse {
  data?: ClubOwnerResponse;
}

export interface CreateClubOwnerRequest {
  // No fields required - empty body
}

/**
 * Club Types Enum
 */
export enum ClubTypes {
  Public = "Public",
  Private = "Private",
  Academy = "Academy",
  University = "University",
}

/**
 * Club API Types
 */
export interface ClubResponse {
  id: string; // Guid
  name: string;
  ownerId: string; // Guid
  cityId: string; // Guid
  type: ClubTypes;
  websiteUrl: string | null;
  phoneNumber: string | null;
  address: string | null;
  logo: string | null;
  approvalStatus: ApprovalStatus;
}

export interface ClubApiResponse extends BaseResponse {
  data?: ClubResponse;
}

export interface PaginatedClubsResponse extends BaseResponse {
  data?: {
    items: ClubResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface CreateOrUpdateClubRequest {
  id?: string | null; // Guid - null for create, set for update
  name: string;
  cityId: string; // Guid
  type: ClubTypes;
  websiteUrl?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  logo?: File; // Optional file upload
}

/**
 * News Types Enum
 */
export enum NewsTypes {
  News = "News",
  Announcement = "Announcement",
  Video = "Video",
  Podcast = "Podcast",
  Summary = "Summary",
  // Add other types as needed
}

/**
 * News Locality Types Enum
 */
export enum NewsLocalityTypes {
  National = "National",
  Provincial = "Provincial",
  City = "City",
}

/**
 * News API Types
 */
export interface SummarizedNewsResponse {
  id: string;
  title: string;
  shortDescription: string;
  dateTime: string;
  thumbImage: string;
  type: NewsTypes;
  locality: NewsLocalityTypes;
  relatedCityId?: string | null;
}

export interface PaginatedNewsResponse extends BaseResponse {
  data?: {
    items: SummarizedNewsResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

/**
 * News Content Block Types
 */
export enum NewsContentBlockType {
  Text = "Text",
  Image = "Image",
  Video = "Video",
}

/**
 * Create News Content Block Request
 */
export interface CreateNewsContentBlockRequest {
  Id: string; // Empty Guid for new blocks
  Type: NewsContentBlockType;
  Order: number;
  Text?: string; // Only for Text type
  ImageFile?: File; // Only for Image type
  VideoFile?: File; // Only for Video type
}

/**
 * Create News Request
 */
export interface CreateNewsRequest {
  Title: string;
  Slug: string;
  ShortDescription: string;
  DateTime: string; // ISO date string
  ThumbImage: File;
  Type: NewsTypes;
  Locality: NewsLocalityTypes;
  RelatedCityId?: string | null; // Only if Locality === City
  IsPinned: boolean;
  Blocks: CreateNewsContentBlockRequest[];
}

