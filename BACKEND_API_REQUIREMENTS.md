# Backend API Requirements Document

**Project:** Predict Galore Front Office  
**Base URL:** `https://apidev.predictgalore.com`  
**Date:** January 7, 2026  
**Version:** 1.0

---

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Predictions](#2-predictions)
3. [Live Scores](#3-live-scores)
4. [News](#4-news)
5. [Profile & User Management](#5-profile--user-management)
6. [Notifications](#6-notifications)
7. [Search](#7-search)
8. [Contact](#8-contact)

---

## Global Configuration

### Headers Required for All Requests

```
Content-Type: application/json
Authorization: Bearer {token}  // For authenticated endpoints
```

### Standard Response Format

```json
{
  "success": boolean,
  "message": string,
  "errors": string | null,
  "data": any
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed error message",
  "data": null
}
```

---

## 1. Authentication & Authorization

### 1.1 User Login

**Endpoint:** `POST /api/v1/auth/user/login`  
**Auth Required:** No

**Request Body:**

```json
{
  "username": "string (email or username)",
  "password": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "isEmailVerified": boolean,
      "phoneNumber": "string",
      "countryCode": "string",
      "createdAt": "ISO 8601 string",
      "updatedAt": "ISO 8601 string"
    },
    "token": "JWT token string",
    "refreshToken": "string (optional)",
    "expiresIn": number
  }
}
```

---

### 1.2 User Registration

**Endpoint:** `POST /api/v1/auth/user/register`  
**Auth Required:** No

**Request Body:**

```json
{
  "firstName": "string (min 2 chars, trimmed)",
  "lastName": "string (min 2 chars, trimmed)",
  "email": "string (email format, lowercase, trimmed)",
  "phoneNumber": "string (digits only)",
  "countryCode": "string (e.g., +234)",
  "password": "string (min 8 chars)",
  "userTypeId": number (optional, default: 2)
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "isEmailVerified": boolean
    },
    "token": "JWT token string",
    "requiresEmailVerification": boolean
  }
}
```

---

### 1.3 Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot_password/confirm_token`  
**Auth Required:** No

**Request Body:**

```json
{
  "email": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

---

### 1.4 Reset Password

**Endpoint:** `POST /api/v1/auth/forgot_password/reset_password`  
**Auth Required:** No

**Request Body:**

```json
{
  "token": "string (reset token from email)",
  "password": "string (new password)",
  "confirmPassword": "string (must match password)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### 1.5 Verify Email

**Endpoint:** `POST /api/v1/auth/verify-email`  
**Auth Required:** No

**Request Body:**

```json
{
  "token": "string (verification token from email)",
  "email": "string (optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "emailVerified": true
  }
}
```

---

### 1.6 Resend Verification Email

**Endpoint:** `POST /api/v1/auth/resend-verification`  
**Auth Required:** No

**Request Body:**

```json
{
  "email": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Verification email sent"
}
```

---

### 1.7 Get User Profile

**Endpoint:** `GET /api/v1/auth/user/me`  
**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "phoneNumber": "string",
      "countryCode": "string",
      "isEmailVerified": boolean,
      "avatar": "string (URL, optional)",
      "createdAt": "ISO 8601 string",
      "updatedAt": "ISO 8601 string"
    }
  }
}
```

---

### 1.8 Update User Profile

**Endpoint:** `PUT /api/v1/auth/user/profile/update`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phoneNumber": "string (optional)",
  "avatar": "string (URL, optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      /* updated user object */
    }
  }
}
```

---

### 1.9 Change Password

**Endpoint:** `POST /api/v1/auth/change_password`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmNewPassword": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 1.10 Logout

**Endpoint:** `POST /api/v1/auth/logout`  
**Auth Required:** Yes

**Request Body:**

```json
{}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. Predictions

### 2.1 Get Sports List

**Endpoint:** `GET /api/v1/sports`  
**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "name": "string (e.g., Football, Basketball, Tennis)",
      "icon": "string (optional)",
      "isActive": boolean
    }
  ]
}
```

**Alternative Response Format (both supported):**

```json
[
  {
    "id": number,
    "name": "string",
    "icon": "string",
    "isActive": boolean
  }
]
```

---

### 2.2 Get Leagues by Sport

**Endpoint:** `GET /api/v1/predictions/leagues?sportId={sportId}`  
**Auth Required:** Yes

**Query Parameters:**

- `sportId` (number, required): ID of the sport

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "name": "string (e.g., Premier League, La Liga)",
      "sportId": number,
      "country": "string (optional)",
      "logo": "string (URL, optional)",
      "isActive": boolean
    }
  ]
}
```

**Alternative Response Format (both supported):**

```json
[
  {
    "id": number,
    "name": "string",
    "sportId": number,
    "country": "string",
    "logo": "string",
    "isActive": boolean
  }
]
```

---

### 2.3 Get Predictions/Matches

**Endpoint:** `GET /api/v1/predictions/matches`  
**Auth Required:** Yes

**Query Parameters:**

- `sportId` (number, optional): Filter by sport ID
- `leagueId` (number, optional): Filter by league ID
- `page` (number, optional, default: 1): Page number
- `pageSize` (number, optional, default: 20): Items per page (max 100)
- `fromUtc` (ISO 8601 string, optional): Start date/time filter
- `toUtc` (ISO 8601 string, optional): End date/time filter
- `status` (string, optional, default: "Prediction"): Match status

**Response (200):**

```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "id": number,
        "sportId": number,
        "sportName": "string",
        "leagueId": number,
        "leagueName": "string",
        "homeTeam": "string",
        "awayTeam": "string",
        "homeTeamLogo": "string (URL, optional)",
        "awayTeamLogo": "string (URL, optional)",
        "kickoffUtc": "ISO 8601 string",
        "prediction": "string (e.g., Home Win, Away Win, Draw)",
        "confidence": number (0-100),
        "odds": {
          "home": number,
          "draw": number,
          "away": number
        },
        "status": "string (Prediction, Live, Finished)",
        "analysis": "string (optional, brief prediction reason)"
      }
    ],
    "total": number,
    "page": number,
    "pageSize": number,
    "hasMore": boolean
  }
}
```

**Alternative Response Format (both supported):**

```json
{
  "data": [ /* array of predictions */ ],
  "totalItems": number,
  "currentPage": number,
  "pageSize": number,
  "totalPages": number
}
```

---

### 2.4 Get Prediction Detail

**Endpoint:** `GET /api/v1/predictions/matches/{matchId}`  
**Auth Required:** Yes

**Path Parameters:**

- `matchId` (number, required): Match ID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "prediction": {
      /* same structure as match in 2.3 */
    },
    "detailed": {
      "matchId": number,
      "headToHead": {
        "totalMatches": number,
        "homeWins": number,
        "awayWins": number,
        "draws": number,
        "recentMatches": [
          {
            "date": "ISO 8601 string",
            "homeTeam": "string",
            "awayTeam": "string",
            "homeScore": number,
            "awayScore": number,
            "competition": "string"
          }
        ]
      },
      "recentForm": {
        "homeTeam": {
          "form": ["W", "W", "D", "L", "W"],
          "goalsScored": number,
          "goalsConceded": number,
          "cleanSheets": number,
          "recentMatches": [
            {
              "date": "ISO 8601 string",
              "opponent": "string",
              "result": "W" | "D" | "L",
              "homeScore": number,
              "awayScore": number,
              "isHome": boolean
            }
          ]
        },
        "awayTeam": { /* same structure as homeTeam */ }
      },
      "statistics": {
        "homeTeam": {
          "avgGoalsScored": number,
          "avgGoalsConceded": number,
          "winPercentage": number,
          "scoringProbability": number,
          "cleanSheetProbability": number
        },
        "awayTeam": { /* same structure as homeTeam */ }
      },
      "injuries": {
        "homeTeam": [
          {
            "playerId": number,
            "playerName": "string",
            "position": "string",
            "injuryType": "string",
            "expectedReturn": "ISO 8601 string (optional)"
          }
        ],
        "awayTeam": [ /* same structure as homeTeam */ ]
      },
      "suspensions": {
        "homeTeam": [
          {
            "playerId": number,
            "playerName": "string",
            "position": "string",
            "reason": "string (e.g., Yellow cards accumulation)",
            "matchesMissing": number
          }
        ],
        "awayTeam": [ /* same structure as homeTeam */ ]
      },
      "weatherConditions": {
        "temperature": number,
        "condition": "string (e.g., Clear, Rainy, Cloudy)",
        "humidity": number,
        "windSpeed": number
      },
      "venue": {
        "name": "string",
        "city": "string",
        "capacity": number,
        "surface": "string (e.g., Grass, Artificial)"
      },
      "predictionBreakdown": {
        "homeWinProbability": number (0-100),
        "drawProbability": number (0-100),
        "awayWinProbability": number (0-100),
        "expectedGoals": {
          "home": number,
          "away": number
        },
        "keyFactors": [
          {
            "factor": "string (e.g., Home advantage, Recent form)",
            "impact": "High" | "Medium" | "Low",
            "description": "string"
          }
        ]
      },
      "lastUpdated": "ISO 8601 string"
    }
  }
}
```

