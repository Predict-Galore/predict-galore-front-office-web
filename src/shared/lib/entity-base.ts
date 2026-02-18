/**
 * SHARED ENTITY BASE
 * 
 * Base interfaces and utilities for all business entities
 */

import { z } from 'zod';

/**
 * Base entity interface that all entities should extend
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Base entity schema for validation
 */
export const baseEntitySchema = z.object({
  id: z.string().uuid('Invalid ID format'),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination response interface
 */
export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

/**
 * Search parameters interface
 */
export interface SearchParams extends PaginationParams {
  query?: string;
}

/**
 * API response wrapper interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

/**
 * Error response interface
 */
export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

/**
 * Validation result interface
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

/**
 * Entity transformation options
 */
export interface TransformOptions {
  includeRelations?: boolean;
  excludeFields?: string[];
  includeFields?: string[];
  dateFormat?: 'iso' | 'timestamp' | 'locale';
  locale?: string;
}

/**
 * Base transformer class
 */
export abstract class BaseTransformer<TEntity, TApiResponse, TApiRequest = Partial<TEntity>> {
  /**
   * Transform API response to entity
   */
  abstract toEntity(apiResponse: TApiResponse, options?: TransformOptions): TEntity;

  /**
   * Transform entity to API request format
   */
  abstract toApiRequest(entity: TEntity, options?: TransformOptions): TApiRequest;

  /**
   * Transform multiple API responses to entities
   */
  toEntities(apiResponses: TApiResponse[], options?: TransformOptions): TEntity[] {
    return apiResponses.map(response => this.toEntity(response, options));
  }

  /**
   * Transform multiple entities to API request format
   */
  toApiRequests(entities: TEntity[], options?: TransformOptions): TApiRequest[] {
    return entities.map(entity => this.toApiRequest(entity, options));
  }

  /**
   * Validate and transform API response
   */
  protected validateAndTransform<T>(
    data: unknown,
    schema: z.ZodSchema<T>,
    errorMessage: string
  ): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(`${errorMessage}: ${result.error.message}`);
    }
    return result.data;
  }
}

/**
 * Base utility class for entities
 */
export abstract class BaseEntityUtils<T extends BaseEntity> {
  /**
   * Check if entity is recently created (within last 24 hours)
   */
  isRecentlyCreated(entity: T): boolean {
    const now = new Date();
    const created = new Date(entity.createdAt);
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  }

  /**
   * Check if entity was recently updated (within last hour)
   */
  isRecentlyUpdated(entity: T): boolean {
    const now = new Date();
    const updated = new Date(entity.updatedAt);
    const diffMinutes = (now.getTime() - updated.getTime()) / (1000 * 60);
    return diffMinutes <= 60;
  }

  /**
   * Get entity age in days
   */
  getEntityAge(entity: T): number {
    const now = new Date();
    const created = new Date(entity.createdAt);
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Format entity date for display
   */
  formatDate(dateString: string, locale: string = 'en-US'): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Format entity datetime for display
   */
  formatDateTime(dateString: string, locale: string = 'en-US'): string {
    const date = new Date(dateString);
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get relative time string (e.g., "2 hours ago")
   */
  getRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return this.formatDate(dateString);
  }

  /**
   * Sort entities by creation date
   */
  sortByCreatedAt(entities: T[], ascending: boolean = false): T[] {
    return [...entities].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Sort entities by update date
   */
  sortByUpdatedAt(entities: T[], ascending: boolean = false): T[] {
    return [...entities].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Filter entities by date range
   */
  filterByDateRange(
    entities: T[],
    startDate: Date,
    endDate: Date,
    dateField: 'createdAt' | 'updatedAt' = 'createdAt'
  ): T[] {
    return entities.filter(entity => {
      const entityDate = new Date(entity[dateField]);
      return entityDate >= startDate && entityDate <= endDate;
    });
  }

  /**
   * Group entities by date (day)
   */
  groupByDate(entities: T[], dateField: 'createdAt' | 'updatedAt' = 'createdAt'): Record<string, T[]> {
    return entities.reduce((groups, entity) => {
      const date = new Date(entity[dateField]);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entity);
      
      return groups;
    }, {} as Record<string, T[]>);
  }

  /**
   * Create pagination response
   */
  createPaginationResponse<U>(
    data: U[],
    total: number,
    page: number,
    limit: number
  ): PaginationResponse<U> {
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      data,
      total,
      page,
      limit,
      hasMore,
      totalPages,
    };
  }

  /**
   * Validate pagination parameters
   */
  validatePaginationParams(params: PaginationParams): PaginationParams {
    return {
      page: Math.max(1, params.page || 1),
      limit: Math.min(Math.max(1, params.limit || 10), 100),
      sortBy: params.sortBy,
      sortOrder: params.sortOrder || 'desc',
    };
  }
}

/**
 * Generic repository interface
 */
export interface BaseRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(params?: PaginationParams): Promise<PaginationResponse<T>>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  search(params: SearchParams): Promise<PaginationResponse<T>>;
}

/**
 * Cache interface for entities
 */
export interface EntityCache<T extends BaseEntity> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

/**
 * Event interface for entity changes
 */
export interface EntityEvent<T extends BaseEntity> {
  type: 'created' | 'updated' | 'deleted';
  entity: T;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Entity event handler interface
 */
export interface EntityEventHandler<T extends BaseEntity> {
  handle(event: EntityEvent<T>): Promise<void>;
}

/**
 * Audit log interface
 */
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  changes?: Record<string, { old?: unknown; new?: unknown }>;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Entity validation service interface
 */
export interface EntityValidationService<T> {
  validate(data: T): ValidationResult<T>;
  validatePartial(data: Partial<T>): ValidationResult<Partial<T>>;
  validateField(field: string, value: unknown): ValidationResult<unknown>;
}

/**
 * Common entity status types
 */
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived' | 'deleted';

/**
 * Common entity priority types
 */
export type EntityPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Common entity visibility types
 */
export type EntityVisibility = 'public' | 'private' | 'internal' | 'restricted';

/**
 * Utility functions for common operations
 */
export const EntityUtils = {
  /**
   * Generate a UUID v4
   */
  generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Get current ISO timestamp
   */
  getCurrentTimestamp(): string {
    return new Date().toISOString();
  },

  /**
   * Sanitize string for safe display
   */
  sanitizeString(str: string): string {
    return str.replace(/[<>\"'&]/g, (match) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return escapeMap[match];
    });
  },

  /**
   * Deep clone an object
   */
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Check if two objects are equal (shallow comparison)
   */
  isEqual<T extends Record<string, unknown>>(obj1: T, obj2: T): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  },

  /**
   * Omit fields from an object
   */
  omit<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },

  /**
   * Pick fields from an object
   */
  pick<T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },
};