---

### 2.5 Get Match Odds

**Endpoint:** `GET /api/v1/predictions/matches/{matchId}/odds`  
**Auth Required:** Yes

**Path Parameters:**

- `matchId` (number, required): Match ID

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "marketName": "string (e.g., Match Result, Over/Under 2.5, Both Teams to Score)",
      "marketType": "string (e.g., 1X2, OU, BTTS)",
      "outcomes": [
        {
          "name": "string (e.g., Home Win, Over 2.5, Yes)",
          "odds": number,
          "probability": number (0-100, optional)
        }
      ],
      "lastUpdated": "ISO 8601 string"
    }
  ]
}
```

---

### 2.6 Get League Table

**Endpoint:** `GET /api/v1/predictions/leagues/{leagueId}/table`  
**Auth Required:** Yes

**Path Parameters:**

- `leagueId` (number, required): League ID

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "position": number,
      "teamId": number,
      "teamName": "string",
      "teamLogo": "string (URL, optional)",
      "played": number,
      "won": number,
      "drawn": number,
      "lost": number,
      "goalsFor": number,
      "goalsAgainst": number,
      "goalDifference": number,
      "points": number,
      "form": ["W", "W", "D", "L", "W"]
    }
  ]
}
```

---

## 3. Live Scores

### 3.1 Get Live Scores

**Endpoint:** `GET /api/v1/livescores`  
**Auth Required:** Yes

**Query Parameters:**

- `sport` (string, optional): Filter by sport name (e.g., "football", "basketball")
- `leagueId` (number, optional): Filter by league ID

**Response (200):**

```json
{
  "success": true,
  "message": "Live scores retrieved",
  "errors": null,
  "data": [
    {
      "providerFixtureId": number,
      "league": "string",
      "homeTeam": "string",
      "awayTeam": "string",
      "homeTeamLogo": "string (URL, optional)",
      "awayTeamLogo": "string (URL, optional)",
      "homeScore": number,
      "awayScore": number,
      "status": "1H" | "2H" | "HT" | "ET" | "FT" | "POSTPONED" | "CANCELLED",
      "elapsed": number,
      "kickoffUtc": "ISO 8601 string",
      "events": {
        "goals": [
          {
            "team": "home" | "away",
            "player": "string",
            "minute": number
          }
        ],
        "homeYellowCards": number,
        "awayYellowCards": number,
        "homeRedCards": number,
        "awayRedCards": number
      }
    }
  ]
}
```

**Frontend Note:** Data is grouped into sections by status (Live Now, Upcoming, Finished) on the
client side.

---

### 3.2 Get Fixture Scores by ID

**Endpoint:** `GET /api/v1/livescores/fixture/{fixtureId}`  
**Auth Required:** Yes

**Path Parameters:**

- `fixtureId` (number, required): Fixture ID

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* single fixture object - same structure as item in 3.1 */
  }
}
```

---

### 3.3 Get League Scores

**Endpoint:** `GET /api/v1/livescores/league/{leagueId}`  
**Auth Required:** Yes

**Path Parameters:**

- `leagueId` (number, required): League ID

**Response (200):**

```json
{
  "success": true,
  "data": [
    /* array of fixtures - same structure as items in 3.1 */
  ]
}
```

---

### 3.4 Get Detailed Live Match

**Endpoint:** `GET /api/v1/live/match/{matchId}`  
**Auth Required:** Yes

**Path Parameters:**

- `matchId` (string, required): Match ID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "matchId": "string",
    "currentMinute": number,
    "addedTime": number (minutes of added time),
    "half": "first" | "second" | "extra" | "finished",
    "events": [
      {
        "id": "string",
        "type": "goal" | "yellow_card" | "red_card" | "substitution" | "penalty" | "var",
        "team": "home" | "away",
        "minute": number,
        "player": "string",
        "assistedBy": "string (optional)",
        "details": "string (optional)"
      }
    ],
    "commentary": [
      {
        "minute": number,
        "text": "string",
        "timestamp": "ISO 8601 string"
      }
    ],
    "stats": {
      "homeTeam": {
        "form": ["W", "W", "D", "L"],
        "recentForm": ["L", "D", "W", "L", "W"],
        "headToHeadWins": ["W", "W", "D", "L"],
        "goalsPerGame": number,
        "goalsConcededPerGame": number,
        "winPercentage": number,
        "possessionPercentage": number,
        "cleanSheets": number,
        "shotsOnTarget": number,
        "totalShots": number,
        "corners": number,
        "fouls": number,
        "offsides": number,
        "yellowCards": number,
        "redCards": number
      },
      "awayTeam": { /* same structure as homeTeam */ },
      "homePossession": number,
      "awayPossession": number,
      "homeShotsOnTarget": number,
      "awayShotsOnTarget": number,
      "homeTotalShots": number,
      "awayTotalShots": number,
      "homeCorners": number,
      "awayCorners": number,
      "homeFouls": number,
      "awayFouls": number,
      "homeYellowCards": number,
      "awayYellowCards": number,
      "homeRedCards": number,
      "awayRedCards": number,
      "homeOffsides": number,
      "awayOffsides": number,
      "homeTopScorer": {
        "id": "string",
        "name": "string",
        "position": "string",
        "rating": number,
        "age": number,
        "height": "string (e.g., 178cm)",
        "weight": "string (e.g., 72kg)",
        "matches": number,
        "goals": number,
        "assists": number,
        "yellowCards": number,
        "teamId": "string"
      },
      "awayTopScorer": { /* same structure as homeTopScorer */ }
    },
    "lastUpdated": "ISO 8601 string",
    "nextEventEstimate": "string (e.g., 50th minute)"
  }
}
```

---

## 4. News

### 4.1 Get News List

**Endpoint:** `GET /api/v1/news`  
**Auth Required:** Yes

**Query Parameters:**

- `page` (number, optional, default: 1): Page number
- `pageSize` (number, optional, default: 10): Items per page
- `category` (string, optional): Filter by category (e.g., "Analysis", "Transfers", "Match Reports")
- `sport` (string, optional): Filter by sport (e.g., "Football", "Basketball")
- `isFeatured` (boolean, optional): Filter featured news
- `isBreaking` (boolean, optional): Filter breaking news
- `search` (string, optional, min 2 chars): Search term

**Response (200):**

```json
{
  "success": true,
  "message": "News retrieved successfully",
  "errors": null,
  "data": {
    "items": [
      {
        "id": number,
        "title": "string",
        "content": "string (full article content in HTML or markdown)",
        "summary": "string (brief summary, optional)",
        "category": "string",
        "sport": "string",
        "author": "string",
        "publishedAt": "ISO 8601 string",
        "updatedAt": "ISO 8601 string",
        "imageUrl": "string (URL, optional)",
        "thumbnailUrl": "string (URL, optional)",
        "tags": ["string"],
        "viewCount": number,
        "likeCount": number,
        "isFeatured": boolean,
        "isBreaking": boolean
      }
    ],
    "total": number,
    "page": number,
    "pageSize": number,
    "totalPages": number
  }
}
```

---

### 4.2 Get News Detail

**Endpoint:** `GET /api/v1/news/{id}`  
**Auth Required:** Yes

**Path Parameters:**

- `id` (number, required): News ID

**Response (200):**

```json
{
  "success": true,
  "message": "News retrieved",
  "errors": null,
  "data": {
    /* single news object - same structure as item in 4.1 */
  }
}
```

---

### 4.3 Get Breaking News

**Endpoint:** `GET /api/v1/news/breaking`  
**Auth Required:** Yes

**Query Parameters:**

- `limit` (number, optional, default: 3): Number of breaking news items to return

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      /* array of news objects - same structure as items in 4.1, filtered by isBreaking: true */
    ]
  }
}
```

---

### 4.4 Get News by Category

**Endpoint:** `GET /api/v1/news/category/{category}`  
**Auth Required:** Yes

**Path Parameters:**

- `category` (string, required): Category name

**Query Parameters:**

- `page` (number, optional, default: 1)
- `pageSize` (number, optional, default: 10)

**Response (200):**

```json
{
  /* same structure as 4.1 */
}
```

---

## 5. Profile & User Management

### 5.1 Get User Profile Details

**Endpoint:** `GET /api/v1/auth/user/me`  
**Auth Required:** Yes

**(Same as 1.7 - documented above)**

---

### 5.2 Update Profile

**Endpoint:** `PUT /api/v1/auth/user/profile/update`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phoneNumber": "string (optional)",
  "countryCode": "string (optional)",
  "avatar": "string (URL, optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* updated user object */
  }
}
```

---

### 5.3 Get Current Subscription

**Endpoint:** `GET /api/v1/subscriptions/plans`  
**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": number,
    "userId": string,
    "planCode": "free" | "premium" | "pro",
    "planName": "string",
    "status": "active" | "cancelled" | "expired" | "pending",
    "startDate": "ISO 8601 string",
    "endDate": "ISO 8601 string",
    "autoRenew": boolean,
    "amount": number,
    "currency": "string (e.g., USD, NGN)",
    "billingCycle": "monthly" | "yearly",
    "nextBillingDate": "ISO 8601 string (optional)",
    "features": [
      {
        "name": "string",
        "enabled": boolean
      }
    ]
  }
}
```

---

### 5.4 Get Subscription Plans

**Endpoint:** `GET /api/v1/subscriptions/plans?onlyActive={boolean}`  
**Auth Required:** Yes

**Query Parameters:**

- `onlyActive` (boolean, optional, default: true): Return only active plans

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "name": "string (e.g., Free, Premium, Pro)",
      "planCode": "string",
      "amount": number,
      "duration": number (in days),
      "isActive": boolean,
      "features": [
        {
          "name": "string",
          "description": "string",
          "included": boolean
        }
      ]
    }
  ]
}
```

---

### 5.5 Cancel Subscription

**Endpoint:** `POST /api/v1/subscriptions/cancel`  
**Auth Required:** Yes

**Request Body:**

```json
{}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Subscription cancelled successfully"
}
```

---

### 5.6 Get Transaction History

**Endpoint:** `GET /api/v1/transactions`  
**Auth Required:** Yes

**Query Parameters:**

- `page` (number, optional, default: 1)
- `pageSize` (number, optional, default: 20)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "userId": string,
      "type": "subscription" | "refund" | "payment",
      "amount": number,
      "currency": "string",
      "status": "completed" | "pending" | "failed" | "refunded",
      "description": "string",
      "transactionDate": "ISO 8601 string",
      "paymentMethod": "string (e.g., card, bank_transfer, paypal)",
      "reference": "string",
      "metadata": {
        "planName": "string (optional)",
        "planCode": "string (optional)"
      }
    }
  ]
}
```

---

### 5.7 Get Followings (Teams)

**Endpoint:** `GET /api/v1/teams/following`  
**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "teamId": number,
      "teamName": "string",
      "teamLogo": "string (URL, optional)",
      "sport": "string",
      "league": "string",
      "country": "string",
      "isFollowing": true,
      "notificationsEnabled": boolean,
      "followedAt": "ISO 8601 string"
    }
  ]
}
```

---

### 5.8 Get All Teams (with follow status)

**Endpoint:** `GET /api/v1/teams/all-with-status`  
**Auth Required:** Yes

**Query Parameters:**

- `sport` (string, optional): Filter by sport
- `league` (string, optional): Filter by league
- `country` (string, optional): Filter by country

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "teamId": number,
      "teamName": "string",
      "teamLogo": "string (URL, optional)",
      "sport": "string",
      "league": "string",
      "country": "string",
      "isFollowing": boolean,
      "notificationsEnabled": boolean
    }
  ]
}
```

---

### 5.9 Follow Team

**Endpoint:** `POST /api/v1/teams/follow`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "teamId": number,
  "notificationsEnabled": boolean (optional, default: true)
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Team followed successfully"
}
```

---

### 5.10 Unfollow Team

**Endpoint:** `POST /api/v1/teams/unfollow/{teamId}`  
**Auth Required:** Yes

**Path Parameters:**

- `teamId` (number, required): Team ID

**Request Body:**

```json
{}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Team unfollowed successfully"
}
```

---

### 5.11 Update Team Notifications

**Endpoint:** `PUT /api/v1/teams/{teamId}/notifications`  
**Auth Required:** Yes

**Path Parameters:**

- `teamId` (number, required): Team ID

**Request Body:**

```json
boolean (true or false)
```

**Response (200):**

```json
{
  "success": true,
  "message": "Notification settings updated"
}
```

---

### 5.12 Change Password

**Endpoint:** `POST /api/v1/admin/settings/password/change`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "oldPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 5.13 Toggle Two-Factor Authentication

**Endpoint:** `POST /api/v1/admin/settings/2fa/toggle`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "enable": boolean
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Two-factor authentication toggled successfully",
  "data": {
    "enabled": boolean,
    "qrCode": "string (base64 or URL, only when enabling for first time)",
    "backupCodes": ["string"] (only when enabling)
  }
}
```

---

### 5.14 Get Notification Settings

**Endpoint:** `GET /api/v1/profile/notification-settings`  
**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "userId": string,
    "emailNotifications": {
      "predictions": boolean,
      "liveScores": boolean,
      "news": boolean,
      "teamUpdates": boolean,
      "promotions": boolean
    },
    "pushNotifications": {
      "predictions": boolean,
      "liveScores": boolean,
      "news": boolean,
      "teamUpdates": boolean,
      "matchReminders": boolean
    },
    "smsNotifications": {
      "enabled": boolean,
      "matchReminders": boolean,
      "importantUpdates": boolean
    },
    "quoteboard": {
      "enabled": boolean,
      "updateFrequency": "realtime" | "hourly" | "daily"
    }
  }
}
```

---

### 5.15 Update Notification Settings

**Endpoint:** `PUT /api/v1/profile/notification-settings`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "emailNotifications": {
    "predictions": boolean (optional),
    "liveScores": boolean (optional),
    "news": boolean (optional),
    "teamUpdates": boolean (optional),
    "promotions": boolean (optional)
  },
  "pushNotifications": {
    "predictions": boolean (optional),
    "liveScores": boolean (optional),
    "news": boolean (optional),
    "teamUpdates": boolean (optional),
    "matchReminders": boolean (optional)
  },
  "smsNotifications": {
    "enabled": boolean (optional),
    "matchReminders": boolean (optional),
    "importantUpdates": boolean (optional)
  },
  "quoteboard": {
    "enabled": boolean (optional),
    "updateFrequency": "realtime" | "hourly" | "daily" (optional)
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Notification settings updated",
  "data": {
    /* updated notification settings object */
  }
}
```

---

### 5.16 Delete Account

**Endpoint:** `DELETE /api/v1/user/delete`  
**Auth Required:** Yes

**Request Body:**

```json
{
  "password": "string (for confirmation)",
  "reason": "string (optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 6. Notifications

### 6.1 Get Notifications List

**Endpoint:** `GET /api/v1/notifications`  
**Auth Required:** Yes

**Query Parameters:**

- `page` (number, optional, default: 1)
- `pageSize` (number, optional, default: 20)
- `isRead` (boolean, optional): Filter by read/unread status
- `notificationType` (string, optional): Filter by type (e.g., "match", "prediction", "news",
  "system")

**Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": number,
        "userId": string,
        "title": "string",
        "message": "string",
        "type": "match" | "prediction" | "news" | "team" | "subscription" | "system",
        "isRead": boolean,
        "createdAt": "ISO 8601 string",
        "metadata": {
          "matchId": number (optional),
          "newsId": number (optional),
          "teamId": number (optional),
          "actionUrl": "string (optional)"
        }
      }
    ],
    "total": number,
    "page": number,
    "pageSize": number,
    "unreadCount": number
  }
}
```

---

### 6.2 Get Unread Count

**Endpoint:** `GET /api/v1/notifications/unread-count`  
**Auth Required:** Yes

**Response (200):**

```json
{
  "success": true,
  "data": {
    "unreadCount": number
  }
}
```

---

### 6.3 Mark Notification as Read

**Endpoint:** `PATCH /api/v1/notifications/{id}/read`  
**Auth Required:** Yes

**Path Parameters:**

- `id` (number, required): Notification ID

**Response (200):**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 6.4 Mark All Notifications as Read

**Endpoint:** `POST /api/v1/notifications/read-all`  
**Auth Required:** Yes

**Request Body:**

```json
{}
```

**Response (200):**

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### 6.5 Delete Notification

**Endpoint:** `DELETE /api/v1/notifications/{id}`  
**Auth Required:** Yes

**Path Parameters:**

- `id` (number, required): Notification ID

**Response (200):**

```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## 7. Search

### 7.1 Global Search

**Endpoint:** `GET /api/v1/search`  
**Auth Required:** Yes

**Query Parameters:**

- `query` (string, required, min 2 chars): Search term
- `type` (string, optional): Filter by type ("all", "teams", "leagues", "news", "players")
- `page` (number, optional, default: 1)
- `pageSize` (number, optional, default: 20)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": number | string,
        "type": "team" | "league" | "news" | "player" | "match",
        "title": "string",
        "subtitle": "string (optional)",
        "imageUrl": "string (URL, optional)",
        "description": "string (optional)",
        "url": "string (deep link to item)",
        "metadata": {
          "sport": "string (optional)",
          "country": "string (optional)",
          "category": "string (optional)"
        }
      }
    ],
    "total": number,
    "page": number,
    "pageSize": number,
    "query": "string"
  }
}
```

---

### 7.2 Get Popular/Trending Items

**Endpoint:** `GET /api/v1/search/popular`  
**Auth Required:** Yes

**Query Parameters:**

- `country` (string, optional): Filter by country code (e.g., "NG", "GB")

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "name": "string",
      "type": "team" | "league" | "player",
      "imageUrl": "string (URL, optional)",
      "sport": "string",
      "trendingScore": number,
      "url": "string"
    }
  ]
}
```

---

## 8. Contact

### 8.1 Get Contact Information

**Endpoint:** `GET /api/v1/contact/info`  
**Auth Required:** No

**Response (200):**

```json
{
  "success": true,
  "data": {
    "email": "string",
    "phone": "string",
    "address": "string",
    "workingHours": "string",
    "socialMedia": {
      "facebook": "string (URL, optional)",
      "twitter": "string (URL, optional)",
      "instagram": "string (URL, optional)",
      "linkedin": "string (URL, optional)"
    }
  }
}
```

**Alternative Response Format (both supported):**

```json
{
  "data": {
    /* contact info object */
  }
}
```

---

### 8.2 Submit Contact Form

**Endpoint:** `POST /api/v1/contact`  
**Auth Required:** No

**Request Body:**

```json
{
  "name": "string (min 2 chars)",
  "email": "string (valid email)",
  "phoneNumber": "string (min 8 digits)",
  "subject": "string (required)",
  "message": "string (min 10 chars)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "ticketId": "string (optional)",
    "estimatedResponseTime": "string (optional)"
  }
}
```

**Alternative Response Format (both supported):**

```json
{
  "data": {
    /* submission response object */
  }
}
```

---

## Important Notes for Backend Developer

### 1. Authentication & Security

- All endpoints marked "Auth Required: Yes" must validate JWT token in
  `Authorization: Bearer {token}` header
- Tokens should expire after a reasonable period (recommendation: 24 hours for access token, 7 days
  for refresh token)
- Implement rate limiting on all endpoints (recommendation: 100 requests/minute per user)
- Implement CORS policy allowing frontend domain: `https://predictgalore.com`

### 2. Response Flexibility

- The frontend supports multiple response formats (direct arrays/objects and wrapped responses)
- Please maintain the `success`, `message`, `errors`, and `data` wrapper structure where specified
- For errors, always return appropriate HTTP status codes (400, 401, 403, 404, 500) with error
  details

### 3. Data Validation

- Validate all request parameters on the backend
- Return clear validation error messages in the format:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": "Field 'email' is required and must be a valid email address",
    "data": null
  }
  ```

### 4. Pagination

- Default page size: 20 items
- Maximum page size: 100 items
- Always include pagination metadata in responses

### 5. Date/Time Handling

- All dates should be in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Store dates in UTC in the database
- Frontend handles timezone conversion

### 6. Image URLs

- Return full URLs for all images (logo, avatar, thumbnails, etc.)
- Images should be accessible without authentication
- Recommended image sizes:
  - Thumbnails: 400x400px
  - Article images: 800x600px
  - Team logos: 200x200px

### 7. Real-time Updates

- Live scores should be updated every 30-60 seconds
- Consider implementing WebSocket connections for live match updates (future enhancement)

### 8. Performance

- Implement caching for frequently accessed data (sports list, league list, news)
- Optimize database queries with proper indexing
- Consider pagination for all list endpoints

### 9. Error Codes

Use standard HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

### 10. Mock Data Mode

The frontend has a data source toggle (`DATA_SOURCE_MODE`) that can be set to:

- `'api'`: Use live backend API only
- `'mock'`: Use mock data only (for development)
- `'api-with-fallback'`: Try API first, fall back to mock data on error

This allows frontend development to continue even when backend endpoints are not yet ready.

---

## Testing Checklist

Please ensure all endpoints:

- ✅ Return correct response format
- ✅ Handle authentication properly
- ✅ Validate input data
- ✅ Return appropriate HTTP status codes
- ✅ Support pagination where applicable
- ✅ Handle edge cases (empty results, invalid IDs, etc.)
- ✅ Include proper error messages
- ✅ Perform adequately under load
- ✅ Log errors for debugging

---

## Contact Information

**Frontend Developer:**

- Email: [Your Email]
- Slack: [Your Slack Handle]

**Questions or Clarifications:**  
Please reach out if any endpoint specification is unclear or if you need additional information
about expected behavior.

---

**Document End**
